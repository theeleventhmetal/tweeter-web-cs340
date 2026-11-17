// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, FakeData, User } from "tweeter-shared";

export class FollowService {
  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    return FakeData.instance.isFollower();
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return FakeData.instance.getFolloweeCount(user.alias);
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return FakeData.instance.getFollowerCount(user.alias);
  }
}
