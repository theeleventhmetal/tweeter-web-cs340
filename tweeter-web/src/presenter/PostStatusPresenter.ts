import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { Presenter } from "./Presenter";

export interface PostStatusView {
  setIsLoading(value: boolean): void;
  displayInfoMessage(
    message: string,
    duration: number,
    bootstrapClasses?: string | undefined,
  ): string;
  setPost(value: string): void;
  deleteMessage(value: string): void;
  displayErrorMessage: (message: string) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView>{

  private _service: StatusService;

  public constructor(view: PostStatusView) {
    super(view)
    this._service = new StatusService();
  }

  public get service(){
    return this._service
  }

  public checkButtonStatus(
    post: string,
    authToken: AuthToken,
    currentUser: User,
    isLoading: boolean,
  ): boolean {
    return !post.trim() || !authToken || !currentUser || isLoading;
  }

  public async submitPost(post: string, authToken: AuthToken, currentUser: User) {
    var postingStatusToastId = "";
    this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);
      postingStatusToastId = this.view.displayInfoMessage(
        "Posting status...",
        0,
      );

      const status = new Status(post, currentUser!, Date.now());

      await this.service.postStatus(authToken!, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
      this.view.deleteMessage(postingStatusToastId);
      this.view.setIsLoading(false);
    }, "post the status")
  }
}
