import { User, AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { UserService } from "../model.service/UserService";

export interface AuthenticationView extends View {
  setIsLoading(value: boolean): void;
  updateUserInfo(
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean,
  ): void;
  navigate(path: string): void;
}

export abstract class AuthenticationPresenter<
  V extends AuthenticationView,
> extends Presenter<V> {
  protected service: UserService;

  protected constructor(view: V) {
    super(view);
    this.service = new UserService();
  }

  protected async doAuthentication(
    authenticate: () => Promise<[User, AuthToken]>,
    navigate: (user: User) => void,
    rememberMe: boolean,
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);

      const [user, authToken] = await authenticate();

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      navigate(user);
    }, this.getOperationDescription());

    this.view.setIsLoading(false);
  }

  protected abstract getOperationDescription(): string;
}