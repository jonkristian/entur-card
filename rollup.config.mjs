import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import ignore from "./rollup-plugins/rollup-ignore-plugin.js";

const IGNORED_FILES = [
  "@material/mwc-menu/mwc-menu.js",
  "@material/mwc-menu/mwc-menu-surface.js",
  "@material/mwc-ripple/mwc-ripple.js",
  "@material/mwc-list/mwc-list.js",
  "@material/mwc-list/mwc-list-item.js",
  "@material/mwc-icon/mwc-icon.js",
  "@material/mwc-notched-outline/mwc-notched-outline.js",
];

const dev = process.env.ROLLUP_WATCH;

const plugins = [
  ignore({
    files: IGNORED_FILES.map((file) => require.resolve(file)),
  }),
  typescript({
    declaration: false,
  }),
  nodeResolve(),
  json(),
  commonjs(),
  babel({
    babelHelpers: "bundled",
  }),
  !dev && terser({ format: { comments: false } }),
];

export default [
  {
    input: "src/entur-card.ts",
    output: {
      file: "dist/entur-card.js",
      format: "es",
      inlineDynamicImports: true,
    },
    plugins,
  },
];
