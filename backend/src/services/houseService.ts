import { CreateHouseDto, House } from "../types/House";
import {
  PutCommand,
  PutCommandInput,
  ScanCommand,
  ScanCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import docClient from "../lib/dynamodb/client";
import config from "../config";

const listHouses = async (): Promise<House[]> => {
  try {
    const params: ScanCommandInput = {
      TableName: config.housesTableName,
    };
    const houses = await docClient.send(new ScanCommand(params));
    return houses.Items as House[];
  } catch (error) {
    console.error("Error fetching houses from DynamoDB:", error);
    return [];
  }
};

const writeHouse = async (newHouse: CreateHouseDto): Promise<House> => {
  try {
    const houseWithId = { id: uuidv4(), ...newHouse };
    const params: PutCommandInput = {
      TableName: config.housesTableName,
      Item: houseWithId,
    };
    await docClient.send(new PutCommand(params));
    return houseWithId;
  } catch (error) {
    console.error("Error writing house to DynamoDB:", error);
    throw error;
  }
};

export { listHouses, writeHouse };
