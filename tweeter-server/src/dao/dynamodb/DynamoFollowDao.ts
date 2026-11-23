// AI-assisted: see AI-ATTRIBUTION.md
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  QueryCommandOutput,
} from "@aws-sdk/lib-dynamodb";
import { FollowDao } from "../interface/FollowDao";

const TABLE_NAME = process.env.FOLLOWS_TABLE_NAME ?? "";
const FOLLOWEE_INDEX_NAME = "followee-index";

export class DynamoFollowDao implements FollowDao {
  private readonly client = DynamoDBDocumentClient.from(
    new DynamoDBClient({})
  );

  public async follow(
    followerAlias: string,
    followeeAlias: string
  ): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: { followerAlias, followeeAlias },
      })
    );
  }

  public async unfollow(
    followerAlias: string,
    followeeAlias: string
  ): Promise<void> {
    await this.client.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { followerAlias, followeeAlias },
      })
    );
  }

  public async isFollower(
    followerAlias: string,
    followeeAlias: string
  ): Promise<boolean> {
    const result = await this.client.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { followerAlias, followeeAlias },
      })
    );

    return result.Item != null;
  }

  public async getFolloweeCount(alias: string): Promise<number> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "followerAlias = :alias",
        ExpressionAttributeValues: { ":alias": alias },
        Select: "COUNT",
      })
    );

    return result.Count ?? 0;
  }

  public async getFollowerCount(alias: string): Promise<number> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: FOLLOWEE_INDEX_NAME,
        KeyConditionExpression: "followeeAlias = :alias",
        ExpressionAttributeValues: { ":alias": alias },
        Select: "COUNT",
      })
    );

    return result.Count ?? 0;
  }

  public async getPageOfFolloweeAliases(
    followerAlias: string,
    pageSize: number,
    lastAlias: string | null
  ): Promise<[string[], boolean]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "followerAlias = :followerAlias",
        ExpressionAttributeValues: { ":followerAlias": followerAlias },
        ExclusiveStartKey: lastAlias
          ? { followerAlias, followeeAlias: lastAlias }
          : undefined,
        Limit: pageSize,
      })
    );

    const aliases = (result.Items ?? []).map(
      (item) => item.followeeAlias as string
    );

    return [aliases, result.LastEvaluatedKey != null];
  }

  public async getPageOfFollowerAliases(
    followeeAlias: string,
    pageSize: number,
    lastAlias: string | null
  ): Promise<[string[], boolean]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: FOLLOWEE_INDEX_NAME,
        KeyConditionExpression: "followeeAlias = :followeeAlias",
        ExpressionAttributeValues: { ":followeeAlias": followeeAlias },
        ExclusiveStartKey: lastAlias
          ? { followeeAlias, followerAlias: lastAlias }
          : undefined,
        Limit: pageSize,
      })
    );

    const aliases = (result.Items ?? []).map(
      (item) => item.followerAlias as string
    );

    return [aliases, result.LastEvaluatedKey != null];
  }

  public async getAllFollowerAliases(followeeAlias: string): Promise<string[]> {
    const aliases: string[] = [];
    let exclusiveStartKey: Record<string, unknown> | undefined = undefined;

    do {
      const result: QueryCommandOutput = await this.client.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          IndexName: FOLLOWEE_INDEX_NAME,
          KeyConditionExpression: "followeeAlias = :followeeAlias",
          ExpressionAttributeValues: { ":followeeAlias": followeeAlias },
          ExclusiveStartKey: exclusiveStartKey,
        })
      );

      aliases.push(
        ...(result.Items ?? []).map((item) => item.followerAlias as string)
      );
      exclusiveStartKey = result.LastEvaluatedKey;
    } while (exclusiveStartKey != null);

    return aliases;
  }
}
