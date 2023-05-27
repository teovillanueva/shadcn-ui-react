import path from "path";
import fs from "fs-extra";
import { Component } from "./get-components";
import { getPackageDir } from "./get-package-dir";
import { generateComponentPackageJson } from "./generate-component-package-json";
import { generateComponentPackageSrc } from "./generate-component-package-src";

export async function generateComponentPackage(component: Component) {
  const packageDir = await getPackageDir(component.component);

  await fs.ensureDir(packageDir);

  const componentPackageJson = await generateComponentPackageJson(component);

  await fs.writeFile(
    path.join(packageDir, "package.json"),
    JSON.stringify(componentPackageJson, null, 2)
  );

  await fs.writeFile(
    path.join(packageDir, "tsup.config.ts"),
    `
import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  sourcemap: true,
  target: "esnext",
  outDir: "dist",
});
`
  );

  await fs.writeFile(
    path.join(packageDir, "tsconfig.json"),
    `
{
  "compilerOptions": {
    "target": "es2016",
    "lib": ["dom", "ES2015", "ES2021.String"],
    "jsx": "react-jsx",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
`
  );

  await generateComponentPackageSrc(component);

  return { packageJson: componentPackageJson };
}
