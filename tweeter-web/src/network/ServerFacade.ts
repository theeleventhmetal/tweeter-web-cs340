// AI-assisted: see AI-ATTRIBUTION.md
import { AuthRequest, AuthResponse, AuthToken, User } from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL = "https://9n40e5oxh2.execute-api.us-east-1.amazonaws.com/Prod";

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
}
