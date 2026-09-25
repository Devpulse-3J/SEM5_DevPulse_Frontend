import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * NEXT_PUBLIC_API_BASE_URL already ends in `/api` in production ("/api"), so
 * every endpoint passed to apiClient is written WITHOUT that prefix
 * ("/auth/login"). An endpoint that still starts with "/api/" is sent as
 * "/api/api/..." and the gateway answers 404. It merges silently - there is no
 * text conflict when one branch adds the prefix and another removes it - so
 * guard it here.
 */
function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === "__tests__" ? [] : sourceFiles(path);
    return /\.(ts|tsx)$/.test(name) ? [path] : [];
  });
}

describe("apiClient endpoint convention", () => {
  it("never passes an endpoint that repeats the /api base prefix", () => {
    const offenders: string[] = [];
    for (const file of sourceFiles(join(process.cwd(), "src"))) {
      const text = readFileSync(file, "utf8");
      // apiClient.<verb>( optionally generic, optionally on the next line, then a "/api/ or `/api/ literal
      const call = /apiClient\s*\.\s*(?:get|post|put|patch|delete)\s*(?:<[^()]*>)?\s*\(\s*["`]\/api\//g;
      // hand-built fallback URLs: `${base}/api/...` where base already ends in /api.
      // `${window.location.origin}/api/...` is a correct public URL, so it is exempt.
      const built = /\$\{(?![^}]*location\.origin)[^}]*\}\/api\//;
      if (call.test(text) || built.test(text)) offenders.push(file.replace(process.cwd() + "/", ""));
    }
    expect(offenders).toEqual([]);
  });
});
