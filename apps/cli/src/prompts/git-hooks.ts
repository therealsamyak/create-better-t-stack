import { isCancel, select } from "@clack/prompts";
import { DEFAULT_CONFIG } from "../constants";
import type { GitHooks } from "../types";
import { exitCancelled } from "../utils/errors";

export async function getGitHooksChoice(gitHooks: GitHooks | undefined) {
  if (gitHooks !== undefined) return gitHooks;

  const response = await select({
    message: "Select Git hooks manager",
    options: [
      {
        value: "husky",
        label: "Husky",
        hint: "Modern native Git hooks made easy",
      },
      {
        value: "lefthook",
        label: "Lefthook",
        hint: "Fast and powerful Git hooks manager",
      },
      {
        value: "none",
        label: "None",
        hint: "No Git hooks manager",
      },
    ],
    initialValue: DEFAULT_CONFIG.gitHooks,
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response as GitHooks;
}
