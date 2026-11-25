// AI-assisted: see AI-ATTRIBUTION.md
import "isomorphic-fetch";
import { ServerFacade } from "../../src/network/ServerFacade";

// True integration tests: they call the live, deployed API and a real
// DynamoDB/S3 backend (Milestone 4A), so unlike the earlier FakeData-backed
// version there's no fixed seed data to assert against. Each test registers
// its own uniquely-aliased user(s) and asserts round-trip behavior instead.
describe("ServerFacade integration tests", () => {
  const serverFacade = new ServerFacade();

  const uniqueAlias = (prefix: string): string =>
    `@${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;

  it("registers a user and gets back the same profile fields", async () => {
    const alias = uniqueAlias("reg");

    const [user, authToken] = await serverFacade.register({
      firstName: "Test",
      lastName: "User",
      alias,
      password: "password",
      userImageBytesBase64: "",
      imageFileExtension: "png",
    });

    expect(user.firstName).toBe("Test");
    expect(user.lastName).toBe("User");
    expect(user.alias).toBe(alias);
    expect(authToken.token.length).toBeGreaterThan(0);
  });

  it("logs in with the alias/password used at registration", async () => {
    const alias = uniqueAlias("login");

    await serverFacade.register({
      firstName: "Login",
      lastName: "Test",
      alias,
      password: "password123",
      userImageBytesBase64: "",
      imageFileExtension: "png",
    });

    const [user, authToken] = await serverFacade.login({
      alias,
      password: "password123",
    });

    expect(user.alias).toBe(alias);
    expect(authToken.token.length).toBeGreaterThan(0);
  });

  it("rejects login with the wrong password", async () => {
    const alias = uniqueAlias("badpw");

    await serverFacade.register({
      firstName: "Bad",
      lastName: "Password",
      alias,
      password: "correct-password",
      userImageBytesBase64: "",
      imageFileExtension: "png",
    });

    await expect(
      serverFacade.login({ alias, password: "wrong-password" })
    ).rejects.toThrow();
  });

  it("follows a user and sees the updated counts and follower list", async () => {
    // More round trips than the other tests here (2 registers, 2
    // isFollower checks, follow, getFollowers), some hitting cold Lambda
    // starts - the 5s Jest default is too tight for this one.
    const followerAlias = uniqueAlias("follower");
    const followeeAlias = uniqueAlias("followee");

    const [, followerToken] = await serverFacade.register({
      firstName: "Follower",
      lastName: "Person",
      alias: followerAlias,
      password: "password",
      userImageBytesBase64: "",
      imageFileExtension: "png",
    });

    const [followeeUser] = await serverFacade.register({
      firstName: "Followee",
      lastName: "Person",
      alias: followeeAlias,
      password: "password",
      userImageBytesBase64: "",
      imageFileExtension: "png",
    });
    const followeeUserDto = followeeUser.toDto();

    const authToken = followerToken.toDto();
    const followerUser = {
      firstName: "Follower",
      lastName: "Person",
      alias: followerAlias,
      imageUrl: "",
    };

    expect(
      await serverFacade.getIsFollowerStatus({
        authToken,
        user: followerUser,
        selectedUser: followeeUserDto,
      })
    ).toBe(false);

    const [followerCount, followeeCount] = await serverFacade.follow({
      authToken,
      targetUser: followeeUserDto,
    });

    expect(followerCount).toBe(1);
    expect(followeeCount).toBe(0);

    expect(
      await serverFacade.getIsFollowerStatus({
        authToken,
        user: followerUser,
        selectedUser: followeeUserDto,
      })
    ).toBe(true);

    const [followers, hasMoreFollowers] = await serverFacade.getFollowers({
      authToken,
      userAlias: followeeAlias,
      pageSize: 10,
      lastItem: null,
    });

    expect(followers.length).toBe(1);
    expect(followers[0].alias).toBe(followerAlias);
    expect(hasMoreFollowers).toBe(false);
  }, 20000);
});
