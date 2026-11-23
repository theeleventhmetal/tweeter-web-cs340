// AI-assisted: see AI-ATTRIBUTION.md
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { AuthToken, IsFollowerRequest, IsFollowerResponse, User } from "tweeter-shared";
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
    const request: IsFollowerRequest = JSON.parse(event.body ?? "{}");
    const authToken = AuthToken.fromDto(request.authToken);
    const user = User.fromDto(request.user);
    const selectedUser = User.fromDto(request.selectedUser);

    if (authToken == null || user == null || selectedUser == null) {
      throw new Error("[BadRequest] Missing or invalid request fields");
    }

    const isFollower = await followService.getIsFollowerStatus(
      authToken,
      user,
      selectedUser
    );

    const response: IsFollowerResponse = { success: true, isFollower };

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(response),
    };
  } catch (error) {
    const response: IsFollowerResponse = {
      success: false,
      message: (error as Error).message,
      isFollower: false,
    };

    return {
      statusCode: statusCodeForError(error),
      headers: CORS_HEADERS,
      body: JSON.stringify(response),
    };
  }
};
