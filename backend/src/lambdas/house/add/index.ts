import type {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";
import { CreateHouseDto } from "../../../types/House";
import { writeHouse } from "../../../services/houseService";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Add house event:", event);
  const newHouse = JSON.parse(event.body || "{}") as CreateHouseDto;
  const houseWithId = await writeHouse(newHouse);
  return {
    statusCode: 200,
    body: JSON.stringify({
      house: houseWithId,
    }),
  };
};
