import { mockClient } from "aws-sdk-client-mock";
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DeleteCommand, GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

import config from "../config";
import { CreateThingDto, Thing } from "../types/Thing";
import { checkDbConnection, createThing, getThingById, handleDbError, listThings, removeThing, updateThing } from "./thingService";

// mock uuid
jest.mock("uuid", () => ({
  v4: jest.fn(() => "test-uuid-1234"),
}));

// mock logger to prevent console output during tests
jest.mock("../utils/logger", () => {
  const mockLogger = {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  };
  return {
    __esModule: true,
    default: mockLogger,
  };
});

const ddbMock = mockClient(DynamoDBDocumentClient);

describe("thingService", () => {
  const mockTableName = config.thingsTableName;

  beforeEach(() => {
    ddbMock.reset();
  });

  afterEach(() => {
    ddbMock.restore();
  });

  describe("checkDbConnection", () => {
    it("should successfully check database connection", async () => {
      ddbMock.on(ScanCommand).resolves({ Count: 0 });

      await expect(checkDbConnection()).resolves.not.toThrow();

      expect(ddbMock.calls()).toHaveLength(1);
      expect(ddbMock.call(0).args[0].input).toEqual({
        TableName: mockTableName,
        Limit: 1,
        Select: "COUNT",
      });
    });

    it("should throw ApiError when database connection fails", async () => {
      const dbError = new Error("Connection timeout");
      ddbMock.on(ScanCommand).rejects(dbError);

      await expect(checkDbConnection()).rejects.toMatchObject({
        name: "HealthCheckFailure",
        statusCode: 503,
        message: "Database connection failed",
        internalError: "Connection timeout",
      });
    });

    it("should handle non-Error exceptions", async () => {
      // Mock docClient.send to throw a non-Error value to test the fallback path
      const mockSend = jest.spyOn(DynamoDBDocumentClient.prototype, "send");
      mockSend.mockImplementation(() => {
        throw "generic exception"; // Throw a non-Error value
      });

      await expect(checkDbConnection()).rejects.toMatchObject({
        name: "HealthCheckFailure",
        statusCode: 503,
        message: "Database connection failed",
        internalError: "Unknown DB health check error",
      });

      mockSend.mockRestore();
    });
  });

  describe("handleDbError", () => {
    it("should throw ApiError with Error instance message", () => {
      const testError = new Error("Test database error");

      expect(() => handleDbError("CREATE", testError)).toThrow();

      try {
        handleDbError("CREATE", testError);
      } catch (error) {
        expect(error).toMatchObject({
          name: "DatabaseError",
          statusCode: 500,
          message: "Failed to create entity",
          internalError: "Test database error",
        });
      }
    });

    it("should throw ApiError with 'Unknown DB error' for non-Error exceptions", () => {
      const testError = "string error";

      expect(() => handleDbError("UPDATE", testError)).toThrow();

      try {
        handleDbError("UPDATE", testError);
      } catch (error) {
        expect(error).toMatchObject({
          name: "DatabaseError",
          statusCode: 500,
          message: "Failed to update entity",
          internalError: "Unknown DB error",
        });
      }
    });
  });

  describe("listThings", () => {
    it("should return list of things", async () => {
      const mockThings: Thing[] = [
        {
          id: "1",
          description: "Thing 1",
          createdAt: 1234567890,
        },
        {
          id: "2",
          description: "Thing 2",
          createdAt: 1234567891,
        },
      ];

      ddbMock.on(ScanCommand).resolves({
        Items: mockThings,
      });

      const result = await listThings();

      expect(result).toEqual(mockThings);
      expect(ddbMock.calls()).toHaveLength(1);
      expect(ddbMock.call(0).args[0].input).toEqual({
        TableName: mockTableName,
      });
    });

    it("should return empty array when no items exist", async () => {
      ddbMock.on(ScanCommand).resolves({
        Items: [],
      });

      const result = await listThings();

      expect(result).toEqual([]);
    });

    it("should throw ApiError when scan fails", async () => {
      const dbError = new Error("Scan failed");
      ddbMock.on(ScanCommand).rejects(dbError);

      await expect(listThings()).rejects.toMatchObject({
        name: "DatabaseError",
        statusCode: 500,
        message: "Failed to scan entity",
        internalError: "Scan failed",
      });
    });
  });

  describe("createThing", () => {
    it("should create a new thing with generated id and createdAt", async () => {
      const newThing: CreateThingDto = {
        description: "New thing",
      };

      ddbMock.on(PutCommand).resolves({});

      const mockNow = 1234567890;
      jest.spyOn(Date, "now").mockReturnValue(mockNow);

      const result = await createThing(newThing);

      expect(result).toEqual({
        id: "test-uuid-1234",
        description: "New thing",
        createdAt: mockNow,
      });

      expect(ddbMock.calls()).toHaveLength(1);
      expect(ddbMock.call(0).args[0].input).toEqual({
        TableName: mockTableName,
        Item: {
          id: "test-uuid-1234",
          description: "New thing",
          createdAt: mockNow,
        },
      });
    });

    it("should throw ApiError when create fails", async () => {
      const newThing: CreateThingDto = {
        description: "New thing",
      };

      const dbError = new Error("Put failed");
      ddbMock.on(PutCommand).rejects(dbError);

      await expect(createThing(newThing)).rejects.toMatchObject({
        name: "DatabaseError",
        statusCode: 500,
        message: "Failed to create entity",
        internalError: "Put failed",
      });
    });
  });

  describe("getThingById", () => {
    it("should return a thing by id", async () => {
      const mockThing: Thing = {
        id: "test-id",
        description: "Test thing",
        createdAt: 1234567890,
      };

      ddbMock.on(GetCommand).resolves({
        Item: mockThing,
      });

      const result = await getThingById("test-id");

      expect(result).toEqual(mockThing);
      expect(ddbMock.calls()).toHaveLength(1);
      expect(ddbMock.call(0).args[0].input).toEqual({
        TableName: mockTableName,
        Key: { id: "test-id" },
      });
    });

    it("should return undefined when thing not found", async () => {
      ddbMock.on(GetCommand).resolves({
        Item: undefined,
      });

      const result = await getThingById("non-existent-id");

      expect(result).toBeUndefined();
    });

    it("should throw ApiError when get fails", async () => {
      const dbError = new Error("Get failed");
      ddbMock.on(GetCommand).rejects(dbError);

      await expect(getThingById("test-id")).rejects.toMatchObject({
        name: "DatabaseError",
        statusCode: 500,
        message: "Failed to get entity",
        internalError: "Get failed",
      });
    });
  });

  describe("updateThing", () => {
    it("should update an existing thing with updatedAt timestamp", async () => {
      const existingThing: Thing = {
        id: "test-id",
        description: "Updated description",
        createdAt: 1234567890,
      };

      ddbMock.on(PutCommand).resolves({});

      const mockNow = 1234567999;
      jest.spyOn(Date, "now").mockReturnValue(mockNow);

      const result = await updateThing(existingThing);

      expect(result).toEqual({
        ...existingThing,
        updatedAt: mockNow,
      });

      expect(ddbMock.calls()).toHaveLength(1);
      expect(ddbMock.call(0).args[0].input).toEqual({
        TableName: mockTableName,
        Item: {
          ...existingThing,
          updatedAt: mockNow,
        },
      });
    });

    it("should throw ApiError when update fails", async () => {
      const existingThing: Thing = {
        id: "test-id",
        description: "Updated description",
        createdAt: 1234567890,
      };

      const dbError = new Error("Update failed");
      ddbMock.on(PutCommand).rejects(dbError);

      await expect(updateThing(existingThing)).rejects.toMatchObject({
        name: "DatabaseError",
        statusCode: 500,
        message: "Failed to update entity",
        internalError: "Update failed",
      });
    });
  });

  describe("removeThing", () => {
    it("should delete a thing by id", async () => {
      ddbMock.on(DeleteCommand).resolves({});

      await removeThing("test-id");

      expect(ddbMock.calls()).toHaveLength(1);
      expect(ddbMock.call(0).args[0].input).toEqual({
        TableName: mockTableName,
        Key: { id: "test-id" },
      });
    });

    it("should throw ApiError when delete fails", async () => {
      const dbError = new Error("Delete failed");
      ddbMock.on(DeleteCommand).rejects(dbError);

      await expect(removeThing("test-id")).rejects.toMatchObject({
        name: "DatabaseError",
        statusCode: 500,
        message: "Failed to delete entity",
        internalError: "Delete failed",
      });
    });
  });
});
