import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/rpc.ts"],
  format: ["esm"],
  outDir: "dist",
  clean: true,
  sourcemap: true,
  skipNodeModulesBundle: true,
  // Don't bundle external dependencies
  external: ["hono", "@repo/auth", "@repo/core"],
  // TypeScript options
  tsconfig: "tsconfig.json",
  // DTS options
  dts: {
    resolve: true,
    compilerOptions: {
      composite: false,
      incremental: false,
    },
  },
});
