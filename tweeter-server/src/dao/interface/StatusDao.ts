// AI-assisted: see AI-ATTRIBUTION.md
import { StatusDto } from "tweeter-shared";

export interface StatusDao {
  postStatus(authorAlias: string, status: StatusDto): Promise<void>;

  getPageOfStory(
    authorAlias: string,
    pageSize: number,
    lastTimestamp: number | null
  ): Promise<[StatusDto[], boolean]>;
}
