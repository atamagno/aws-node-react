import dotenv from "dotenv";
import { build } from "esbuild";
import type { BuildOptions } from "esbuild";

dotenv.config();

const isProd = process.env.NODE_ENV === "production";

// TODO: extract entry points dynamically from sam template
const buildOptions: BuildOptions = {
  entryPoints: ["src/index.ts", "src/lambdas/helloWorld/index.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  outdir: "dist",
  minify: isProd,
  sourcemap: !isProd,
  external: [],
};

build(buildOptions).catch(() => process.exit(1));
