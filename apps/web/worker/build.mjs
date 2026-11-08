// Cloudflare Pages용 API Worker를 만든다. `vite build`로 dist를 만든 뒤 실행한다.
// 1) API 스키마로 Worker(workerd)용 Prisma client를 생성한다.
// 2) apps/api의 controller·service를 Nest·node 대체 모듈과 함께 dist/_worker.js/로 묶는다.
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const workerDir = dirname(fileURLToPath(import.meta.url));
const webDir = resolve(workerDir, "..");
const apiDir = resolve(webDir, "../api");
const generatedDir = resolve(workerDir, "generated");
const outDir = resolve(webDir, "dist/_worker.js");

function generatePrismaClient() {
  const schema = readFileSync(resolve(apiDir, "prisma/schema.prisma"), "utf8");
  const generator = /generator client \{[^}]*\}/;
  if (!generator.test(schema)) throw new Error("schema.prisma에서 generator client를 찾지 못했습니다.");
  rmSync(generatedDir, { recursive: true, force: true });
  const schemaDir = resolve(generatedDir, ".schema");
  mkdirSync(schemaDir, { recursive: true });
  const output = resolve(generatedDir, "prisma").replaceAll("\\", "/");
  writeFileSync(
    resolve(schemaDir, "schema.prisma"),
    schema.replace(generator, `generator client {\n  provider = "prisma-client"\n  output   = "${output}"\n  runtime  = "workerd"\n}`),
  );
  const bin = resolve(apiDir, "node_modules/.bin");
  execFileSync("prisma", ["generate", "--schema", resolve(schemaDir, "schema.prisma")], {
    cwd: apiDir,
    stdio: "inherit",
    shell: process.platform === "win32",
    env: { ...process.env, PATH: `${bin}${process.platform === "win32" ? ";" : ":"}${process.env.PATH}` },
  });
  rmSync(schemaDir, { recursive: true, force: true });
}

const inside = (file, directory) => file !== undefined && resolve(file).startsWith(directory);

const shims = {
  "@nestjs/common": resolve(workerDir, "shims/nest-common.ts"),
  "@nestjs/core": resolve(workerDir, "shims/nest-core.ts"),
};

const apiSourcePlugin = {
  name: "api-source",
  setup(pluginBuild) {
    pluginBuild.onResolve({ filter: /^@nestjs\/(common|core)$/ }, (args) => ({ path: shims[args.path] }));

    // Prisma workerd client가 동적으로 불러오는 wasm은 Worker 모듈로 함께 올린다.
    pluginBuild.onResolve({ filter: /\.wasm\?module$/ }, (args) => {
      const file = resolve(args.resolveDir, args.path.replace(/\?module$/, ""));
      const name = file.split(/[\\/]/).pop();
      copyFileSync(file, resolve(outDir, name));
      return { path: `./${name}`, external: true };
    });

    pluginBuild.onResolve({ filter: /^\./ }, (args) => {
      if (!inside(args.importer, apiDir)) return undefined;
      const target = resolve(args.resolveDir, args.path);
      const generated = /[\\/]generated[\\/]prisma[\\/](client|enums)\.js$/.exec(target);
      if (generated) return { path: resolve(generatedDir, `prisma/${generated[1]}.ts`) };
      if (/[\\/]auth[\\/]password\.js$/.test(target)) return { path: resolve(workerDir, "shims/password.ts") };
      if (/[\\/]database[\\/]prisma\.service\.js$/.test(target)) {
        return { path: resolve(workerDir, "shims/prisma-service.ts") };
      }
      if (target.endsWith(".js") && existsSync(`${target.slice(0, -3)}.ts`)) {
        return { path: `${target.slice(0, -3)}.ts` };
      }
      return undefined;
    });
  },
};

if (!existsSync(resolve(webDir, "dist/index.html"))) {
  throw new Error("dist가 없습니다. 먼저 vite build를 실행하세요.");
}

generatePrismaClient();
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

await build({
  entryPoints: [resolve(workerDir, "index.ts")],
  outfile: resolve(outDir, "index.js"),
  bundle: true,
  format: "esm",
  platform: "neutral",
  target: "es2023",
  conditions: ["workerd", "worker", "browser", "import", "default"],
  mainFields: ["browser", "module", "main"],
  external: ["node:*", "cloudflare:*"],
  plugins: [apiSourcePlugin],
  minify: true,
  logLevel: "warning",
});

console.log("Worker 번들 완료:", outDir);
