// AI-assisted: see AI-ATTRIBUTION.md
import "isomorphic-fetch";
import { AuthToken } from "tweeter-shared";
import { StatusService } from "../../src/model.service/StatusService";

// Integration test: calls the live, deployed API through the real
// client-side Service (not mocked). Expected values come from
// FakeData.generateFakeStatuses's known, deterministic generation order
// (see tweeter-shared/src/util/FakeData.ts): the first status is always
// from @allen (the first fake user), mentions @amy (the second), and
// has timestamp 0.
describe("StatusService integration tests", () => {
  const statusService = new StatusService();
  const authToken = new AuthToken("test-token", Date.now());

  it("successfully loads a page of story items for @allen", async () => {
    const [items, hasMore] = await statusService.loadMoreStoryItems(
      authToken,
      "@allen",
      10,
      null
    );

    expect(items.length).toBe(10);
    expect(hasMore).toBe(true);
    expect(items[0].user.alias).toBe("@allen");
    expect(items[0].timestamp).toBe(0);
    expect(items[0].post).toContain("@amy");
  });
});
