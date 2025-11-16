import type { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";

import corsResponseHeaders from "../../../utils/cors";
import { listThings } from "../../../services/thingService";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("Get thing list event:", event);
  const things = await listThings();
  return {
    statusCode: 200,
    headers: corsResponseHeaders,
    body: JSON.stringify(things),
  };
};
