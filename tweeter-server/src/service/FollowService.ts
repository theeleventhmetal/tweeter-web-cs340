// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, User } from "tweeter-shared";
import { DaoFactory } from "../dao/DaoFactory";
import { FollowDao } from "../dao/interface/FollowDao";
import { UserDao, UserEntity } from "../dao/interface/UserDao";
import { AuthorizationService } from "./AuthorizationService";

export class FollowService {
  private followDao: FollowDao;
  private userDao: UserDao;
  private authorizationService: AuthorizationService;

  public constructor(daoFactory: DaoFactory) {
    this.followDao = daoFactory.createFollowDao();
    this.userDao = daoFactory.createUserDao();
    this.authorizationService = new AuthorizationService(daoFactory);
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    await this.authorizationService.validate(authToken);

    return this.followDao.isFollower(user.alias, selectedUser.alias);
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    await this.authorizationService.validate(authToken);

    return this.followDao.getFolloweeCount(user.alias);
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    await this.authorizationService.validate(authToken);

    return this.followDao.getFollowerCount(user.alias);
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const followerAlias = await this.authorizationService.validate(authToken);

    await this.followDao.follow(followerAlias, userToFollow.alias);

    const followerCount = await this.followDao.getFollowerCount(
      userToFollow.alias
    );
    const followeeCount = await this.followDao.getFolloweeCount(
      userToFollow.alias
    );

    return [followerCount, followeeCount];
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const followerAlias = await this.authorizationService.validate(authToken);

    await this.followDao.unfollow(followerAlias, userToUnfollow.alias);

    const followerCount = await this.followDao.getFollowerCount(
      userToUnfollow.alias
    );
    const followeeCount = await this.followDao.getFolloweeCount(
      userToUnfollow.alias
    );

    return [followerCount, followeeCount];
  }

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    await this.authorizationService.validate(authToken);

    const [aliases, hasMore] = await this.followDao.getPageOfFolloweeAliases(
      userAlias,
      pageSize,
      lastItem?.alias ?? null
    );

    return [await this.resolveUsers(aliases), hasMore];
  }

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    await this.authorizationService.validate(authToken);

    const [aliases, hasMore] = await this.followDao.getPageOfFollowerAliases(
      userAlias,
      pageSize,
      lastItem?.alias ?? null
    );

    return [await this.resolveUsers(aliases), hasMore];
  }

  // Resolves aliases to full User records with one UserDao.getUser call per
  // alias - an intentional N+1 for Milestone 4A (the spec's own scope split
  // defers this kind of read optimization to Part B).
  private async resolveUsers(aliases: string[]): Promise<User[]> {
    const userEntities = await Promise.all(
      aliases.map((alias) => this.userDao.getUser(alias))
    );

    return userEntities
      .filter((entity): entity is UserEntity => entity != null)
      .map(
        (entity) =>
          new User(
            entity.firstName,
            entity.lastName,
            entity.alias,
            entity.imageUrl
          )
      );
  }
}
