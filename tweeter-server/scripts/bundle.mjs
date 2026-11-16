// AI-assisted: see AI-ATTRIBUTION.md
//
// SAM's built-in build methods (esbuild and makefile) both copy this
// directory into an isolated scratch dir before bundling, which breaks the
// npm-workspace symlink to ../tweeter-shared. Bundling here instead, before
// SAM ever runs, means module resolution happens in the real repo tree,
// where that symlink still resolves. The output has zero remaining
// imports, so SAM's build step just copies it as-is - no Metadata.BuildMethod
// needed in template.yaml.
//
// Add one entry here, and a matching CodeUri/Handler in template.yaml, for
// every new Lambda function.

import * as esbuild from "esbuild";

const functions = [
  { name: "LoginFunction", entry: "src/lambda/handler/LoginLambda.ts" },
  { name: "LogoutFunction", entry: "src/lambda/handler/LogoutLambda.ts" },
];

for (const fn of functions) {
  await esbuild.build({
    entryPoints: [fn.entry],
    bundle: true,
    platform: "node",
    target: "node20",
    sourcemap: true,
    outfile: `dist-lambdas/${fn.name}/index.js`,
  });
  console.log(`Bundled ${fn.name}`);
}
