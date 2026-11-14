import { AuthToken, Status, User } from "tweeter-shared";
import { PostStatusPresenter, PostStatusView } from "tweeter-web/src/presenter/PostStatusPresenter"
import { StatusService } from "../../src/model.service/StatusService";
import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";

describe("PostStatusPresenter", () => {
    let mockPostStatusPresenterView: PostStatusView;
    let postStatusPresenter: PostStatusPresenter;

    let mockService: StatusService;

    const authToken = new AuthToken("abc", Date.now());
    const user = new User("jack", "hillman", "jackhillman", anything())
    const status = new Status("post", user, anything());

    beforeEach(() => {
        mockPostStatusPresenterView = mock<PostStatusView>()
        const mockPostStatusPresenterViewInstance = instance(mockPostStatusPresenterView);

        when(mockPostStatusPresenterView.displayInfoMessage(anything(), 0)).thenReturn("message123");

        const postStatusPresenterSpy = spy(
            new PostStatusPresenter(mockPostStatusPresenterViewInstance)
        );

        postStatusPresenter = instance(postStatusPresenterSpy)

        mockService = mock<StatusService>();
        
        when(postStatusPresenterSpy.service).thenReturn(instance(mockService))
    })

    it("tells the view to display a posting status message", async () => {
        await postStatusPresenter.submitPost(anything(), authToken, user);
        verify(
          mockPostStatusPresenterView.displayInfoMessage(
            "Posting status...",
            0,
          ),
        ).once();
    });

    it("calls postStatus on the post status service with the correct status string and auth token", async () => {
        await postStatusPresenter.submitPost("post", authToken, user);
        verify(mockService.postStatus(authToken, anything())).once();
    });

    it("tells the view to clear the info message that was displayed previously, clears the post, and displays a status posted message.", async () => {
        await postStatusPresenter.submitPost("post", authToken, user);
        verify(mockPostStatusPresenterView.deleteMessage("message123")).once()
        verify(mockPostStatusPresenterView.setPost("")).once()
        verify(
          mockPostStatusPresenterView.displayInfoMessage(
            "Status posted!",
            2000,
          ),
        ).once();
    });
    
    it("tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message when unsuccessful", async () => {
        let error = new Error("An error occurred");
        when(mockService.postStatus(anything(), anything())).thenThrow(error)

        await postStatusPresenter.submitPost("post", authToken, user);

        let [errorString] = capture(
          mockPostStatusPresenterView.displayErrorMessage,
        ).last();

        console.log(errorString);

        verify(mockPostStatusPresenterView.displayErrorMessage("Failed to post the status because of exception: An error occurred")).once()

        verify(mockPostStatusPresenterView.deleteMessage(anything())).never();
        verify(mockPostStatusPresenterView.setPost("")).never();
        verify(
          mockPostStatusPresenterView.displayInfoMessage(
            "Status posted!",
            2000,
          ),
        ).never();

    });
})