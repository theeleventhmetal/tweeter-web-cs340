// AI-assisted: see AI-ATTRIBUTION.md
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { AuthToken, TweeterRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../service/UserService";
import { CORS_HEADERS } from "../util/corsHeaders";

const userService = new UserService();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const request: TweeterRequest = JSON.parse(event.body ?? "{}");
    const authToken = AuthToken.fromDto(request.authToken);

    if (authToken == null) {
      throw new Error("Missing or invalid auth token");
    }

    await userService.logout(authToken);

    const response: TweeterResponse = { success: true };

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(response),
    };
  } catch (error) {
    const response: TweeterResponse = {
      success: false,
      message: (error as Error).message,
    };

    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify(response),
    };
  }
};
