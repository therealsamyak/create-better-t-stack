import path from "node:path";
import fs from "fs-extra";
import Handlebars from "handlebars";
import type { ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";
import { PKG_ROOT } from "../../constants";

export async function setupGitHooks(config: ProjectConfig) {
  const { projectDir, gitHooks, addons } = config;

  // Skip if ultracite is handling git hooks
  if (addons.includes("ultracite") && gitHooks !== "none") {
    return;
  }

  if (gitHooks === "none") return;

  // Determine which linters are selected from addons
  const hasBiome = addons.includes("biome");
  const hasOxlint = addons.includes("oxlint");

  if (gitHooks === "husky") {
    // For husky, we still use the old linter logic since it needs lint-staged
    let linter: "biome" | "oxlint" | undefined;
    if (hasOxlint) {
      linter = "oxlint";
    } else if (hasBiome) {
      linter = "biome";
    }
    await setupHusky(projectDir, linter);
  } else if (gitHooks === "lefthook") {
    await setupLefthook(projectDir, hasBiome, hasOxlint);
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

export async function setupLefthook(projectDir: string, biome?: boolean, oxlint?: boolean) {
  await addPackageDependency({
    devDependencies: ["lefthook"],
    projectDir,
  });

  const packageJsonPath = path.join(projectDir, "package.json");
  if (await fs.pathExists(packageJsonPath)) {
    const packageJson = await fs.readJson(packageJsonPath);

    packageJson.scripts = {
      ...packageJson.scripts,
      prepare: "lefthook install",
    };

    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  }

  // Always create lefthook.yml with the template
  // Read and compile Handlebars template
  const templatePath = path.join(PKG_ROOT, "templates/git-hooks/lefthook/lefthook.yml.hbs");
  const templateContent = await fs.readFile(templatePath, "utf-8");
  const template = Handlebars.compile(templateContent);

  // Generate lefthook.yml content using template
  const lefthookYmlContent = template({ biome, oxlint });

  const lefthookYmlPath = path.join(projectDir, "lefthook.yml");
  await fs.writeFile(lefthookYmlPath, lefthookYmlContent);
}
