#!/usr/bin/env node
/**
 * Starts the app for the end-to-end suites, with editable site content pointed
 * at a namespace of its own.
 *
 *   npm run test-server            # port 3002
 *   npm run test-server -- -p 3005
 *
 * The suites save and clear the homepage, header and footer records as they go.
 * Those live in the same Redis the deployed sites read, so running them against
 * a plain `next start` edits live content — on 5 Oct 2026 that wrote
 * `sections: []` over a configured homepage an operator had switched on three
 * days earlier.
 *
 * CONTENT_TEST_NAMESPACE moves those three records to test_<store>_<name>. It is
 * ignored on Vercel, so it cannot affect a deployment; see lib/store.js.
 */

const { spawn } = require("child_process");

const args = process.argv.slice(2);
const port = args.includes("-p") || args.includes("--port") ? [] : ["-p", "3002"];

console.log("  content namespace  test_  (live records are not touched)");
console.log("  port               " + (port[1] ?? args[args.indexOf("-p") + 1] ?? "3002"));

const child = spawn("npx", ["next", "start", ...port, ...args], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, CONTENT_TEST_NAMESPACE: "test" },
});

child.on("exit", (code) => process.exit(code ?? 0));
