// AI-assisted: see AI-ATTRIBUTION.md
import { AuthRequest, AuthResponse, AuthToken, CountResponse, GetUserRequest, GetUserResponse, IsFollowerRequest, IsFollowerResponse, RegisterRequest, TweeterRequest, TweeterResponse, User, UserCountRequest } from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://9n40e5oxh2.execute-api.us-east-1.amazonaws.com/Prod";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async login(request: AuthRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      AuthRequest,
      AuthResponse
    >(request, "/login");

    if (!response.success) {
      throw new Error(response.message ?? "Login failed");
    }

    const user = User.fromDto(response.user);
    const authToken = AuthToken.fromDto(response.authToken);

    if (user == null || authToken == null) {
      throw new Error("Invalid login response from server");
    }

    return [user, authToken];
  }

  public async logout(request: TweeterRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      TweeterRequest,
      TweeterResponse>(request, "/logout");

    if (!response.success) {
      throw new Error(response.message ?? "Logout failed")
    }
  }

  public async getUser(request: GetUserRequest): Promise<User | null> {
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetUserResponse
    >(request, "/get-user");

    if (!response.success) {
      throw new Error(response.message ?? "Get user failed");
    }

    return User.fromDto(response.user);
  }

  public async register(request: RegisterRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      RegisterRequest,
      AuthResponse
    >(request, "/register");

    if (!response.success) {
      throw new Error(response.message ?? "Register failed");
    }

    const user = User.fromDto(response.user);
    const authToken = AuthToken.fromDto(response.authToken);

    if (user == null || authToken == null) {
      throw new Error("Invalid register response from server");
    }

    return [user, authToken];
  }

  public async getIsFollowerStatus(request: IsFollowerRequest): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      IsFollowerRequest,
      IsFollowerResponse
    >(request, "/is-follower");

    if (!response.success) {
      throw new Error(response.message ?? "Get is-follower status failed");
    }

    return response.isFollower;
  }

  public async getFolloweeCount(request: UserCountRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      UserCountRequest,
      CountResponse
    >(request, "/followee-count");

    if (!response.success) {
      throw new Error(response.message ?? "Get followee count failed");
    }

    return response.count;
  }

  public async getFollowerCount(request: UserCountRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      UserCountRequest,
      CountResponse
    >(request, "/follower-count");

    if (!response.success) {
      throw new Error(response.message ?? "Get follower count failed");
    }

    return response.count;
  }
}
