export const PACKAGE_NAME_PREFIX = "@teovilla/shadcn-ui-react-";
export const UTILS_PACKAGE_NAME = PACKAGE_NAME_PREFIX + "utils";

export function getPackageName(packageName: string): string {
  return PACKAGE_NAME_PREFIX + packageName;
}
