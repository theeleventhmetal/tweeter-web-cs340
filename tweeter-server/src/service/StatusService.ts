// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, Status } from "tweeter-shared";
import { DaoFactory } from "../dao/DaoFactory";
import { FeedDao } from "../dao/interface/FeedDao";
import { FollowDao } from "../dao/interface/FollowDao";
import { StatusDao } from "../dao/interface/StatusDao";
import { AuthorizationService } from "./AuthorizationService";

export class StatusService {
  private statusDao: StatusDao;
  private feedDao: FeedDao;
  private followDao: FollowDao;
  private authorizationService: AuthorizationService;

  public constructor(daoFactory: DaoFactory) {
    this.statusDao = daoFactory.createStatusDao();
    this.feedDao = daoFactory.createFeedDao();
    this.followDao = daoFactory.createFollowDao();
    this.authorizationService = new AuthorizationService(daoFactory);
  }

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    await this.authorizationService.validate(authToken);

    const [items, hasMore] = await this.feedDao.getPageOfFeed(
      userAlias,
      pageSize,
      lastItem?.timestamp ?? null
    );

    return [items.map((dto) => Status.fromDto(dto) as Status), hasMore];
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    await this.authorizationService.validate(authToken);

    const [items, hasMore] = await this.statusDao.getPageOfStory(
      userAlias,
      pageSize,
      lastItem?.timestamp ?? null
    );

    return [items.map((dto) => Status.fromDto(dto) as Status), hasMore];
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    const posterAlias = await this.authorizationService.validate(authToken);
    const statusDto = newStatus.toDto();

    await this.statusDao.postStatus(posterAlias, statusDto);

    const followerAliases = await this.followDao.getAllFollowerAliases(
      posterAlias
    );
    await this.feedDao.addStatusToFeeds(followerAliases, statusDto);
  }
}
