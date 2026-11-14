import PostStatus from "tweeter-web/src/components/postStatus/PostStatus";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { anything, instance, mock, verify } from "@typestrong/ts-mockito";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { useUserInfo } from "../../src/components/userInfo/UserInfoHooks";
import { User, AuthToken } from "tweeter-shared";
import "@testing-library/jest-dom";
import { userEvent } from "@testing-library/user-event";
import { PostStatusPresenter } from "../../src/presenter/PostStatusPresenter";



jest.mock("../../src/components/userInfo/UserInfoHooks", () => ({
  ...jest.requireActual("../../src/components/userInfo/UserInfoHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));

describe("Post Status Component", () => {
  beforeAll(() => {
    library.add(fab);
    const mockUser = new User("jack", "hillman", "jackhillman", "image.png");
    const mockAuthToken = new AuthToken("abc", Date.now());
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUser,
      authToken: mockAuthToken,
    });
  })
  it("starts with post status and clear buttons disabled", () => {
    const { postStatusButton, clearButton } = renderPostStatusAndGetElement();
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("enables both post status and clear buttons when text field has text", async () => {
    const { postStatusButton, clearButton, textField, user } = renderPostStatusAndGetElement();

    await user.type(textField, "status")

    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();

  });
  
  it("disables the post status and clear buttons when text field is cleared", async () => {
    const { postStatusButton, clearButton, textField, user } =
      renderPostStatusAndGetElement();

    await user.type(textField, "status");

    await user.clear(textField);
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("calls presenter's postStatus method with correct parameters when Post Status is pressed", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const { postStatusButton, clearButton, textField, user} =
      renderPostStatusAndGetElement();

    const post = "post"
    const authToken = new AuthToken("token", anything())
    const mockUser = new User("jack", "hillman", "jackhillman", "image.png");

    await user.type(textField, post)
    await user.click(postStatusButton)

    verify(mockPresenter.submitPost(post, authToken, mockUser))

  })
});

function renderPostStatusAndGetElement() {
  render(
    <MemoryRouter>
      <PostStatus></PostStatus>
    </MemoryRouter>,
  );

  const user = userEvent.setup();

  const postStatusButton = screen.getByRole("button", { name: /post status/i });
  const clearButton = screen.getByRole("button", { name: /clear/i });
  const textField = screen.getByLabelText(/statusText/i);

  return { postStatusButton, clearButton, textField, user };
}
