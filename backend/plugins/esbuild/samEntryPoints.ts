import yaml from "js-yaml";
import { readFileSync } from "fs";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const cloudFormationSchema = require("@serverless/utils/cloudformation-schema");

type CloudFormationTemplate = {
  Resources: {
    [key: string]: {
      Type: string;
      Properties: { [key: string]: unknown };
    };
  };
};

const loadYaml = (fileName: string): CloudFormationTemplate => {
  try {
    return yaml.load(readFileSync(fileName).toString(), {
      schema: cloudFormationSchema,
    }) as CloudFormationTemplate;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    throw error;
  }
};

const samEntryPoints = (cfnFileName: string): string[] => {
  const cfnTemplate = loadYaml(cfnFileName);
  const functions = Object.entries(cfnTemplate.Resources)
    .filter(([, value]) => value.Type === "AWS::Serverless::Function")
    .map(([, value]) => `${(value.Properties.CodeUri as string).replace("../dist", "src")}/index.ts`);
  return functions;
};

export default samEntryPoints;
