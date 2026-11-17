// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, Status } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class StatusService implements Service {
  private serverFacade = new ServerFacade();

  loadMoreFeedItems = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> => {
    return this.serverFacade.getFeed({
      authToken: authToken.toDto(),
      userAlias,
      pageSize,
      lastItem: lastItem?.toDto() ?? null,
    });
  };

  loadMoreStoryItems = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> => {
    return this.serverFacade.getStory({
      authToken: authToken.toDto(),
      userAlias,
      pageSize,
      lastItem: lastItem?.toDto() ?? null,
    });
  };

  postStatus = async (
    authToken: AuthToken,
    newStatus: Status,
  ): Promise<void> => {
    return this.serverFacade.postStatus({
      authToken: authToken.toDto(),
      status: newStatus.toDto(),
    });
  };
}