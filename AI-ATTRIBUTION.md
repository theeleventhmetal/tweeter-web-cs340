# AI Attribution Log

One entry per task where an AI agent wrote or modified files. See `AGENTS.md` for the format and process.

## 2026-11-21: tweeter-server/template.yaml
- Tool: Claude Code (Sonnet 5)
- Task: Milestone 4A infra: add the Follows DynamoDB table (PK followerAlias/SK followeeAlias, answers "who does X follow") with a followee-index GSI (swapped key order, answers "who follows X" without a scan). Grants a DynamoDBCrudPolicy + FOLLOWS_TABLE_NAME env var to the 7 follow-related Lambdas plus PostStatusFunction (needs read access for the feed fan-out step added later); GetFolloweesFunction/GetFollowersFunction also get Users table access since resolving an alias to a full User is a separate lookup. No DynamoFollowDao implementation yet.
- Review: TODO

## 2026-11-21: tweeter-server/src/service/AuthorizationService.ts (new file)
- Tool: Claude Code (Sonnet 5)
- Task: Milestone 4A: add AuthorizationService per the spec's recommendation. validate(authToken) looks up the session via AuthTokenDao, throws a "[Unauthorized] ..." error if missing/expired (deleting expired sessions as it goes), otherwise returns the session's alias. Also owns createSession/endSession so UserService is the only other class that touches AuthTokenDao, routed through here. Sessions last 24h from creation - generous on purpose for a manually-graded course project passoff. Not wired into any Service yet.
- Review: TODO

## 2026-11-21: tweeter-server/src/dao/dynamodb/DynamoAuthTokenDao.ts (new file)
- Tool: Claude Code (Sonnet 5)
- Task: Milestone 4A: implement AuthTokenDao against the Sessions table (createSession/getSession/deleteSession via PutCommand/GetCommand/DeleteCommand). Table name from the SESSIONS_TABLE_NAME env var. Used by AuthorizationService next.
- Review: TODO

## 2026-11-21: tweeter-server/template.yaml
- Tool: Claude Code (Sonnet 5)
- Task: Milestone 4A infra: add the Sessions DynamoDB table (PK token, TTL on expiresAt for auto-cleanup once a session has expired). Granted on Globals.Function instead of per-function, since every one of the 14 Lambdas calls AuthorizationService.validate() and therefore needs Sessions table read/write - a DynamoDBCrudPolicy plus SESSIONS_TABLE_NAME env var there apply to all functions at once. No DynamoAuthTokenDao/AuthorizationService implementation yet.
- Review: TODO

## 2026-11-21: tweeter-server/src/dao/s3/S3ImageDao.ts (new file)
- Tool: Claude Code (Sonnet 5)
- Task: Milestone 4A: implement ImageDao against S3, adapted from the spec's FAQ PutObjectCommand snippet - decodes the base64 image, writes it under image/<fileName> with public-read ACL, and returns the public URL. Extended the FAQ's hard-coded "image/png" ContentType to a small extension->MIME map (png/jpg/jpeg/gif) since RegisterPresenter captures the user's actual file extension. Bucket/region read from env vars, never hard-coded.
- Review: TODO

## 2026-11-21: tweeter-server/template.yaml
- Tool: Claude Code (Sonnet 5)
- Task: Milestone 4A infra: add the ProfileImagesBucket S3 bucket, with OwnershipControls (BucketOwnerPreferred, so ACL uploads work) and PublicAccessBlockConfiguration fully opened declaratively, so the spec's console steps (block public access off, allow ACLs) happen automatically on deploy instead of by hand. Grants RegisterFunction an S3CrudPolicy on it plus an IMAGES_BUCKET_NAME env var. No S3ImageDao implementation yet.
- Review: TODO

## 2026-11-21: tweeter-server/src/dao/dynamodb/DynamoUserDao.ts (new file)
- Tool: Claude Code (Sonnet 5)
- Task: Milestone 4A: implement UserDao against the Users DynamoDB table using @aws-sdk/lib-dynamodb's DynamoDBDocumentClient (GetCommand/PutCommand). Table name read from the USERS_TABLE_NAME env var set in template.yaml, never hard-coded.
- Review: TODO

## 2026-11-21: tweeter-server/template.yaml
- Tool: Claude Code (Sonnet 5)
- Task: Milestone 4A infra: add the Users DynamoDB table (PK alias, PAY_PER_REQUEST billing so there's no idle provisioned capacity to remember to turn down) and grant RegisterFunction/LoginFunction/GetUserFunction a DynamoDBCrudPolicy on it plus a USERS_TABLE_NAME env var. No DynamoUserDao implementation yet - table exists but nothing reads/writes it.
- Review: TODO

## 2026-11-21: tweeter-server/src/dao/DaoFactory.ts (new file)
- Tool: Claude Code (Sonnet 5)
- Task: Milestone 4A: define the DaoFactory interface (Abstract Factory pattern) with one createXDao() method per DAO type. Services will take a DaoFactory via constructor injection and call these methods to get their DAOs, so they never call `new` on a concrete DAO class directly. No concrete factory implementation yet.
- Review: TODO

## 2026-11-21: tweeter-server/src/dao/interface/ImageDao.ts (new file)
- Tool: Claude Code (Sonnet 5)
- Task: Milestone 4A DAO layer: define the database-agnostic ImageDao interface (uploadImage, taking a filename and base64-encoded bytes, returning the public URL) used for S3 profile image uploads. Completes the set of 6 DAO interfaces. No implementation yet.
- Review: TODO

## 2026-11-21: tweeter-server/src/dao/interface/FeedDao.ts (new file)
- Tool: Claude Code (Sonnet 5)
- Task: Milestone 4A DAO layer: define the database-agnostic FeedDao interface for each user's pre-computed feed - addStatusToFeeds (batch fan-out write to a list of followers, called from postStatus) and a paged getPageOfFeed. Per the spec's requirement that feed contents be pre-computed rather than calculated at read time. No implementation yet.
- Review: TODO

## 2026-11-21: tweeter-server/src/dao/interface/StatusDao.ts (new file)
- Tool: Claude Code (Sonnet 5)
- Task: Milestone 4A DAO layer: define the database-agnostic StatusDao interface for a user's own posted statuses (the Story tab) - postStatus and a paged getPageOfStory. Stores the full StatusDto shape (post, user, timestamp) denormalized so story reads need no join. No implementation yet.
- Review: TODO

## 2026-11-21: tweeter-server/src/dao/interface/FollowDao.ts (new file)
- Tool: Claude Code (Sonnet 5)
- Task: Milestone 4A DAO layer: define the database-agnostic FollowDao interface covering follow/unfollow, isFollower, follower/followee counts, paged alias lookups in both directions, and getAllFollowerAliases (used by the feed fan-out-on-write path added later). Works in plain aliases, not UserDto - callers resolve full user info via UserDao. No implementation yet.
- Review: TODO

## 2026-11-21: tweeter-server/src/dao/interface/AuthTokenDao.ts (new file)
- Tool: Claude Code (Sonnet 5)
- Task: Milestone 4A DAO layer: define the database-agnostic AuthTokenDao interface (createSession/getSession/deleteSession) and the SessionEntity shape (token, alias, epoch-seconds expiresAt) it operates on. Backs server-side session management. No implementation yet.
- Review: TODO

## 2026-11-21: tweeter-server/src/dao/interface/UserDao.ts (new file)
- Tool: Claude Code (Sonnet 5)
- Task: Milestone 4A DAO layer: define the database-agnostic UserDao interface (getUser/createUser) and a server-only UserEntity shape (includes passwordHash, unlike the client-facing UserDto) that it operates on. No implementation yet.
- Review: TODO

## 2026-11-21: tweeter-server/package.json, package-lock.json
- Tool: Claude Code (Sonnet 5)
- Task: Milestone 4A setup: add the npm dependencies the Data Access Layer needs (@aws-sdk/client-dynamodb, @aws-sdk/lib-dynamodb, @aws-sdk/client-s3, bcryptjs, @types/bcryptjs), confirmed with the user first since AGENTS.md says not to add dependencies without asking.
- Review: TODO

## 2026-11-14: tweeter-shared/src/model/domain/User.ts, AuthToken.ts, Status.ts, Follow.ts, tweeter-shared/src/index.ts, tweeter-shared/src/model/net/request/TweeterRequest.ts (new file), tweeter-shared/src/model/net/response/TweeterResponse.ts (new file), tweeter-shared/src/model/net/request/PagedItemRequest.ts (new file), tweeter-shared/src/model/net/response/PagedItemResponse.ts (new file), tweeter-shared/src/model/net/request/AuthRequest.ts (new file), tweeter-shared/src/model/net/response/AuthResponse.ts (new file), tweeter-shared/src/model/net/request/RegisterRequest.ts (new file), tweeter-shared/src/model/net/request/GetUserRequest.ts (new file), tweeter-shared/src/model/net/response/GetUserResponse.ts (new file), tweeter-shared/src/model/net/request/UserCountRequest.ts (new file), tweeter-shared/src/model/net/response/CountResponse.ts (new file), tweeter-shared/src/model/net/request/IsFollowerRequest.ts (new file), tweeter-shared/src/model/net/response/IsFollowerResponse.ts (new file), tweeter-shared/src/model/net/request/FollowActionRequest.ts (new file), tweeter-shared/src/model/net/response/FollowActionResponse.ts (new file), tweeter-shared/src/model/net/request/PostStatusRequest.ts (new file)
- Tool: Claude Code (Sonnet 5)
- Task: Add toDto()/static fromDto() to the User, AuthToken, Status, and Follow domain classes, and add request/response interfaces (TweeterRequest/Response, PagedItemRequest/Response<T>, AuthRequest/Response, RegisterRequest, GetUserRequest/Response, UserCountRequest/CountResponse, IsFollowerRequest/Response, FollowActionRequest/Response, PostStatusRequest) covering all 14 Milestone 3 endpoints, exported from tweeter-shared/src/index.ts. Pure shared-module types; no server or client wiring yet.
- Review: Reviewed the diff and the type shapes against the plan; kept as written.

## 2026-11-15: package.json, tweeter-server/package.json (new file), tweeter-server/tsconfig.json (new file), tweeter-server/template.yaml (new file), tweeter-server/.gitignore (new file)
- Tool: Claude Code (Sonnet 5)
- Task: Scaffold the tweeter-server SAM workspace: add it to the root npm workspaces, give it a package.json depending on tweeter-shared, a tsconfig.json per the course's recommended compiler options, and a minimal template.yaml (Globals + an explicit AWS::Serverless::Api resource named TweeterApi, zero Lambdas yet).
- Review: Ran `sam validate` and `sam build` myself; both succeeded.

## 2026-11-16: tweeter-server/src/service/UserService.ts (new file), tweeter-server/src/lambda/util/corsHeaders.ts (new file), tweeter-server/src/lambda/handler/LoginLambda.ts (new file), tweeter-server/template.yaml, tweeter-web/src/network/ServerFacade.ts (new file), tweeter-web/src/model.service/UserService.ts
- Tool: Claude Code (Sonnet 5)
- Task: Wire the Login feature end-to-end: server-side UserService.login (FakeData-backed), the LoginLambda handler (200/400 responses with CORS), the LoginFunction resource in template.yaml (POST /login on TweeterApi, esbuild build method), ServerFacade.login on the client, and tweeter-web's UserService.login updated to call it instead of FakeData. (tweeter-web/src/network/ClientCommunicator.ts was written by the user, not the agent, in a separate commit.)
- Review: Deployed, tested the Lambda in the console and via curl, and logged in through the running app in the browser — full pipeline confirmed working end-to-end.

## 2026-11-16: tweeter-server/scripts/bundle.mjs (new file), tweeter-server/package.json, tweeter-server/template.yaml, tweeter-server/.gitignore, AGENTS.md, tweeter-web/src/network/ServerFacade.ts, package.json
- Tool: Claude Code (Sonnet 5)
- Task: Fix `sam build` failing to resolve the `tweeter-shared` import (SAM's built-in esbuild and makefile build methods both copy tweeter-server into an isolated scratch directory first, which breaks the npm-workspace symlink to the sibling tweeter-shared folder). Added a standalone esbuild bundling script (scripts/bundle.mjs) that runs before `sam build`, bundling each Lambda in the real repo tree so the symlink resolves; updated template.yaml's LoginFunction to point CodeUri at the pre-bundled output with no Metadata.BuildMethod needed. Updated AGENTS.md's command list accordingly. After a successful `sam deploy`, set ServerFacade.SERVER_URL to the deployed API Gateway URL.
- Review: Ran `npm run bundle`, `sam build`, and `sam deploy --guided` myself; tested the deployed Lambda in the console and via curl, both succeeded.

## 2026-11-16: tweeter-server/src/service/UserService.ts, tweeter-server/src/lambda/handler/LogoutLambda.ts (new file), tweeter-server/template.yaml, tweeter-server/scripts/bundle.mjs
- Tool: Claude Code (Sonnet 5)
- Task: Add the server-side Logout endpoint - UserService.logout (no-op at this milestone, FakeData has no session state), LogoutLambda handler (200/400 with CORS), the LogoutFunction resource in template.yaml and its entry in bundle.mjs. The user wrote ServerFacade.logout and tweeter-web's UserService.logout themselves (in a separate, earlier revision of these files); I reviewed that work and caught a bug before it was fixed (passing the raw AuthToken instance instead of authToken.toDto() into the request, which type-checks via structural typing but serializes the private _token/_timestamp fields instead of the expected DTO shape).
- Review: Ran `npm run bundle`, `sam build`, `sam deploy`, console test, and the full browser round trip (login + logout) myself; all succeeded.

## 2026-11-16: tweeter-server/src/service/UserService.ts, tweeter-server/template.yaml, tweeter-server/scripts/bundle.mjs, tweeter-web/src/network/ServerFacade.ts, tweeter-web/src/model.service/UserService.ts
- Tool: Claude Code (Sonnet 5)
- Task: Add the GetUser endpoint. I wrote UserService.getUser (server, a FakeData lookup by alias), ServerFacade.getUser and the client UserService.getUser (the user asked to sequence these before the Lambda this time, to lock the contract down first), and the template.yaml/bundle.mjs entries. The user wrote GetUserLambda.ts themselves; I reviewed it, caught a couple of bugs along the way they fixed (destructuring getUser's single return value as a tuple, swapped/malformed argument order, passing the raw AuthTokenDto instead of converting via AuthToken.fromDto with a null guard), and the final version type-checked clean with only cosmetic nitpicks (unused imports, inconsistent error-response typing vs LoginLambda) left as-is.
- Review: Ran `npm run bundle`, `sam build`, `sam deploy`, the console test, and viewed a profile in the running app myself; all succeeded.

## 2026-11-16: tweeter-server/src/service/UserService.ts, tweeter-server/src/lambda/handler/RegisterLambda.ts (new file), tweeter-server/template.yaml, tweeter-server/scripts/bundle.mjs, tweeter-web/src/network/ServerFacade.ts, tweeter-web/src/model.service/UserService.ts
- Tool: Claude Code (Sonnet 5)
- Task: Wire up Register end-to-end (the whole task, at the user's request): server UserService.register (FakeData-backed, mirrors the old client M2 logic), RegisterLambda handler, template.yaml/bundle.mjs entries, ServerFacade.register, and the client UserService.register updated to base64-encode the image bytes and call the facade instead of FakeData. Also removed the now-fully-unused FakeData import from the client UserService.ts, since all four of its methods now go through ServerFacade.
- Review: Ran `npm run bundle`, `sam build`, `sam deploy`, the console test (after fixing a test-event authoring mistake - body needs to be a JSON string, not a nested object), and registered a new account through the running app myself; all succeeded.

## 2026-11-16: tweeter-server/src/service/FollowService.ts (new file), tweeter-server/src/lambda/handler/IsFollowerLambda.ts (new file), tweeter-server/src/lambda/handler/GetFolloweeCountLambda.ts (new file), tweeter-server/src/lambda/handler/GetFollowerCountLambda.ts (new file), tweeter-server/template.yaml, tweeter-server/scripts/bundle.mjs, tweeter-web/src/network/ServerFacade.ts, tweeter-web/src/model.service/FollowService.ts
- Tool: Claude Code (Sonnet 5)
- Task: Wire up the follow-info trio end-to-end (the whole task, at the user's request): server FollowService (getIsFollowerStatus/getFolloweeCount/getFollowerCount, FakeData-backed), three Lambda handlers, template.yaml/bundle.mjs entries for each, ServerFacade methods for all three, and the client FollowService updated to call them (gained its first serverFacade field; loadMoreFollowees/loadMoreFollowers/follow/unfollow remain FakeData-backed, pending Tasks 8-9).
- Review: Ran `npm run bundle`, `sam build`, `sam deploy` myself; skipped individual console tests this round (judged low-risk after four prior identical-pattern endpoints) and verified directly in the running app - follower/followee counts and follow status on a profile page all came from the real endpoints correctly.

## 2026-11-16: tweeter-server/src/service/FollowService.ts, tweeter-server/src/lambda/handler/FollowLambda.ts (new file), tweeter-server/src/lambda/handler/UnfollowLambda.ts (new file), tweeter-server/template.yaml, tweeter-server/scripts/bundle.mjs, tweeter-web/src/network/ServerFacade.ts, tweeter-web/src/model.service/FollowService.ts
- Tool: Claude Code (Sonnet 5)
- Task: Wire up follow/unfollow end-to-end (whole task): server FollowService.follow/unfollow (FakeData-backed, no persistent relationship state at this milestone - just recomputes the same static counts), two Lambda handlers sharing FollowActionRequest/FollowActionResponse, template.yaml/bundle.mjs entries, ServerFacade.follow/unfollow, and the client FollowService.follow/unfollow updated to call them instead of the 2-second setTimeout + FakeData recompute.
- Review: Ran `npm run bundle`, `sam build`, `sam deploy`, and followed/unfollowed a user in the running app myself; counts updated correctly through the real endpoints.

## 2026-11-16: tweeter-server/src/service/FollowService.ts, tweeter-server/src/lambda/handler/GetFolloweesLambda.ts (new file), tweeter-server/src/lambda/handler/GetFollowersLambda.ts (new file), tweeter-server/template.yaml, tweeter-server/scripts/bundle.mjs, tweeter-web/src/network/ServerFacade.ts, tweeter-web/src/model.service/FollowService.ts
- Tool: Claude Code (Sonnet 5)
- Task: Wire up paged followers/followees end-to-end (whole task): server FollowService.loadMoreFollowees/loadMoreFollowers (FakeData.getPageOfUsers), two Lambda handlers sharing PagedItemRequest<UserDto>/PagedItemResponse<UserDto>, template.yaml/bundle.mjs entries, ServerFacade.getFollowees/getFollowers, and the client FollowService updated to call them. Removed the now-fully-unused FakeData import from the client FollowService.ts - all five of its methods go through ServerFacade now, only loadMoreFollowees/loadMoreFollowers remained on FakeData before this task.
- Review: Ran `npm run bundle`, `sam build`, `sam deploy`, and scrolled a user's followers/followees lists in the running app myself; pagination worked correctly through the real endpoints.

## 2026-11-17: tweeter-web/src/presenter/UserInfoPresenter.ts
- Tool: Claude Code (Sonnet 5)
- Task: Bug fix (user-reported, unrelated to the Milestone 3 endpoint work): follow/unfollow toasts never disappeared. Root cause: updateFollowStatus never captured the ID returned by view.displayInfoMessage(...) and called view.deleteMessage("") instead of the real ID, so the delete never matched anything. Confirmed via git log this predates all Milestone 3 commits - a pre-existing bug in the Milestone 2 starter code. Fixed by capturing the ID and passing it to deleteMessage; also moved displayInfoMessage outside doFailureReportingOperation so the ID is captured unconditionally and the toast gets cleaned up even if the follow/unfollow call fails (doFailureReportingOperation catches internally and never rethrows).
- Review: Ran `npx tsc --noEmit` and the full test suite (16/16 pass) myself, and confirmed in the running app that the toast now disappears correctly after follow/unfollow.

## 2026-11-17: tweeter-server/src/service/StatusService.ts (new file), tweeter-server/src/lambda/handler/GetFeedLambda.ts (new file), tweeter-server/template.yaml, tweeter-server/scripts/bundle.mjs
- Tool: Claude Code (Sonnet 5)
- Task: Server side only for the feed endpoint (split from the client side into a separate commit, at the user's request, to spread Milestone 3 work across more commits): new server StatusService with loadMoreFeedItems (FakeData.getPageOfStatuses), GetFeedLambda handler using PagedItemRequest<StatusDto>/PagedItemResponse<StatusDto>, template.yaml/bundle.mjs entries for POST /feed. No client wiring yet.
- Review: Ran `npx tsc --noEmit` (server side) myself; deployed with `npm run bundle`/`sam build`/`sam deploy`.

## 2026-11-17: tweeter-web/src/model.service/StatusService.ts
- Tool: Claude Code (Sonnet 5)
- Task: Final piece of Task 10: client StatusService.loadMoreFeedItems/loadMoreStoryItems updated to call ServerFacade.getFeed/getStory instead of FakeData. Removed the now-unused FakeData import (postStatus, the one remaining method, never used it either).
- Review: Ran `npx tsc --noEmit` and the full test suite (16/16 pass) myself, and scrolled the main feed and a profile's story tab in the running app - both pulling from the real endpoints.

## 2026-11-17: tweeter-server/src/service/StatusService.ts, tweeter-server/src/lambda/handler/PostStatusLambda.ts (new file), tweeter-server/template.yaml, tweeter-server/scripts/bundle.mjs
- Tool: Claude Code (Sonnet 5)
- Task: Server side only for postStatus (same split as feed/story, separate commit from client wiring): StatusService.postStatus (no-op - no persistent storage yet at this milestone, matching the client's old M2 behavior which also did nothing but pause), PostStatusLambda handler, template.yaml/bundle.mjs entries for POST /post-status. No client wiring yet.
- Review: Ran `npx tsc --noEmit` (server side) myself; deployed with `npm run bundle`/`sam build`/`sam deploy`.

## 2026-11-17: tweeter-web/src/network/ServerFacade.ts, tweeter-web/src/model.service/StatusService.ts
- Tool: Claude Code (Sonnet 5)
- Task: Client wiring for postStatus (ServerFacade.postStatus + client StatusService.postStatus combined into one commit, since the commit-spacing goal was already cleared) - replaces the 2-second setTimeout placeholder with a real call to /post-status. This is the 14th and last feature; confirmed no FakeData references remain anywhere in tweeter-web/src/model.service/.
- Review: Ran `npx tsc --noEmit` and the full test suite (16/16 pass) myself, posted a status in the running app, and grepped model.service/ for FakeData (no results).

## 2026-11-17: tweeter-web/package.json, tweeter-web/test/network/ServerFacade.test.ts (new file), tweeter-web/test/model.service/StatusService.test.ts (new file)
- Tool: Claude Code (Sonnet 5)
- Task: Milestone 3's required integration tests. Installed isomorphic-fetch per the course's note about jsdom lacking fetch. ServerFacade.test.ts (true integration tests against the live deployed API): register (expects the first FakeData user, Allen Anderson, per the course's own note), getFollowers (expects a specific page of 10 users with @allen omitted, derived from FakeData's known deterministic user-list order), getFollowerCount (expects >0, per the course's note). StatusService.test.ts: loadMoreStoryItems against the live API, expecting a specific first status derived from FakeData.generateFakeStatuses's known deterministic generation order (sender @allen, mentions @amy, timestamp 0). All expected values were derived from reading FakeData.ts's actual deterministic logic, not from running the code and copying its output.
- Review: Ran `npx tsc --noEmit` and the full test suite myself (20/20 pass, including the 4 new integration tests hitting the live API).

## 2026-11-17: tweeter-web/src/network/ServerFacade.ts
- Tool: Claude Code (Sonnet 5)
- Task: Client network-layer wiring for feed/story (separate commit from the client UserService/StatusService wiring, per the commit-spacing request): ServerFacade.getFeed/getStory, calling the now-deployed /feed and /story endpoints and converting StatusDto results back to Status via fromDto.
- Review: Ran `npx tsc --noEmit` and the full test suite (16/16 pass) myself.

## 2026-11-17: tweeter-server/src/service/StatusService.ts, tweeter-server/src/lambda/handler/GetStoryLambda.ts (new file), tweeter-server/template.yaml, tweeter-server/scripts/bundle.mjs
- Tool: Claude Code (Sonnet 5)
- Task: Server side only for the story endpoint (same split as feed, separate commit from client wiring): StatusService.loadMoreStoryItems (identical shape to loadMoreFeedItems, FakeData.getPageOfStatuses), GetStoryLambda handler, template.yaml/bundle.mjs entries for POST /story. No client wiring yet.
- Review: Ran `npx tsc --noEmit` (server side) myself; deployed with `npm run bundle`/`sam build`/`sam deploy`.
