// AI-assisted: see AI-ATTRIBUTION.md
import { UserDto } from "../../domain/User";
import { TweeterRequest } from "./TweeterRequest";

export interface IsFollowerRequest extends TweeterRequest {
  user: UserDto;
  selectedUser: UserDto;
}
