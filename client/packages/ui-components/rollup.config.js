import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

import dts from "rollup-plugin-dts";
import scss from 'rollup-plugin-scss'
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { terser } from "rollup-plugin-minification";

const packageJson = require("./package.json");

export default [
  {
    input: "index.ts",
    output: [
        {
            file: packageJson.main,
            format: "cjs",
            sourcemap: true,
    },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      scss({ output: 'totallywired.css' }),
      typescript({ tsconfig: "./tsconfig.json" }),
      terser(),
    ],
    external: ["react", "react-dom"],
  },
  {
    input: "index.ts",
    output: [{ file: "dist/types.d.ts", format: "es" }],
    plugins: [dts.default()],
    external: [/\.(css|scss)$/u]
  },
];
