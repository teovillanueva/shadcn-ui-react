import fetch from "cross-fetch";
import * as z from "zod";
import { preprocessComponent } from "./preprocess-component";

export type Component = z.infer<typeof componentSchema>;

const baseUrl = process.env.COMPONENTS_BASE_URL ?? "https://ui.shadcn.com";

const componentSchema = z.object({
  component: z.string(),
  name: z.string(),
  dependencies: z.array(z.string()).optional(),
  files: z.array(
    z.object({
      name: z.string(),
      dir: z.string(),
      content: z.string(),
    })
  ),
});

export async function getComponents() {
  try {
    const response = await fetch(`${baseUrl}/api/components`);
    const components = await response.json();

    return z.array(componentSchema).parse(components).map(preprocessComponent);
  } catch (error) {
    throw new Error(
      `Failed to fetch components from ${baseUrl}/api/components.`
    );
  }
}
