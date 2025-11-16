import dotenv from "dotenv";

const environment = process.env.NODE_ENV || "development";

dotenv.config({ path: `.env.${environment}` });

export default {
  port: process.env.PORT || 4000,
  awsRegion: (process.env.AWS_REGION as string) || "ap-southeast-2",
  thingsTableName: (process.env.THINGS_TABLE_NAME as string) || "things",
  frontendDistributionDomainName: (process.env.FRONTEND_DISTRIBUTION_DOMAIN_NAME as string) || "test.cloudfront.net",
};
