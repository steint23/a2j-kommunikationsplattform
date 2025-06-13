import { existsSync, readFileSync } from "fs";
import { expect, it, vi } from "vitest";
import * as serverConfigModule from "../config.server";

// mock used fs imports within config.server
vi.mock("fs", () => {
  return {
    existsSync: vi.fn().mockReturnValue(true),
    readFileSync: vi.fn().mockReturnValue("XYZ"),
  };
});

describe("serverConfig()", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // save and clear process.env
    process.env = { ...originalEnv };
    delete process.env.SENTRY_DSN;
  });

  afterEach(() => {
    // restore process.env
    process.env = originalEnv;
  });

  it("returns a defined server config item (container env variable)", () => {
    process.env = { SENTRY_DSN: "ABC" };
    const testConfig = serverConfigModule.serverConfig();

    expect(testConfig).toBeDefined();
    expect(testConfig.SENTRY_DSN).toBe("ABC");
  });

  it("returns a defined server config item (secret env variable)", () => {
    const testConfig = serverConfigModule.serverConfig();
    expect(existsSync).toHaveBeenCalled();
    expect(readFileSync).toHaveBeenCalled();
    expect(testConfig.BRAK_IDP_OIDC_CLIENT_SECRET).toBe("XYZ");
  });
});
