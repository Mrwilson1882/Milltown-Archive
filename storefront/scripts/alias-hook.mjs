/**
 * A resolve hook that teaches plain Node the "@/…" alias from tsconfig.json,
 * and fills in the extension the TypeScript sources leave off.
 *
 * Only `scripts/check-import.mjs` uses it — Next resolves the alias itself.
 * It exists so the importer can be run and reported on without a full build.
 */

import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "src");

export function resolve(specifier, context, nextResolve) {
  if (!specifier.startsWith("@/")) return nextResolve(specifier, context);

  const base = join(SRC, specifier.slice(2));
  const candidate = [base, `${base}.ts`, `${base}.tsx`, join(base, "index.ts")].find(existsSync);

  if (!candidate) return nextResolve(specifier, context);
  return { url: pathToFileURL(candidate).href, shortCircuit: true };
}
