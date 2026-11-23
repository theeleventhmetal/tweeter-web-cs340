// AI-assisted: see AI-ATTRIBUTION.md
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { AuthRequest, AuthResponse } from "tweeter-shared";
import { DynamoDaoFactory } from "../../dao/DynamoDaoFactory";
import { UserService } from "../../service/UserService";
import { CORS_HEADERS } from "../util/corsHeaders";
import { statusCodeForError } from "../util/statusCodeForError";

const daoFactory = new DynamoDaoFactory();
const userService = new UserService(daoFactory);

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const request: AuthRequest = JSON.parse(event.body ?? "{}");

    const [user, authToken] = await userService.login(
      request.alias,
      request.password
    );

    const response: AuthResponse = {
      success: true,
      user: user.toDto(),
      authToken: authToken.toDto(),
    };

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(response),
    };
  } catch (error) {
    const response: AuthResponse = {
      success: false,
      message: (error as Error).message,
      user: null,
      authToken: null,
    };

    return {
      statusCode: statusCodeForError(error),
      headers: CORS_HEADERS,
      body: JSON.stringify(response),
    };
  }
};
