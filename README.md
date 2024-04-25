# shadcn/ui components for React

## Installation

```sh
pnpm add @teovilla/shadcn-ui-react-button
```

To install any other component you just follow this pattern: `@teovilla/shadcn-ui-react-{component}`

## Setup

You first need to setup your shadcn theme with the following css file

```css
/* app/globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 47.4% 11.2%;

    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 222.2 47.4% 11.2%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 47.4% 11.2%;

    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;

    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;

    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;

    --destructive: 0 100% 50%;
    --destructive-foreground: 210 40% 98%;

    --ring: 215 20.2% 65.1%;

    --radius: 0.5rem;
  }

  .dark {
    --background: 224 71% 4%;
    --foreground: 213 31% 91%;

    --muted: 223 47% 11%;
    --muted-foreground: 215.4 16.3% 56.9%;

    --accent: 216 34% 17%;
    --accent-foreground: 210 40% 98%;

    --popover: 224 71% 4%;
    --popover-foreground: 215 20.2% 65.1%;

    --border: 216 34% 17%;
    --input: 216 34% 17%;

    --card: 224 71% 4%;
    --card-foreground: 213 31% 91%;

    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 1.2%;

    --secondary: 222.2 47.4% 11.2%;
    --secondary-foreground: 210 40% 98%;

    --destructive: 0 63% 31%;
    --destructive-foreground: 210 40% 98%;

    --ring: 216 34% 17%;

    --radius: 0.5rem;
  }
}
```

## Usage

There are two ways you can bring the generated css into your projects

### CSS Imports

```css
/* app/globals.css */
@import "../node_modules/@teovilla/shadcn-ui-react-button/styles/button.css";

/* ... */
```

Or

### JS Import

```tsx
import "@teovilla/shadcn-ui-react-button/button.css";

import { Button } from "@teovilla/shadcn-ui-react-button/new-york/button";

export default function Page() {
  return <Button>Button</Button>;
}
```

To change between the different shadcn-styles you just change the import of the components

```tsx
// import { Button } from "@teovilla/shadcn-ui-react-button/new-york/button";
// import { Button } from "@teovilla/shadcn-ui-react-button/default/button";
```
