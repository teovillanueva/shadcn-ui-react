import path from "path";
import fs from "fs-extra";
import { PackageJson } from "type-fest";
import { Component } from "./get-components";
import { PACKAGE_NAME_PREFIX, getPackageName } from "./get-package-name";
import { getPackageDir } from "./get-package-dir";
import { getDependencyLatestVersion } from "./get-dependency-latest-version";

const DEFAULT_DEPENDENCIES = {
  "lucide-react": "^0.162.0",
  "class-variance-authority": "^0.5.2",
  "@teovilla/shadcn-ui-react-utils": "workspace:*",
};

// TODO:  Remove once https://github.com/shadcn/ui/pull/462 gets merged
const dependencyOverrides = {
  "@teovilla/shadcn-ui-react-command": {
    "@radix-ui/react-dialog": "1.0.4",
  },
};

export async function generateComponentPackageJson(
  component: Component
): Promise<PackageJson> {
  let version = "0.0.1";

  try {
    const packageJsonPath = path.join(
      await getPackageDir(component.component),
      "package.json"
    );

    const prevPackageJson = JSON.parse(
      fs.readFileSync(packageJsonPath).toString("utf-8")
    ) as PackageJson;

    if (prevPackageJson.version) {
      version = prevPackageJson.version;
    }
  } catch (error) {}

  const dependenciesVersions = await Promise.all(
    (component.dependencies || [])?.map((dep) =>
      getDependencyLatestVersion(dep)
    )
  );

  const dependencies =
    component.dependencies?.reduce(
      (acc, dep) => ({
        ...acc,
        [dep]: dependenciesVersions.find((d) => d.name === dep)?.version,
      }),
      DEFAULT_DEPENDENCIES
    ) || DEFAULT_DEPENDENCIES;

  component.files.forEach((file) => {
    const matches = file.content.match(
      /import {[^}]*}.*(?="@teovilla\/shadcn-ui-react-(.*?)").*/g
    );

    matches?.forEach((match) => {
      if (match.includes(`${PACKAGE_NAME_PREFIX}utils`)) return;

      match.match(/"(.*?)"/)?.forEach((p) => {
        dependencies[p.replaceAll('"', "") as keyof typeof dependencies] =
          "workspace:*";
      });
    });
  });

  const packageName = getPackageName(component.component);

  return {
    name: packageName,
    version,
    peerDependencies: {
      react: "*",
    },
    dependencies: {
      ...dependencies,
      ...(dependencyOverrides[
        packageName as keyof typeof dependencyOverrides
      ] || {}),
    },
    main: "dist/index.js",
    module: "dist/index.mjs",
    types: "dist/index.d.ts",
    source: "src/index.ts",
    publishConfig: {
      registry: "https://registry.npmjs.org/",
      access: "public",
    },
    devDependencies: {
      "@types/react": "18.0.37",
    },
    scripts: {
      build: "tsup",
    },
    repository: "https://github.com/teovillanueva/shadcn-ui-react",
    author:
      "Teodoro Villanueva <teodoro2102@gmail.com> (https://github.com/teovillanueva)",
    bugs: {
      url: "https://github.com/teovillanueva/shadcn-ui-react/issues",
    },
    homepage: "https://github.com/teovillanueva/shadcn-ui-react#readme",
  };
}
