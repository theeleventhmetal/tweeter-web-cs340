// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, User } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class FollowService implements Service{
  private serverFacade = new ServerFacade();

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null,
  ): Promise<[User[], boolean]> {
    return this.serverFacade.getFollowees({
      authToken: authToken.toDto(),
      userAlias,
      pageSize,
      lastItem: lastItem?.toDto() ?? null,
    });
  }

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null,
  ): Promise<[User[], boolean]> {
    return this.serverFacade.getFollowers({
      authToken: authToken.toDto(),
      userAlias,
      pageSize,
      lastItem: lastItem?.toDto() ?? null,
    });
  }

  getIsFollowerStatus = async (
    authToken: AuthToken,
    user: User,
    selectedUser: User,
  ): Promise<boolean> => {
    return this.serverFacade.getIsFollowerStatus({
      authToken: authToken.toDto(),
      user: user.toDto(),
      selectedUser: selectedUser.toDto(),
    });
  };
  getFolloweeCount = async (
    authToken: AuthToken,
    user: User,
  ): Promise<number> => {
    return this.serverFacade.getFolloweeCount({
      authToken: authToken.toDto(),
      user: user.toDto(),
    });
  };

  getFollowerCount = async (
    authToken: AuthToken,
    user: User,
  ): Promise<number> => {
    return this.serverFacade.getFollowerCount({
      authToken: authToken.toDto(),
      user: user.toDto(),
    });
  };

  follow = async (
    authToken: AuthToken,
    userToFollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> => {
    return this.serverFacade.follow({
      authToken: authToken.toDto(),
      targetUser: userToFollow.toDto(),
    });
  };

  unfollow = async (
    authToken: AuthToken,
    userToUnfollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> => {
    return this.serverFacade.unfollow({
      authToken: authToken.toDto(),
      targetUser: userToUnfollow.toDto(),
    });
  };
}