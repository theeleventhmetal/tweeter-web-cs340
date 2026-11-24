// AI-assisted: see AI-ATTRIBUTION.md
import "isomorphic-fetch";
import { Status } from "tweeter-shared";
import { StatusService } from "../../src/model.service/StatusService";
import { UserService } from "../../src/model.service/UserService";

// Integration test: calls the live, deployed API through the real
// client-side Service classes. Registers its own uniquely-aliased user and
// posts/reads its own status, since there's no FakeData seed data to assert
// against anymore (Milestone 4A).
describe("StatusService integration tests", () => {
  const userService = new UserService();
  const statusService = new StatusService();

  it("posts a status and reads it back as the only story item", async () => {
    const alias = `@stattest${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const [user, authToken] = await userService.register(
      "Status",
      "Tester",
      alias,
      "password",
      new Uint8Array(),
      "png"
    );

    const post = "Hello from the integration test, mentioning @someone";
    const timestamp = Date.now();

    await statusService.postStatus(authToken, new Status(post, user, timestamp));

    const [items, hasMore] = await statusService.loadMoreStoryItems(
      authToken,
      alias,
      10,
      null
    );

    expect(items.length).toBe(1);
    expect(hasMore).toBe(false);
    expect(items[0].user.alias).toBe(alias);
    expect(items[0].timestamp).toBe(timestamp);
    expect(items[0].post).toBe(post);
  });
});
