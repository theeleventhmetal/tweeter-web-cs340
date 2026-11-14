// AI-assisted: see AI-ATTRIBUTION.md
import { TweeterResponse } from "./TweeterResponse";

export interface FollowActionResponse extends TweeterResponse {
  followerCount: number;
  followeeCount: number;
}
