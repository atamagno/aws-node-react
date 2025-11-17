import dotenv from "dotenv";
import { build } from "esbuild";
import type { BuildOptions } from "esbuild";

import samEntryPoints from "./plugins/esbuild/samEntryPoints";

dotenv.config();

const isProd = process.env.NODE_ENV === "production";

(async () => {
  try {
    const entryPoints = [...samEntryPoints("cfn/api-lambda.yaml")];
    console.log("Building with entry points:", entryPoints);
    const buildOptions: BuildOptions = {
      entryPoints,
      bundle: true,
      platform: "node",
      target: "node20",
      outdir: "dist",
      minify: isProd,
      sourcemap: !isProd,
      external: [],
    };
    await build(buildOptions);
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
})();
