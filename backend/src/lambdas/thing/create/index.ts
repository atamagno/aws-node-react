import type {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";

import corsResponseHeaders from "../../../utils";
import { CreateThingDto } from "../../../types/Thing";
import { createThing } from "../../../services/thingService";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Add thing event:", event);
  const newThing = JSON.parse(event.body || "{}") as CreateThingDto;
  const thingWithId = await createThing(newThing);
  return {
    statusCode: 200,
    headers: corsResponseHeaders,
    body: JSON.stringify(thingWithId),
  };
};
