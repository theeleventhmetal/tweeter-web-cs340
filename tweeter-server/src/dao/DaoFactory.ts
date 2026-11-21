// AI-assisted: see AI-ATTRIBUTION.md
import { UserDao } from "./interface/UserDao";
import { AuthTokenDao } from "./interface/AuthTokenDao";
import { FollowDao } from "./interface/FollowDao";
import { StatusDao } from "./interface/StatusDao";
import { FeedDao } from "./interface/FeedDao";
import { ImageDao } from "./interface/ImageDao";

export interface DaoFactory {
  createUserDao(): UserDao;
  createAuthTokenDao(): AuthTokenDao;
  createFollowDao(): FollowDao;
  createStatusDao(): StatusDao;
  createFeedDao(): FeedDao;
  createImageDao(): ImageDao;
}
