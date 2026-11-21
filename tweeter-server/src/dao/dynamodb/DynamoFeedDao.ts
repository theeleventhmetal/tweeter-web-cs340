// AI-assisted: see AI-ATTRIBUTION.md
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  BatchWriteCommand,
  DynamoDBDocumentClient,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { StatusDto } from "tweeter-shared";
import { FeedDao } from "../interface/FeedDao";

const TABLE_NAME = process.env.FEED_TABLE_NAME ?? "";

// DynamoDB's BatchWriteItem accepts at most 25 items per call.
const BATCH_WRITE_LIMIT = 25;

export class DynamoFeedDao implements FeedDao {
  private readonly client = DynamoDBDocumentClient.from(
    new DynamoDBClient({})
  );

  public async addStatusToFeeds(
    followerAliases: string[],
    status: StatusDto
  ): Promise<void> {
    for (let i = 0; i < followerAliases.length; i += BATCH_WRITE_LIMIT) {
      const batch = followerAliases.slice(i, i + BATCH_WRITE_LIMIT);

      await this.client.send(
        new BatchWriteCommand({
          RequestItems: {
            [TABLE_NAME]: batch.map((alias) => ({
              PutRequest: {
                Item: { alias, ...status },
              },
            })),
          },
        })
      );
    }
  }

  public async getPageOfFeed(
    viewerAlias: string,
    pageSize: number,
    lastTimestamp: number | null
  ): Promise<[StatusDto[], boolean]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "alias = :alias",
        ExpressionAttributeValues: { ":alias": viewerAlias },
        ExclusiveStartKey: lastTimestamp
          ? { alias: viewerAlias, timestamp: lastTimestamp }
          : undefined,
        Limit: pageSize,
        ScanIndexForward: false,
      })
    );

    const items = (result.Items ?? []).map(({ alias, ...status }) => status as StatusDto);

    return [items, result.LastEvaluatedKey != null];
  }
}
