import type { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";

import { Thing } from "../../../types/Thing";
import corsResponseHeaders from "../../../utils/cors";
import { updateThing } from "../../../services/thingService";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("Update thing event:", event);
  const newThing = JSON.parse(event.body || "{}") as Thing;
  const updatedThing = await updateThing(newThing);
  return {
    statusCode: 200,
    headers: corsResponseHeaders,
    body: JSON.stringify(updatedThing),
  };
};
