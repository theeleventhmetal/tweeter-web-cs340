# AGENTS.md

## Project
Tweeter: a Twitter-like web app for BYU CS 340. Monorepo with npm workspaces:
- `tweeter-shared/` — domain models, DTOs, request/response types shared by client and server. Build: `npm run build` (must be rebuilt, and VS Code restarted, after any change before `tweeter-web`/`tweeter-server` will see updates).
- `tweeter-web/` — React + TypeScript client (Vite). MVP architecture: Presenters in `src/presenter/`, Views are React components, Service classes in `src/model.service/`.
- `tweeter-server/` — AWS SAM project (Lambdas + API Gateway), added in Milestone 3. Mirrors the service-class layer from `tweeter-web` on the backend.

This milestone (M3) moves backend logic out of the client's `FakeData`-backed service classes and into AWS Lambda + API Gateway. See `MILESTONE_3_PLAN.md` for the task breakdown.

## Commands
- Build shared: `cd tweeter-shared && npm run build`
- Build web: `cd tweeter-web && npm run build`
- Test web: `cd tweeter-web && npm test`
- Type check web: `cd tweeter-web && npx tsc --noEmit`
- Run web dev server: `cd tweeter-web && npm start`
- Build/validate SAM (once `tweeter-server` exists): `cd tweeter-server && sam build && sam validate`
- Deploy SAM: `cd tweeter-server && sam deploy`

## Conventions
- Keep `tweeter-web` service classes (`UserService`, `FollowService`, `StatusService`) as the only things presenters talk to — they now delegate to a `ServerFacade`, not `FakeData`.
- Request/response DTOs and domain `toDto`/`fromDto` conversions live in `tweeter-shared`, exported individually from `tweeter-shared/src/index.ts` (no `export *`, per existing convention — required for Lambda bundling).
- Use named exports, not default exports.
- Do not use the `any` type.
- One Lambda per API endpoint; each Lambda handler delegates to a service class on the server, it does not contain business logic itself.
- Use POST for all API Gateway endpoints this milestone (per course guidance — simplifies API Gateway config), with the auth token in the JSON body, not headers.

## Off-limits
- Do not add npm dependencies without asking.
- Do not touch AWS resources (deploy, delete, modify) without confirming with me first — SAM deploys create real billable resources.
- Do not rewrite `FakeData.ts` — the server services still return its dummy data this milestone.

## AI attribution
After each task that changes files, append an entry to AI-ATTRIBUTION.md in the
repository root, creating the file if it does not exist. Use this format, with
today's date:

    ## YYYY-MM-DD: <each file changed, with (new file) after new ones>
    - Tool: <tool name>
    - Task: <the task I was given, in one or two sentences>
    - Review: TODO

Leave the Review line as TODO — the author fills it in after reviewing the change.
List every file changed or created, including tests, and do not list anything
that was not changed.

If a TypeScript file created or changed does not already start with this line,
add it as the first line:

    // AI-assisted: see AI-ATTRIBUTION.md
