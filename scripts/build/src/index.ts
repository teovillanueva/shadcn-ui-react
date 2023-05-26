import { generateComponentPackage } from "./utils/generate-component-package";
import { getComponents } from "./utils/get-components";

async function run() {
  const components = await getComponents();

  await Promise.all(components.map((c) => generateComponentPackage(c)));
}

run();
