// AI-assisted: see AI-ATTRIBUTION.md
import { UserDto } from "../../domain/User";
import { TweeterRequest } from "./TweeterRequest";

export interface UserCountRequest extends TweeterRequest {
  user: UserDto;
}
