import fetch from "cross-fetch";

async function latestVersion(packageName: string) {
  const response = await fetch(
    "https://registry.npmjs.org/" + packageName + "/latest"
  );
  const data = await response.json();
  return data.version as string;
}

export async function getDependencyLatestVersion(
  dependencyName: string
): Promise<{
  version: string;
  name: string;
}> {
  const version = await latestVersion(dependencyName);

  return { version, name: dependencyName };
}
