import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { Presenter } from "./Presenter";

export interface UserInfoView {
  setIsFollower(value: boolean): void;
  displayErrorMessage: (message: string) => void;
  setIsLoading(value: boolean): void;
  setFollowerCount(value: number): void;
  setFolloweeCount(value: number): void;
  deleteMessage(message: string): void;
  displayInfoMessage(
    message: string,
    duration: number,
    bootstrapClasses?: string | undefined,
  ): string;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private followService: FollowService;

  public constructor(view: UserInfoView) {
    super(view);

    this.followService = new FollowService();
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User,
  ) {
    this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.followService.getIsFollowerStatus(
            authToken!,
            currentUser!,
            displayedUser!,
          ),
        );
      }
    }, "determine follower status");
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this.view.setFolloweeCount(
        await this.followService.getFolloweeCount(authToken, displayedUser),
      );
    }, "get followees count");
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this.view.setFollowerCount(
        await this.followService.getFollowerCount(authToken, displayedUser),
      );
    }, "get followers count");
  }

  public getBaseUrl(): string {
    const segments = location.pathname.split("/@");
    return segments.length > 1 ? segments[0] : "/";
  }

  public async followDisplayedUser(
    displayedUser: User,
    authToken: AuthToken,
  ): Promise<void> {
    await this.updateFollowStatus(
      () => this.followService.follow(authToken, displayedUser),
      `Following ${displayedUser.name}...`,
      true,
      "follow user"
    )
  }

  public async unfollowDisplayedUser(
    displayedUser: User,
    authToken: AuthToken,
  ): Promise<void> {
    await this.updateFollowStatus(
      () => this.followService.unfollow(authToken, displayedUser),
      `Unfollowing ${displayedUser.name}...`,
      false,
      "unfollow user",
    );
  }

  private async updateFollowStatus(
    serviceCall: () => Promise<[number, number]>,
    infoMessage: string,
    isFollowerAfter: boolean,
    operationDescription: string,
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage(infoMessage, 0);

      const [followerCount, followeeCount] = await serviceCall();

      this.view.setIsFollower(isFollowerAfter);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    }, operationDescription);

    this.view.deleteMessage("");
    this.view.setIsLoading(false);
  }
}
