import prompts from "prompts";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

/**
 * Setup script for initial project configuration
 */
async function setup() {
  console.log(`
╭───────────────────────────────────────────────────╮
│ 🐕 DAMN DOG — Project Setup                      │
├───────────────────────────────────────────────────┤
│ Let's configure your project...                   │
╰───────────────────────────────────────────────────╯
`);

  const response = await prompts([
    {
      type: "text",
      name: "projectName",
      message: "Project name:",
      initial: "damn-dog",
    },
    {
      type: "text",
      name: "siteUrl",
      message: "Site URL (optional, e.g., https://damn.dog):",
      initial: "https://damn.dog",
    },
  ]);

  if (!response.projectName) {
    console.log("\n❌ Setup cancelled.");
    process.exit(0);
  }

  console.log("\n📝 Updating project files...");

  // Update package.json
  try {
    const packageJsonPath = path.join(projectRoot, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    packageJson.name = response.projectName.toLowerCase().replace(/\s+/g, "-");
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log("✓ Updated package.json");
  } catch (error: any) {
    console.error("❌ Error updating package.json:", error.message);
  }

  // Update TypeScript variables if needed
  if (response.siteUrl) {
    try {
      const tsVarsPath = path.join(projectRoot, "ts", "partials", "_variables.ts");
      let tsVars = fs.readFileSync(tsVarsPath, "utf8");
      tsVars = tsVars.replace(
        /export const siteURL = ".*";/,
        `export const siteURL = "${response.siteUrl}";`
      );
      fs.writeFileSync(tsVarsPath, tsVars);
      console.log("✓ Updated TypeScript variables");
    } catch (error: any) {
      console.error("❌ Error updating TypeScript variables:", error.message);
    }
  }

  console.log("\n✨ Setup complete! Your project is ready.");
  console.log("\n📦 Next steps:");
  console.log("   npm install     - Install dependencies");
  console.log("   npm run dev     - Start development server");
  console.log("   npm run build   - Build for production");
  console.log("   npm test        - Check for errors\n");
}

setup().catch((error) => {
  console.error("Setup error:", error);
  process.exit(1);
});
