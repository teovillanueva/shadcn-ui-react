import fs from "fs-extra";
import path from "path";
import { PackageJson } from "type-fest";
import { getPackageDir } from "./get-package-dir";

export async function generateRootPackage(
  packages: { packageJson: PackageJson }[]
) {
  const packageDir = await getPackageDir("react");
  const packageJsonPath = path.join(packageDir, "package.json");

  const packageSrcDir = path.join(packageDir, "src");

  const packageIndexPath = path.join(packageDir, "src/index.ts");

  await fs.ensureDir(packageSrcDir);
  await fs.ensureDir(packageDir);

  const dependencies = packages.reduce(
    (acc, { packageJson }) => ({
      ...acc,
      [packageJson.name!]: packageJson.version!,
    }),
    {
      "@teovilla/shadcn-ui-react-utils": "workspace:*",
    }
  );

  const packageJson: PackageJson = {
    name: "@teovilla/shadcn-ui-react",
    scripts: {
      build: "tsup",
    },
    dependencies,
  };

  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

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

  await fs.writeFile(
    packageIndexPath,
    packages
      .map(({ packageJson }) => `export * from "${packageJson.name}"`)
      .join("\n")
  );
}
