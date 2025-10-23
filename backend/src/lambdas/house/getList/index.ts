import type {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";
import { listHouses } from "../../../services/houseService";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Get houses event:", event);
  const houses = await listHouses();
  return {
    statusCode: 200,
    body: JSON.stringify({
      houses,
    }),
  };
};
