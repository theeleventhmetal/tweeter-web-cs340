// AI-assisted: see AI-ATTRIBUTION.md
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { AuthToken, PagedItemRequest, PagedItemResponse, Status, StatusDto } from "tweeter-shared";
import { StatusService } from "../../service/StatusService";
import { CORS_HEADERS } from "../util/corsHeaders";

const statusService = new StatusService();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const request: PagedItemRequest<StatusDto> = JSON.parse(event.body ?? "{}");
    const authToken = AuthToken.fromDto(request.authToken);
    const lastItem = Status.fromDto(request.lastItem);

    if (authToken == null) {
      throw new Error("Missing or invalid auth token");
    }

    const [items, hasMore] = await statusService.loadMoreStoryItems(
      authToken,
      request.userAlias,
      request.pageSize,
      lastItem
    );

    const response: PagedItemResponse<StatusDto> = {
      success: true,
      items: items.map((item) => item.toDto()),
      hasMore,
    };

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(response),
    };
  } catch (error) {
    const response: PagedItemResponse<StatusDto> = {
      success: false,
      message: (error as Error).message,
      items: null,
      hasMore: false,
    };

    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify(response),
    };
  }
};
