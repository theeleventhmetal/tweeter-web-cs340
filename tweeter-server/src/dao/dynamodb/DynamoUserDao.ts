// AI-assisted: see AI-ATTRIBUTION.md
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { UserDao, UserEntity } from "../interface/UserDao";

const TABLE_NAME = process.env.USERS_TABLE_NAME ?? "";

export class DynamoUserDao implements UserDao {
  private readonly client = DynamoDBDocumentClient.from(
    new DynamoDBClient({})
  );

  public async getUser(alias: string): Promise<UserEntity | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { alias },
      })
    );

    return (result.Item as UserEntity | undefined) ?? null;
  }

  public async createUser(user: UserEntity): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: user,
      })
    );
  }
}
