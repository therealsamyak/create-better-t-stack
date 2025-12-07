import path from "node:path";
import fs from "fs-extra";
import Handlebars from "handlebars";
import type { ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";

export async function setupGitHooks(config: ProjectConfig) {
  const { projectDir, gitHooks, addons } = config;

  // Skip if ultracite is handling git hooks
  if (addons.includes("ultracite") && gitHooks !== "none") {
    return;
  }

  if (gitHooks === "none") return;

  // Determine which linter is selected from addons
  let linter: "biome" | "oxlint" | undefined;
  if (addons.includes("oxlint")) {
    linter = "oxlint";
  } else if (addons.includes("biome")) {
    linter = "biome";
  }

  if (gitHooks === "husky") {
    await setupHusky(projectDir, linter);
  } else if (gitHooks === "lefthook") {
    await setupLefthook(projectDir, linter);
  }
}

export async function setupHusky(projectDir: string, linter?: "biome" | "oxlint") {
  await addPackageDependency({
    devDependencies: ["husky", "lint-staged"],
    projectDir,
  });

  const packageJsonPath = path.join(projectDir, "package.json");
  if (await fs.pathExists(packageJsonPath)) {
    const packageJson = await fs.readJson(packageJsonPath);

    packageJson.scripts = {
      ...packageJson.scripts,
      prepare: "husky",
    };

    if (linter === "oxlint") {
      packageJson["lint-staged"] = {
        "**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx,vue,astro,svelte}": "oxlint",
      };
    } else if (linter === "biome") {
      packageJson["lint-staged"] = {
        "*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}": ["biome check --write ."],
      };
    } else {
      packageJson["lint-staged"] = {
        "**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx,vue,astro,svelte}": "",
      };
    }

    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  }
}

export async function setupLefthook(projectDir: string, linter?: "biome" | "oxlint") {
  await addPackageDependency({
    devDependencies: ["lefthook", "lint-staged"],
    projectDir,
  });

  const packageJsonPath = path.join(projectDir, "package.json");
  if (await fs.pathExists(packageJsonPath)) {
    const packageJson = await fs.readJson(packageJsonPath);

    packageJson.scripts = {
      ...packageJson.scripts,
      prepare: "lefthook install",
    };

    if (linter === "oxlint") {
      packageJson["lint-staged"] = {
        "**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx,vue,astro,svelte}": "oxlint",
      };
    } else if (linter === "biome") {
      packageJson["lint-staged"] = {
        "*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}": ["biome check --write ."],
      };
    } else {
      packageJson["lint-staged"] = {
        "**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx,vue,astro,svelte}": "",
      };
    }

    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  }

  // Only create lefthook.yml if there's a linter configured
  // Otherwise, let lefthook use its default configuration
  if (linter) {
    // Read and compile Handlebars template
    const templatePath = path.join(
      __dirname,
      "../../../templates/git-hooks/lefthook/lefthook.yml.hbs",
    );
    const templateContent = await fs.readFile(templatePath, "utf-8");
    const template = Handlebars.compile(templateContent);

    // Generate lefthook.yml content using template
    const lefthookYmlContent = template({ linter });

    const lefthookYmlPath = path.join(projectDir, "lefthook.yml");
    await fs.writeFile(lefthookYmlPath, lefthookYmlContent);
  }
}
