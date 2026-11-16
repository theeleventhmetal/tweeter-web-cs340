# AI Attribution Log

One entry per task where an AI agent wrote or modified files. See `AGENTS.md` for the format and process.

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
- Review: TODO (pending sam build/deploy and the browser test)
