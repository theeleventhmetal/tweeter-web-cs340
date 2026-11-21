// AI-assisted: see AI-ATTRIBUTION.md
import { DaoFactory } from "./DaoFactory";
import { UserDao } from "./interface/UserDao";
import { AuthTokenDao } from "./interface/AuthTokenDao";
import { FollowDao } from "./interface/FollowDao";
import { StatusDao } from "./interface/StatusDao";
import { FeedDao } from "./interface/FeedDao";
import { ImageDao } from "./interface/ImageDao";
import { DynamoUserDao } from "./dynamodb/DynamoUserDao";
import { DynamoAuthTokenDao } from "./dynamodb/DynamoAuthTokenDao";
import { DynamoFollowDao } from "./dynamodb/DynamoFollowDao";
import { DynamoStatusDao } from "./dynamodb/DynamoStatusDao";
import { DynamoFeedDao } from "./dynamodb/DynamoFeedDao";
import { S3ImageDao } from "./s3/S3ImageDao";

export class DynamoDaoFactory implements DaoFactory {
  public createUserDao(): UserDao {
    return new DynamoUserDao();
  }

  public createAuthTokenDao(): AuthTokenDao {
    return new DynamoAuthTokenDao();
  }

  public createFollowDao(): FollowDao {
    return new DynamoFollowDao();
  }

  public createStatusDao(): StatusDao {
    return new DynamoStatusDao();
  }

  public createFeedDao(): FeedDao {
    return new DynamoFeedDao();
  }

  public createImageDao(): ImageDao {
    return new S3ImageDao();
  }
}
