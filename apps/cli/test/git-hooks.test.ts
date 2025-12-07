import { describe, it } from "vitest";
import type { GitHooks } from "../src/types";
import { runTRPCTest, expectSuccess } from "./test-utils";

describe("Git Hooks Configurations", () => {
  describe("Individual Git Hook Options", () => {
    const gitHookOptions = ["husky", "lefthook", "none"] as GitHooks[];

    for (const gitHook of gitHookOptions) {
      it(`should work with ${gitHook} git hooks`, async () => {
        const result = await runTRPCTest({
          projectName: `${gitHook}-git-hooks`,
          gitHooks: gitHook,
          frontend: ["tanstack-router"],
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: "none",
          api: "trpc",
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }
  });

  describe("Lefthook Linter Integration", () => {
    it("should work with lefthook + biome", async () => {
      const result = await runTRPCTest({
        projectName: "lefthook-biome",
        addons: ["biome"],
        gitHooks: "lefthook",
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with lefthook + oxlint", async () => {
      const result = await runTRPCTest({
        projectName: "lefthook-oxlint",
        addons: ["oxlint"],
        gitHooks: "lefthook",
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with lefthook alone (no linter)", async () => {
      const result = await runTRPCTest({
        projectName: "lefthook-standalone",
        gitHooks: "lefthook",
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });
  });

  describe("Husky Integration", () => {
    it("should work with husky + biome", async () => {
      const result = await runTRPCTest({
        projectName: "husky-biome",
        addons: ["biome"],
        gitHooks: "husky",
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with husky + oxlint", async () => {
      const result = await runTRPCTest({
        projectName: "husky-oxlint",
        addons: ["oxlint"],
        gitHooks: "husky",
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with husky alone (no linter)", async () => {
      const result = await runTRPCTest({
        projectName: "husky-standalone",
        gitHooks: "husky",
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });
  });

  describe("Hooks with Addons", () => {
    it("should work with multiple addons + hooks", async () => {
      const result = await runTRPCTest({
        projectName: "multiple-addons-with-hooks",
        addons: ["biome", "turborepo", "pwa"],
        gitHooks: "lefthook",
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });
  });

  describe("Ultracite Integration", () => {
    it("should work with ultracite + lefthook", async () => {
      const result = await runTRPCTest({
        projectName: "ultracite-lefthook",
        addons: ["ultracite"],
        gitHooks: "lefthook",
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with ultracite + husky", async () => {
      const result = await runTRPCTest({
        projectName: "ultracite-husky",
        addons: ["ultracite"],
        gitHooks: "husky",
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });
  });

  describe("Hooks Default Behavior", () => {
    it("should use default hooks when not specified", async () => {
      const result = await runTRPCTest({
        projectName: "default-hooks",
        frontend: ["tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "trpc",
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });
  });
});
