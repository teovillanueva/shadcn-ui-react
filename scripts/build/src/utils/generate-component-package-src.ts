import path from "path";
import fs from "fs-extra";
import { Component } from "./get-components";
import { getComponentPackageDir } from "./get-component-package-dir";

export async function generateComponentPackageSrc(
  component: Component
): Promise<void> {
  const packageSrcDir = path.join(
    await getComponentPackageDir(component),
    "src"
  );

  const packageIndexPath = path.join(
    await getComponentPackageDir(component),
    "src/index.ts"
  );

  await fs.ensureDir(packageSrcDir);

  await fs.writeFile(
    packageIndexPath,
    component.files
      .map((f) => `export * from "./${path.parse(f.name).name}"`)
      .join("\n")
  );

  await Promise.all(
    component.files.map((file) =>
      fs.writeFile(path.join(packageSrcDir, file.name), file.content)
    )
  );
}
