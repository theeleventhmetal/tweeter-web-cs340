// AI-assisted: see AI-ATTRIBUTION.md
import "isomorphic-fetch";
import { AuthToken, UserDto } from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade";

// These are true integration tests: they call the live, deployed API.
// Expected values come from the known, deterministic parts of FakeData
// (see tweeter-shared/src/util/FakeData.ts) - the fixed user list order
// and the fixed first user - not from whatever the code happens to
// currently return.
describe("ServerFacade integration tests", () => {
  const serverFacade = new ServerFacade();
  const authToken = new AuthToken("test-token", Date.now()).toDto();

  it("registers a user and gets back the first FakeData user (Allen Anderson)", async () => {
    const [user, returnedAuthToken] = await serverFacade.register({
      firstName: "Test",
      lastName: "User",
      alias: "@integrationtest",
      password: "password",
      userImageBytesBase64: "",
      imageFileExtension: "png",
    });

    expect(user.firstName).toBe("Allen");
    expect(user.lastName).toBe("Anderson");
    expect(user.alias).toBe("@allen");
    expect(returnedAuthToken.token.length).toBeGreaterThan(0);
  });

  it("gets a page of @allen's followers, omitting @allen from the result", async () => {
    const [followers, hasMore] = await serverFacade.getFollowers({
      authToken,
      userAlias: "@allen",
      pageSize: 10,
      lastItem: null,
    });

    expect(followers.length).toBe(10);
    expect(followers[0].alias).toBe("@amy");
    expect(followers[9].alias).toBe("@frank");
    expect(hasMore).toBe(true);
  });

  it("gets a follower count greater than zero for @allen", async () => {
    const allen: UserDto = {
      firstName: "Allen",
      lastName: "Anderson",
      alias: "@allen",
      imageUrl: "",
    };

    const count = await serverFacade.getFollowerCount({
      authToken,
      user: allen,
    });

    expect(count).toBeGreaterThan(0);
  });
});
