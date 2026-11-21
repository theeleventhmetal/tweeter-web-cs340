// AI-assisted: see AI-ATTRIBUTION.md
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { StatusDto } from "tweeter-shared";
import { StatusDao } from "../interface/StatusDao";

const TABLE_NAME = process.env.STORY_TABLE_NAME ?? "";

export class DynamoStatusDao implements StatusDao {
  private readonly client = DynamoDBDocumentClient.from(
    new DynamoDBClient({})
  );

  public async postStatus(
    authorAlias: string,
    status: StatusDto
  ): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: { alias: authorAlias, ...status },
      })
    );
  }

  public async getPageOfStory(
    authorAlias: string,
    pageSize: number,
    lastTimestamp: number | null
  ): Promise<[StatusDto[], boolean]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "alias = :alias",
        ExpressionAttributeValues: { ":alias": authorAlias },
        ExclusiveStartKey: lastTimestamp
          ? { alias: authorAlias, timestamp: lastTimestamp }
          : undefined,
        Limit: pageSize,
        ScanIndexForward: false,
      })
    );

    const items = (result.Items ?? []).map(({ alias, ...status }) => status as StatusDto);

    return [items, result.LastEvaluatedKey != null];
  }
}
