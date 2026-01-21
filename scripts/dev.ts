import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ora from "ora";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

interface PackageJson {
  name: string;
  version?: string;
}

let browserSyncReady = false;
let sassReady = false;
let pugReady = false;
let tsReady = false;
let hasErrors = false;

let localUrl = "http://localhost:3000";
let externalUrl = "";
let uiUrl = "http://localhost:3001";

const processes: any[] = [];

function getProjectName(): string {
  try {
    const packageJsonPath = path.join(projectRoot, "package.json");
    const packageJson: PackageJson = JSON.parse(
      fs.readFileSync(packageJsonPath, "utf8")
    );
    return packageJson.name || "DAMN DOG";
  } catch {
    return "DAMN DOG";
  }
}

function clearConsole() {
  process.stdout.write("\x1Bc");
}

function displaySuccess(spinner: any) {
  spinner.stop();
  clearConsole();

  const projectName = getProjectName();

  console.log("\n");
  console.log(
    chalk.yellow(" 🐕 ") +
      chalk.bold.white(`${projectName} is running locally\n`)
  );
  console.log(chalk.cyan(" Local:   ") + chalk.white(localUrl));
  if (externalUrl) {
    console.log(chalk.cyan(" Network: ") + chalk.white(externalUrl));
  }
  console.log(chalk.cyan(" UI:      ") + chalk.dim(uiUrl));
  console.log(chalk.dim("\n Watching for changes. Live reload enabled."));
  console.log(
    chalk.dim(" Press ") + chalk.white("Ctrl+C") + chalk.dim(" to stop\n")
  );
}

function checkAllReady(spinner: any) {
  if (browserSyncReady && sassReady && pugReady && tsReady && !hasErrors) {
    setTimeout(() => displaySuccess(spinner), 500);
  }
}

function startProcess(
  name: string,
  command: string,
  args: string[],
  spinner: any
) {
  const proc = spawn(command, args, {
    shell: true,
    cwd: projectRoot,
  });

  processes.push(proc);

  let hasOutput = false;

  proc.stdout.on("data", (data: Buffer) => {
    const output = data.toString();
    hasOutput = true;

    // Capture BrowserSync URLs
    if (name === "BrowserSync") {
      const localMatch = output.match(/Local:\s+(https?:\/\/[^\s]+)/);
      const externalMatch = output.match(/External:\s+(https?:\/\/[^\s]+)/);
      const uiMatch = output.match(/UI:\s+(https?:\/\/[^\s]+)/);

      if (localMatch) localUrl = localMatch[1];
      if (externalMatch) externalUrl = externalMatch[1];
      if (uiMatch) uiUrl = uiMatch[1];
    }

    // Check for ready signals
    if (name === "Sass") {
      if (
        !sassReady &&
        (output.includes("Compiled") ||
          output.includes("Sass is watching") ||
          output.includes("watching for changes"))
      ) {
        sassReady = true;
        spinner.text = `${chalk.green("✓")} Sass ready`;
        checkAllReady(spinner);
      }
    } else if (name === "Pug") {
      if (
        !pugReady &&
        (output.includes("Watching") ||
          output.includes("👀"))
      ) {
        pugReady = true;
        spinner.text = `${chalk.green("✓")} Pug ready`;
        checkAllReady(spinner);
      }
    } else if (name === "TypeScript") {
      if (
        !tsReady &&
        (output.includes("Watching") ||
          output.includes("Found 0 errors") ||
          output.includes("Starting compilation") ||
          output.includes("File change detected"))
      ) {
        tsReady = true;
        spinner.text = `${chalk.green("✓")} TypeScript ready`;
        checkAllReady(spinner);
      }
    } else if (name === "BrowserSync") {
      if (
        !browserSyncReady &&
        (output.includes("Local:") ||
          output.includes("Serving files") ||
          output.includes("Access URLs"))
      ) {
        browserSyncReady = true;
        spinner.text = `${chalk.green("✓")} BrowserSync ready`;
        checkAllReady(spinner);
      }
    }

    // After success display, show only file change messages
    if (browserSyncReady && sassReady && pugReady && tsReady) {
      const shouldShow =
        (output.includes("error") ||
        output.includes("Error") ||
        output.includes("File changed") ||
        output.includes("🔄")) &&
        !output.includes("Rebuilding") &&
        !output.includes("→");

      if (shouldShow) {
        if (output.trim().length > 0) {
          process.stdout.write(chalk.dim(` [${name}] `) + output);
        }
      }
    }
  });

  proc.stderr.on("data", (data: Buffer) => {
    const output = data.toString();
    hasOutput = true;

    // TypeScript and Sass often write to stderr
    if (
      name === "TypeScript" &&
      !tsReady &&
      (output.includes("Watching") || output.includes("Starting compilation"))
    ) {
      tsReady = true;
      spinner.text = `${chalk.green("✓")} TypeScript ready`;
      checkAllReady(spinner);
      return;
    }

    if (name === "Sass" && !sassReady && output.includes("Sass is watching")) {
      sassReady = true;
      spinner.text = `${chalk.green("✓")} Sass ready`;
      checkAllReady(spinner);
      return;
    }

    // Only treat as error if it contains error keywords
    if (
      output.toLowerCase().includes("error") ||
      output.toLowerCase().includes("fail")
    ) {
      hasErrors = true;
      clearConsole();
      console.error(chalk.red(`\n ❌ Error in ${name}:\n`));
      console.error(
        chalk.dim(" ─────────────────────────────────────────────\n")
      );
      console.error(output);
      console.error(
        chalk.dim(" ─────────────────────────────────────────────\n")
      );
    }
  });

  // Assume ready if process hasn't crashed after a delay
  setTimeout(() => {
    if (!hasOutput && proc.exitCode === null) {
      if (name === "Sass" && !sassReady) {
        sassReady = true;
        checkAllReady(spinner);
      } else if (name === "Pug" && !pugReady) {
        pugReady = true;
        checkAllReady(spinner);
      } else if (name === "TypeScript" && !tsReady) {
        tsReady = true;
        checkAllReady(spinner);
      } else if (name === "BrowserSync" && !browserSyncReady) {
        browserSyncReady = true;
        checkAllReady(spinner);
      }
    }
  }, 3000);

  proc.on("exit", (code: number) => {
    if (code !== 0 && code !== null) {
      hasErrors = true;
      spinner.fail(chalk.red(`${name} exited with code ${code}`));
    }
  });
}

async function startDev() {
  const projectName = getProjectName();

  console.log("\n");
  const spinner = ora({
    text: chalk.cyan(`Loading ${projectName}...`),
    color: "cyan",
  }).start();

  // Start all processes
  startProcess(
    "Sass",
    "sass",
    ["sass/damn.scss:css/damn.css", "--no-source-map", "--watch"],
    spinner
  );

  startProcess("Pug", "tsx", ["scripts/watch-pug.ts"], spinner);

  startProcess("TypeScript", "tsc", ["--watch"], spinner);

  startProcess(
    "BrowserSync",
    "browser-sync",
    [
      "start",
      "--server",
      "--files",
      "*.html, css/*.css, js/**/*.js",
      "--no-notify",
      "--no-open",
    ],
    spinner
  );

  // Handle cleanup on exit
  process.on("SIGINT", () => {
    console.log(chalk.yellow("\n\n Stopping dev server...\n"));
    processes.forEach((proc) => proc.kill());
    process.exit(0);
  });

  // Timeout check
  setTimeout(() => {
    if (!browserSyncReady || !sassReady || !pugReady || !tsReady) {
      spinner.warn(
        chalk.yellow("Some services are taking longer than expected...")
      );
    }
  }, 10000);
}

startDev().catch((error) => {
  console.error(chalk.red("\n ❌ Fatal error:\n"));
  console.error(error);
  process.exit(1);
});
