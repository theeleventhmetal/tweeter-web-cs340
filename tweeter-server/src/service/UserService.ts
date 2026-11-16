// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, FakeData, User } from "tweeter-shared";

export class UserService {
  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user, FakeData.instance.authToken];
  }

  public async logout(authToken: AuthToken): Promise<void> {
    // No server-side session state to invalidate yet at this milestone -
    // FakeData has no concept of an active session.
  }

  public async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
    return FakeData.instance.findUserByAlias(alias);
  }
}
