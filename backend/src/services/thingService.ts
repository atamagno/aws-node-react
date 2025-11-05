import { v4 as uuidv4 } from "uuid";

import {
  PutCommand,
  PutCommandInput,
  ScanCommand,
  ScanCommandInput,
} from "@aws-sdk/lib-dynamodb";

import config from "../config";
import docClient from "../lib/dynamodb/client";
import { CreateThingDto, Thing } from "../types/Thing";

const listThings = async (): Promise<Thing[]> => {
  try {
    const params: ScanCommandInput = {
      TableName: config.thingsTableName,
    };
    const things = await docClient.send(new ScanCommand(params));
    return things.Items as Thing[];
  } catch (error) {
    console.error("Error fetching things from DynamoDB:", error);
    return [];
  }
};

const writeThing = async (newThing: CreateThingDto): Promise<Thing> => {
  try {
    const thingWithId = { id: uuidv4(), ...newThing };
    const params: PutCommandInput = {
      TableName: config.thingsTableName,
      Item: thingWithId,
    };
    await docClient.send(new PutCommand(params));
    return thingWithId;
  } catch (error) {
    console.error("Error writing thing to DynamoDB:", error);
    throw error;
  }
};

export { listThings, writeThing };
