import path from "path";
import { findWorkspaceDir } from "@pnpm/find-workspace-dir";
import { Component } from "./get-components";

export async function getComponentPackageDir(component: Component) {
  const workspaceDir = await findWorkspaceDir(__dirname);

  if (!workspaceDir)
    throw new Error("I don't really know what you are trying to do");

  return path.resolve(workspaceDir, "packages/generated", component.component);
}
