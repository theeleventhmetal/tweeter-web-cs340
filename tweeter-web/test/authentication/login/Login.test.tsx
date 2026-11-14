import Login from "tweeter-web/src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import {
  instance,
  mock,
  verify,
} from "@typestrong/ts-mockito";
import { LoginPresenter } from "../../../src/presenter/LoginPresenter";

library.add(fab);

describe("Login Component", () => {
  it("starts with sign-in button disabled", () => {
    const { signInButton } = renderLoginAndGetElement("/");

    expect(signInButton).toBeDisabled();
  });

  it("enables the sign in button if both alias and password fields have text", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElement("/");

    await user.type(aliasField, "alice");
    await user.type(passwordField, "password");

    expect(signInButton).toBeEnabled();
  });

  it("disables the sign in button if the alias or password field is cleared", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElement("/");

    await user.type(aliasField, "alice");
    await user.type(passwordField, "password");

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await user.type(aliasField, "alice");
    expect(signInButton).toBeEnabled();

    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();
  });

  it("calls presenter's login method with correct parameters when the sign in button is pressed", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const originalUrl = "http://somewhere.org";
    const alias = "@alias";
    const password = "password";

    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElement(originalUrl, mockPresenterInstance);

    await user.type(aliasField, alias);
    await user.type(passwordField, password);
    await user.click(signInButton);

    verify(mockPresenter.doLogin(alias, password, false, originalUrl)).once();
  });
});

function renderLogin(originalUrl: string, presenter?: LoginPresenter) {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter} />
      ) : (
        <Login originalUrl={originalUrl} />
      )}
    </MemoryRouter>,
  );
}

function renderLoginAndGetElement(
  originalUrl: string,
  presenter?: LoginPresenter,
) {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText(/alias/i);
  const passwordField = screen.getByLabelText(/password/i);

  return { user, signInButton, aliasField, passwordField };
}
