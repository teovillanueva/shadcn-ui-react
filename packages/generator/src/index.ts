import {
  fetchTree,
  getRegistryIndex,
  getRegistryStyles,
  resolveTree,
} from "./registry";
import fs from "fs-extra";
import path from "path";
import { getTemplatePackageFiles } from "./template";

const workspaceRoot = path.resolve(__dirname, "../../..");
const generatedPackagesPath = path.resolve(workspaceRoot, "packages/generated");

async function main() {
  const registryStyles = await getRegistryStyles();
  const registryIndex = await getRegistryIndex();
  const tree = await resolveTree(
    registryIndex,
    registryIndex.map((c) => c.name)
  );

  for (const style of registryStyles) {
    const payload = await fetchTree(style.name, tree);

    for (const component of payload) {
      const files = await getTemplatePackageFiles(
        payload,
        registryStyles.map((s) => s.name),
        style.name,
        component
      );
      for (const file of files) {
        const filePath = path.resolve(
          generatedPackagesPath,
          component.name,
          file.name
        );
        fs.ensureFileSync(filePath);
        fs.writeFileSync(filePath, file.content);
      }
    }
  }
}

main();
