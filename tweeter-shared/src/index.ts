// AI-assisted: see AI-ATTRIBUTION.md
export { Follow } from "./model/domain/Follow";
export type { FollowDto } from "./model/domain/Follow";
export { PostSegment, Type } from "./model/domain/PostSegment";
export { Status } from "./model/domain/Status";
export type { StatusDto } from "./model/domain/Status";
export { User } from "./model/domain/User";
export type { UserDto } from "./model/domain/User";
export { AuthToken } from "./model/domain/AuthToken";
export type { AuthTokenDto } from "./model/domain/AuthToken";

// All classes that should be avaialble to other modules need to exported here. export * does not work when
// uploading to lambda. Instead we have to list each export.
export { FakeData } from "./util/FakeData";

// Request/response types for the Web API (Milestone 3)
export type { TweeterRequest } from "./model/net/request/TweeterRequest";
export type { TweeterResponse } from "./model/net/response/TweeterResponse";
export type { PagedItemRequest } from "./model/net/request/PagedItemRequest";
export type { PagedItemResponse } from "./model/net/response/PagedItemResponse";
export type { AuthRequest } from "./model/net/request/AuthRequest";
export type { AuthResponse } from "./model/net/response/AuthResponse";
export type { RegisterRequest } from "./model/net/request/RegisterRequest";
export type { GetUserRequest } from "./model/net/request/GetUserRequest";
export type { GetUserResponse } from "./model/net/response/GetUserResponse";
export type { UserCountRequest } from "./model/net/request/UserCountRequest";
export type { CountResponse } from "./model/net/response/CountResponse";
export type { IsFollowerRequest } from "./model/net/request/IsFollowerRequest";
export type { IsFollowerResponse } from "./model/net/response/IsFollowerResponse";
export type { FollowActionRequest } from "./model/net/request/FollowActionRequest";
export type { FollowActionResponse } from "./model/net/response/FollowActionResponse";
export type { PostStatusRequest } from "./model/net/request/PostStatusRequest";
