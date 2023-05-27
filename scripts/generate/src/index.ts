import { generateComponentPackage } from "./utils/generate-component-package";
import { generateRootPackage } from "./utils/generate-root-package";
import { getComponents } from "./utils/get-components";

async function run() {
  const components = await getComponents();

  const packages = await Promise.all(
    components.map((c) => generateComponentPackage(c))
  );

  await generateRootPackage(packages);
}

run();
