/* eslint-disable import/no-anonymous-default-export */
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import dts from "rollup-plugin-dts";
import json from '@rollup/plugin-json';
import external from '@yelo/rollup-node-external';

const packageJson = require("./package.json");

export default [
    {
        input: "src/lib.ts",
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
        external: external(), // in order to ignore all modules in node_modules folder
        plugins: [
            resolve({
                browser: true,
                preferBuiltins: true,
                extensions: [".ts", ".tsx"],
            }),
            commonjs(),
            typescript({ tsconfig: "./tsconfig.json" }),
            json(),
            postcss(),
        ],
    },
    {
        input: "src/lib.ts",
        output: [{ file: "dist/index.d.ts", format: "esm" }],
        plugins: [dts()],
        external: [/\.css|less|scss$/],
    }
];