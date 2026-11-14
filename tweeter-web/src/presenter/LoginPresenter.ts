import { UserService } from "../model.service/UserService";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";

export interface LoginView extends AuthenticationView{
}

export class LoginPresenter extends AuthenticationPresenter<AuthenticationView> {
  private userService: UserService;

  public constructor(view: LoginView) {
    super(view);
    this.userService = new UserService();
  }

  public checkSubmitButtonStatus(alias: string, password: string): boolean {
    return !alias || !password;
  }

  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl: string | undefined,
  ) {
    await this.doAuthentication(
      () => this.service.login(alias, password),
      (user) =>
        this.view.navigate(originalUrl ? originalUrl : `/feed/${user.alias}`),
      rememberMe
    );
  }

  protected getOperationDescription(): string {
    return "log user in";
  }
}
