import {
  NavBarPresenter,
  NavBarView,
} from "tweeter-web/src/presenter/NavBarPresenter";
import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";
import { AuthToken } from "tweeter-shared";
import { UserService } from "../../src/model.service/UserService";
describe("NavBarPresenter", () => {
  let mockNavBarPresenterView: NavBarView;
  let navBarPresenter: NavBarPresenter;

  let mockService: UserService;

  const authToken = new AuthToken("abc", Date.now());

  beforeEach(() => {
    mockNavBarPresenterView = mock<NavBarView>();
    const mockNavBarPresenterViewInstance = instance(mockNavBarPresenterView);

    when(mockNavBarPresenterView.displayInfoMessage(anything(), 0)).thenReturn("message123");

    const navBarPresenterSpy = spy(
      new NavBarPresenter(mockNavBarPresenterViewInstance),
    );

    navBarPresenter = instance(navBarPresenterSpy);

    mockService = mock<UserService>();

    when(navBarPresenterSpy.service).thenReturn(instance(mockService));
  });
  it("tells the view to display a logging out message", async () => {
    await navBarPresenter.logOut(authToken);
    verify(
      mockNavBarPresenterView.displayInfoMessage("Logging Out...", 0),
    ).once();
  });
  it("calls logout on the user service with the correct auth token", async () => {
    await navBarPresenter.logOut(authToken);
    verify(mockService.logout(authToken)).once();
  });

  it("tells the view to clear the info message that was displayed previously, clears the user info, and navigates to the login page", async () => {
    await navBarPresenter.logOut(authToken);
    verify(mockNavBarPresenterView.deleteMessage("message123")).once();
    verify(mockNavBarPresenterView.clearUserInfo()).once();
    verify(mockNavBarPresenterView.navigate(anything())).once();

    verify(mockNavBarPresenterView.displayErrorMessage(anything())).never();
  });

  it("tells the view to display an error message and does not tell it to clear the info message, clear the user info or navigate to the login page when unsuccessful", async () => {
    let error = new Error("An error occurred");
    when(mockService.logout(anything())).thenThrow(error);
    await navBarPresenter.logOut(authToken);

    let [errorString] = capture(
      mockNavBarPresenterView.displayErrorMessage,
    ).last();

    console.log(errorString);
    verify(
      mockNavBarPresenterView.displayErrorMessage(
        `Failed to log user out because of exception: An error occurred`,
      ),
    ).once();
    verify(mockNavBarPresenterView.deleteMessage(anything())).never();
    verify(mockNavBarPresenterView.clearUserInfo()).never();
    verify(mockNavBarPresenterView.navigate(anything())).never();
  });
});
