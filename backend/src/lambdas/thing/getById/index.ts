import type {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";

import corsResponseHeaders from "../../../utils";
import { getThingById } from "../../../services/thingService";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Get thing by id event:", event);
  const thingId = event.pathParameters?.id as string;
  const thingWithId = await getThingById(thingId);
  return {
    statusCode: 200,
    headers: corsResponseHeaders,
    body: JSON.stringify(thingWithId),
  };
};
