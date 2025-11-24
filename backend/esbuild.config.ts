import dotenv from "dotenv";
import { build } from "esbuild";
import type { BuildOptions } from "esbuild";

import samEntryPoints from "./plugins/esbuild/samEntryPoints";

dotenv.config();

const isProd = process.env.NODE_ENV === "production";
const backend = process.env.BACKEND;

(async () => {
  try {
    console.log(`Building for backend target: ${backend}`);
    const entryPoints = ["src/index.ts", ...samEntryPoints("cfn/api-lambda.yaml")];
    console.log("Building with entry points:", entryPoints);
    const buildOptions: BuildOptions = {
      entryPoints,
      bundle: true,
      platform: "node",
      target: "node20",
      outdir: "dist",
      minify: isProd,
      sourcemap: !isProd,
      external: ["dtrace-provider", "mv"],
    };
    await build(buildOptions);
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
})();
