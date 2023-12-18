import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import vue from "rollup-plugin-vue";

export default defineConfig([
  {
    input: "./index.ts", // Your entry point
    output: {
      file: "./dist/index.js", // Output file
      minifyInternalExports: true,
    },
    plugins: [
      typescript({
        tsconfig: "tsconfig.json",
      }),
    ],
  },
  {
    input: "./index.ts", // Your entry point
    output: {
      file: "./dist/types.d.ts", // Output file
    },
    plugins: [vue(), dts()],
  },
]);
