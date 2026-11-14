import { AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter } from "./Presenter";

export interface NavBarView {
  displayInfoMessage(
    message: string,
    duration: number,
    bootstrapClasses?: string | undefined,
  ): string;
  deleteMessage(value: string): void;
  clearUserInfo(): void;
  navigate(path: string): void;
  displayErrorMessage: (
    message: string,
    bootstrapClasses?: string | undefined,
  ) => void;
}

export class NavBarPresenter extends Presenter<NavBarView>{
  private _service: UserService;

  public constructor(view: NavBarView) {
    super(view)
    this._service = new UserService();
  }

  public get service() {
    return this._service
  }

  public async logOut(authToken: AuthToken) {
    
    const loggingOutToastId = this.view.displayInfoMessage(
      "Logging Out...",
      0,
    );

    this.doFailureReportingOperation(async () => {
      await this.service.logout(authToken!);

      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigate("/login");
    }, "log user out");
  }
}
