// AI-assisted: see AI-ATTRIBUTION.md
import { StatusDto } from "../../domain/Status";
import { TweeterRequest } from "./TweeterRequest";

export interface PostStatusRequest extends TweeterRequest {
  status: StatusDto;
}
