// AI-assisted: see AI-ATTRIBUTION.md
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { AuthToken, PagedItemRequest, PagedItemResponse, User, UserDto } from "tweeter-shared";
import { DynamoDaoFactory } from "../../dao/DynamoDaoFactory";
import { FollowService } from "../../service/FollowService";
import { CORS_HEADERS } from "../util/corsHeaders";
import { statusCodeForError } from "../util/statusCodeForError";

const daoFactory = new DynamoDaoFactory();
const followService = new FollowService(daoFactory);

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const request: PagedItemRequest<UserDto> = JSON.parse(event.body ?? "{}");
    const authToken = AuthToken.fromDto(request.authToken);
    const lastItem = User.fromDto(request.lastItem);

    if (authToken == null) {
      throw new Error("[BadRequest] Missing or invalid auth token");
    }

    const [items, hasMore] = await followService.loadMoreFollowees(
      authToken,
      request.userAlias,
      request.pageSize,
      lastItem
    );

    const response: PagedItemResponse<UserDto> = {
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
    const response: PagedItemResponse<UserDto> = {
      success: false,
      message: (error as Error).message,
      items: null,
      hasMore: false,
    };

    return {
      statusCode: statusCodeForError(error),
      headers: CORS_HEADERS,
      body: JSON.stringify(response),
    };
  }
};
