// AI-assisted: see AI-ATTRIBUTION.md
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { AuthToken, PostStatusRequest, Status, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../service/StatusService";
import { CORS_HEADERS } from "../util/corsHeaders";

const statusService = new StatusService();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const request: PostStatusRequest = JSON.parse(event.body ?? "{}");
    const authToken = AuthToken.fromDto(request.authToken);
    const status = Status.fromDto(request.status);

    if (authToken == null || status == null) {
      throw new Error("Missing or invalid request fields");
    }

    await statusService.postStatus(authToken, status);

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
