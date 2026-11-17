// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, User, FakeData } from "tweeter-shared";
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
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
  }

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null,
  ): Promise<[User[], boolean]> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
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
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(authToken, userToFollow);
    const followeeCount = await this.getFolloweeCount(authToken, userToFollow);

    return [followerCount, followeeCount];
  };

  unfollow = async (
    authToken: AuthToken,
    userToUnfollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> => {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(authToken, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(authToken, userToUnfollow);

    return [followerCount, followeeCount];
  };
}