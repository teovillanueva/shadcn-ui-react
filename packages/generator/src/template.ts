import fs from "fs";
import path from "path";
import type { PackageJson } from "type-fest";
import z from "zod";
import latestVersion from "latest-version";
import o from "outdent";
import { registryItemWithContentSchema } from "./schemas";
import { transformRegistryFile } from "./transform";

const FIXED_DEPENDENCIES = [
  "@radix-ui/react-icons",
  "lucide-react",
  "class-variance-authority",
  "tailwind-merge",
  "clsx",
  ["react", "^18.2.0"],
  ["react-dom", "^18.2.0"],
];

const FIXED_DEV_DEPENDENCIES = [
  ["tailwindcss", "3.4.3"],
  ["tailwindcss-animate", "^1.0.7"],
  ["postcss", "8.4.38"],
  ["autoprefixer", "10.4.19"],
  ["@types/react", "^18.2.61"],
  ["@types/react-dom", "^18.2.19"],
  ["typescript", "^5.3.3"],
];

let packageVersionCache: Record<string, string> = fs.existsSync(
  path.join(__dirname, "../packageVersionCache.json")
)
  ? JSON.parse(
      fs
        .readFileSync(path.join(__dirname, "../packageVersionCache.json"))
        .toString()
    )
  : {};

export function getLocalPackageVersion(name: string) {
  return JSON.parse(
    fs
      .readFileSync(
        path.resolve(__dirname, `../../generated/${name}/package.json`)
      )
      .toString()
  ).version;
}

export function getLocalRegistryPackageName(name: string) {
  return "@teovilla/shadcn-ui-react-" + name;
}

async function getLocalPackageDependencies({
  dependencies = [],
  registryDependencies = [],
}: {
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
}): Promise<{
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}> {
  const deps: Record<string, string> = {};

  for (const dep of [...dependencies, ...FIXED_DEPENDENCIES]) {
    if (Array.isArray(dep)) {
      deps[dep[0] as string] = dep[1]!;
    } else {
      if (dep in packageVersionCache) {
        deps[dep] = packageVersionCache[dep]!;
      } else {
        deps[dep] = await latestVersion(dep);
        packageVersionCache[dep] = deps[dep]!;
        fs.writeFileSync(
          path.join(__dirname, "../packageVersionCache.json"),
          JSON.stringify(packageVersionCache)
        );
      }
    }
  }

  for (const dep of registryDependencies) {
    deps[getLocalRegistryPackageName(dep)] = "workspace:*";
  }

  return {
    dependencies: deps,
    devDependencies: Object.fromEntries(FIXED_DEV_DEPENDENCIES),
  };
}

export async function getTemplatePackageJson(
  allComponents: z.infer<typeof registryItemWithContentSchema>[],
  styles: string[],
  {
    name,
    dependencies,
    registryDependencies,
    files,
  }: z.infer<typeof registryItemWithContentSchema>
) {
  const packageJson: PackageJson = {
    name: getLocalRegistryPackageName(name),
    scripts: {
      build: `tsc && tailwindcss -o styles/${name}.css --minify`,
      "publish-package": "npm version patch && pnpm publish",
    },
    exports: {
      [`./${name}.css`]: `./styles/${name}.css`,
      ...styles.reduce(
        (acc, style) => {
          return {
            ...acc,
            [`./${style}/*`]: `./dist/${style}/*.js`,
            // ...files.reduce((acc, file) => {
            //   return {
            //     ...acc,
            //     [`./${style}/${path.parse(file.name).name}`]: `./src/${style}/${file.name}`,
            //   };
            // }, {}),
          };
        },
        {} as Record<string, any>
      ),
    },
    version: getLocalPackageVersion(name),
    ...(await getLocalPackageDependencies({
      dependencies: [
        ...(dependencies ?? []),
        ...(registryDependencies?.flatMap(
          (dep) => allComponents.find((c) => c.name === dep)?.dependencies ?? []
        ) ?? []),
      ],
      registryDependencies,
    })),
  };

  return JSON.stringify(packageJson, null, 2);
}

export async function getTemplatePackageFiles(
  allComponents: z.infer<typeof registryItemWithContentSchema>[],
  styles: string[],
  currentStyle: string,
  component: z.infer<typeof registryItemWithContentSchema>
): Promise<z.infer<typeof registryItemWithContentSchema>["files"]> {
  return [
    {
      name: "package.json",
      content: await getTemplatePackageJson(allComponents, styles, component),
    },
    {
      name: "tsconfig.json",
      content: o`
        {
          "compilerOptions": {
            "baseUrl": ".",
            "outDir": "./dist",
            "rootDir": "./src",
            "skipLibCheck": true,
            "module": "NodeNext",
            "target": "es5",
            "lib": ["es6", "dom", "es2016", "es2017"],
            "jsx": "react",
            "moduleResolution": "nodenext",
            "allowSyntheticDefaultImports": true,
            "esModuleInterop": true
          },
          "include": ["src/**/*"],
          "exclude": [
            "node_modules",
            "dist"
          ]
        }
      `,
    },
    {
      name: "postcss.config.js",
      content: fs
        .readFileSync(path.resolve(__dirname, "../postcss.config.js"))
        .toString(),
    },
    {
      name: "tailwind.config.js",
      content: fs
        .readFileSync(path.resolve(__dirname, "../tailwind.config.js"))
        .toString(),
    },
    {
      name: "src/lib.ts",
      content: o`
        import { clsx } from "clsx";
        import type { ClassValue } from "clsx";
        import { twMerge } from "tailwind-merge";
        
        export function cn(...inputs: ClassValue[]) {
          return twMerge(clsx(inputs));
        }
      `,
    },
    ...component.files.map((file) =>
      transformRegistryFile(
        allComponents.map((c) => c.name),
        currentStyle,
        component,
        file
      )
    ),
  ];
}
