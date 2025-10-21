import dotenv from "dotenv";

const environment = process.env.NODE_ENV || "development";

dotenv.config({ path: `.env.${environment}` });

export default {
  port: process.env.PORT || 4000,
  awsRegion: (process.env.AWS_REGION as string) || "ap-southeast-2",
  housesTableName: (process.env.HOUSES_TABLE_NAME as string) || "houses",
  bidsTableName: (process.env.BIDS_TABLE_NAME as string) || "bids",
};
