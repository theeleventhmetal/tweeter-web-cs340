// AI-assisted: see AI-ATTRIBUTION.md
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { AuthTokenDao, SessionEntity } from "../interface/AuthTokenDao";

const TABLE_NAME = process.env.SESSIONS_TABLE_NAME ?? "";

export class DynamoAuthTokenDao implements AuthTokenDao {
  private readonly client = DynamoDBDocumentClient.from(
    new DynamoDBClient({})
  );

  public async createSession(session: SessionEntity): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: session,
      })
    );
  }

  public async getSession(token: string): Promise<SessionEntity | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { token },
      })
    );

    return (result.Item as SessionEntity | undefined) ?? null;
  }

  public async deleteSession(token: string): Promise<void> {
    await this.client.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { token },
      })
    );
  }
}
