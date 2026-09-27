import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { execFile } from "child_process";
import { fileURLToPath } from "url";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOTTRACE_DIR = path.resolve(__dirname, "../..");

const DEMO_REPO = path.join(
  ROOTTRACE_DIR,
  "demo-repo"
);

const CASE_FILE = path.join(
  ROOTTRACE_DIR,
  "bob_sessions",
  "001-checkout-pricing-investigation.md"
);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "roottrace-backend"
  });
});

app.get("/api/demo", (req, res) => {
  res.json({
    repository: "demo-repo",
    bug: "Checkout pricing discount conversion failure",
    investigation: "001-checkout-pricing-investigation"
  });
});

app.get("/api/case", (req, res) => {
  try {
    const content = fs.readFileSync(CASE_FILE, "utf8");

    res.json({
      id: "RT-001",
      title: "Checkout Pricing Failure",
      status: "resolved",
      source: "IBM Bob investigation",
      caseFile: content
    });
  } catch (error) {
    res.status(500).json({
      error: "Unable to read RootTrace case file",
      message: error.message
    });
  }
});

app.post("/api/reproduce", async (req, res) => {
  try {
    const testResult = await runCommand(
      "npm",
      ["test"],
      DEMO_REPO
    );

    const appResult = await runCommand(
      "npm",
      ["start"],
      DEMO_REPO
    );

    res.json({
      repository: "demo-repo",
      command: "live reproduction",
      test: testResult,
      application: appResult,
      reproduced:
        testResult.exitCode !== 0 ||
        appResult.exitCode !== 0
    });
  } catch (error) {
    res.status(500).json({
      error: "Live reproduction failed",
      message: error.message
    });
  }
});

async function runCommand(command, args, cwd) {
  try {
    const result = await execFileAsync(command, args, {
      cwd,
      timeout: 10000,
      maxBuffer: 1024 * 1024
    });

    return {
      command: `${command} ${args.join(" ")}`,
      exitCode: 0,
      stdout: result.stdout,
      stderr: result.stderr
    };
  } catch (error) {
    return {
      command: `${command} ${args.join(" ")}`,
      exitCode:
        typeof error.code === "number"
          ? error.code
          : 1,
      stdout: error.stdout || "",
      stderr: error.stderr || error.message
    };
  }
}

app.listen(PORT, () => {
  console.log(
    `RootTrace backend running on http://localhost:${PORT}`
  );
});