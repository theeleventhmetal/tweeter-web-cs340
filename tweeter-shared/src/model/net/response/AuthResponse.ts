// AI-assisted: see AI-ATTRIBUTION.md
import { UserDto } from "../../domain/User";
import { AuthTokenDto } from "../../domain/AuthToken";
import { TweeterResponse } from "./TweeterResponse";

export interface AuthResponse extends TweeterResponse {
  user: UserDto | null;
  authToken: AuthTokenDto | null;
}
