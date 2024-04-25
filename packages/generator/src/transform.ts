import z from "zod";
import { registryItemWithContentSchema } from "./schemas";
import { getLocalRegistryPackageName } from "./template";

export function transformRegistryFile(
  allComponents: string[],
  style: string,
  { registryDependencies = [] }: z.infer<typeof registryItemWithContentSchema>,
  {
    name,
    content,
  }: z.infer<typeof registryItemWithContentSchema>["files"][number]
): z.infer<typeof registryItemWithContentSchema>["files"][number] {
  let transformedContent = content;

  for (const dep of registryDependencies) {
    transformedContent = transformedContent.replace(
      `from "${dep}"`,
      `from "${getLocalRegistryPackageName(dep)}"/${style}/${dep}`
    );
  }

  for (const component of allComponents) {
    transformedContent = transformedContent.replaceAll(
      `from "@/registry/${style}/ui/${component}"`,
      `from "${getLocalRegistryPackageName(component)}/${style}/${component}"`
    );
  }

  transformedContent = transformedContent.replace(
    `from "@/lib/utils"`,
    `from "../lib"`
  );

  transformedContent = transformedContent.replaceAll(
    `@/registry/${style}/ui`,
    "."
  );

  if (!transformedContent.includes(`import * as React from "react"`)) {
    if (transformedContent.includes(`"use client"`)) {
      transformedContent = transformedContent.replace(
        `"use client"`,
        `"use client"\n\nimport * as React from "react"`
      );
    } else {
      transformedContent = `"use client"\n\nimport * as React from "react"\n${transformedContent}`;
    }
  }

  return {
    name: `src/${style}/${name.replace(".ts", ".tsx").replace(".tsxx", ".tsx")}`,
    content: transformedContent,
  };
}
