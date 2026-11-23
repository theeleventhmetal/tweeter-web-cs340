// AI-assisted: see AI-ATTRIBUTION.md
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { AuthResponse, RegisterRequest } from "tweeter-shared";
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
    const request: RegisterRequest = JSON.parse(event.body ?? "{}");

    const [user, authToken] = await userService.register(
      request.firstName,
      request.lastName,
      request.alias,
      request.password,
      request.userImageBytesBase64,
      request.imageFileExtension
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
