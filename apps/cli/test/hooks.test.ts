import { describe, it } from "vitest";
import type { Hooks } from "../src/types";
import { expectSuccess, runTRPCTest } from "./test-utils";

describe("Hooks Configurations", () => {
  describe("Individual Hook Options", () => {
    const hookOptions = ["husky", "lefthook", "none"] as Hooks[];

    for (const hook of hookOptions) {
      it(`should work with ${hook} hooks`, async () => {
        const result = await runTRPCTest({
          projectName: `${hook}-hooks`,
          hooks: hook,
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
        hooks: "lefthook",
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
        hooks: "lefthook",
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
        hooks: "lefthook",
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
        hooks: "husky",
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
        hooks: "husky",
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
        hooks: "husky",
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
        hooks: "lefthook",
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
