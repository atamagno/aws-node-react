import type {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";

import corsResponseHeaders from "../../../utils";
import { deleteThing } from "../../../services/thingService";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Deleting thing by id event:", event);
  const thingId = event.pathParameters?.id as string;
  await deleteThing(thingId);
  return {
    statusCode: 204,
    headers: corsResponseHeaders,
    body: "",
  };
};
