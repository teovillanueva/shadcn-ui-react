import path from "path";
import { Component } from "./get-components";
import { PACKAGE_NAME_PREFIX, UTILS_PACKAGE_NAME } from "./get-package-name";

export function preprocessComponent(component: Component) {
  const selfReferences = component.files.map(
    (file) => `${PACKAGE_NAME_PREFIX}${path.parse(file.name).name}`
  );

  component.files.forEach((file) => {
    file.content = file.content.replaceAll(
      "@/components/ui/",
      PACKAGE_NAME_PREFIX
    );
    file.content = file.content.replaceAll("@/lib/utils", UTILS_PACKAGE_NAME);

    if (selfReferences.some((sr) => file.content.includes(sr))) {
      selfReferences.forEach((sr) => {
        file.content = file.content.replaceAll(
          sr,
          `./${sr.replace(PACKAGE_NAME_PREFIX, "")}`
        );
      });
    }
  });

  return component;
}
