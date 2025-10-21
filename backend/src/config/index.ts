import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT || 4000,
  awsRegion: (process.env.AWS_REGION as string) || "ap-southeast-2",
  housesTableName: (process.env.HOUSES_TABLE_NAME as string) || "houses",
};
