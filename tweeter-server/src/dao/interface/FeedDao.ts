// AI-assisted: see AI-ATTRIBUTION.md
import { StatusDto } from "tweeter-shared";

export interface FeedDao {
  addStatusToFeeds(
    followerAliases: string[],
    status: StatusDto
  ): Promise<void>;

  getPageOfFeed(
    viewerAlias: string,
    pageSize: number,
    lastTimestamp: number | null
  ): Promise<[StatusDto[], boolean]>;
}
