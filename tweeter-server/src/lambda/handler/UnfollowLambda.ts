// AI-assisted: see AI-ATTRIBUTION.md
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { AuthToken, FollowActionRequest, FollowActionResponse, User } from "tweeter-shared";
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
    const request: FollowActionRequest = JSON.parse(event.body ?? "{}");
    const authToken = AuthToken.fromDto(request.authToken);
    const targetUser = User.fromDto(request.targetUser);

    if (authToken == null || targetUser == null) {
      throw new Error("[BadRequest] Missing or invalid request fields");
    }

    const [followerCount, followeeCount] = await followService.unfollow(
      authToken,
      targetUser
    );

    const response: FollowActionResponse = {
      success: true,
      followerCount,
      followeeCount,
    };

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(response),
    };
  } catch (error) {
    const response: FollowActionResponse = {
      success: false,
      message: (error as Error).message,
      followerCount: 0,
      followeeCount: 0,
    };

    return {
      statusCode: statusCodeForError(error),
      headers: CORS_HEADERS,
      body: JSON.stringify(response),
    };
  }
};
