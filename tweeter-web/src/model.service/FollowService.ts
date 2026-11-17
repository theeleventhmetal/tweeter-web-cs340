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