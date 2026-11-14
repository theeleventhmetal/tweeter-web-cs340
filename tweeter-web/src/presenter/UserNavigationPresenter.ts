import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter } from "./Presenter";

export interface UserNavigationView {
  setDisplayedUser(user: User): void;
  navigate(path: string): void;
  displayErrorMessage: (message: string) => void;
}

export class UserNavigationPresenter extends Presenter<UserNavigationView>{
  private userService: UserService;

  public constructor(view: UserNavigationView) {
    super(view)
    this.userService = new UserService();
  }

  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }

  public async navigateToUser(
    target: string,
    authToken: AuthToken,
    displayedUser: User,
    featureUrl: string,
  ): Promise<void> {
    this.doFailureReportingOperation(async () => {
      const alias = this.extractAlias(target);

      const toUser = await this.userService.getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          this.view.setDisplayedUser(toUser);
          this.view.navigate(`${featureUrl}/${toUser.alias}`);
        }
      }
    }, "get user") 
  }
}
