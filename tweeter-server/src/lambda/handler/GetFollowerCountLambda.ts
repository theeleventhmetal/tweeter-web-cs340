// AI-assisted: see AI-ATTRIBUTION.md
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { AuthToken, CountResponse, User, UserCountRequest } from "tweeter-shared";
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
    const request: UserCountRequest = JSON.parse(event.body ?? "{}");
    const authToken = AuthToken.fromDto(request.authToken);
    const user = User.fromDto(request.user);

    if (authToken == null || user == null) {
      throw new Error("[BadRequest] Missing or invalid request fields");
    }

    const count = await followService.getFollowerCount(authToken, user);

    const response: CountResponse = { success: true, count };

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(response),
    };
  } catch (error) {
    const response: CountResponse = {
      success: false,
      message: (error as Error).message,
      count: 0,
    };

    return {
      statusCode: statusCodeForError(error),
      headers: CORS_HEADERS,
      body: JSON.stringify(response),
    };
  }
};
