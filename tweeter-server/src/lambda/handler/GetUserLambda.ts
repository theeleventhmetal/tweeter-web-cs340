import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  GetUserRequest,
  AuthToken,
  TweeterResponse,
  GetUserResponse,
} from "tweeter-shared";
import { DynamoDaoFactory } from "../../dao/DynamoDaoFactory";
import { UserService } from "../../service/UserService";
import { CORS_HEADERS } from "../util/corsHeaders";
import { statusCodeForError } from "../util/statusCodeForError";

const daoFactory = new DynamoDaoFactory();
const userService = new UserService(daoFactory);

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const request: GetUserRequest = JSON.parse(event.body ?? "{}");
    const authToken = AuthToken.fromDto(request.authToken);

    if (authToken == null) {
      throw new Error("[BadRequest] Missing or invalid auth token");
    }

    const user = await userService.getUser(authToken, request.alias);

    const response: GetUserResponse = {
      user: user?.toDto() ?? null,
      success: true,
    };

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(response),
    };
  } catch (error) {
    const response: GetUserResponse = {
      success: false,
      message: (error as Error).message,
      user: null
    };

    return {
      statusCode: statusCodeForError(error),
      headers: CORS_HEADERS,
      body: JSON.stringify(response),
    };
  }
};
