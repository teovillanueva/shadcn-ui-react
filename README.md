# @teovilla/shadcn-ui-react

Hey! After the exciting release of [shadcn/ui](https://ui.shadcn.com) here we are! I've created a simple script that automatically generates a npm package for each component to prevent us from having to copy and paste all of the components. Components can be installed one by one or you can install all of them with only one package.

I guess I don't have to say it but of course all of the credits go to [shadcn](https://twitter.com/shadcn) who has designed and developed these beautiful components with Tailwind and Radix UI. Thank you!

## Installing all components

```sh
$ yarn add @teovilla/shadcn-ui-react
$ yarn add tailwindcss-animate -D
```

## Installing a single component

```sh
$ yarn add @teovilla/shadcn-ui-react-accordion
$ yarn add tailwindcss-animate -D
```

Another example would be

```sh
$ yarn add @teovilla/shadcn-ui-react-alert-dialog
$ yarn add tailwindcss-animate -D
```

## Using the components

First you'll need to have installed Tailwindcss into your project. If you are using NextJs you can check out [this guide](https://tailwindcss.com/docs/guides/nextjs). Once you have Tailwindcss installed you can go ahead and change your `tailwind.config.js`

```js
const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@teovilla/shadcn-ui-*/**/*.tsx", // This is crucial for this to work :)
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1360px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

Then you can go ahead and modify your `next.config.js`.

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@teovilla/shadcn-ui-react-lib", // You should always transpile this package.
    // ...the other packages
  ],
  experimental: {
    appDir: true,
    fontLoaders: [
      {
        loader: "@next/font/google",
        options: { subsets: ["latin"] },
      },
    ],
  },
};

module.exports = nextConfig;
```

You'll have to add more packages to the `transpilePackages` property. You can add only the ones you are using but remember always to add the package `@teovilla/shadcn-ui-react-lib`.
Here is a list of all the packages if you want to add them all or pick the ones you want!

- "@teovilla/shadcn-ui-react"
- "@teovilla/shadcn-ui-react-accordion"
- "@teovilla/shadcn-ui-react-lib"
- "@teovilla/shadcn-ui-react-accordion"
- "@teovilla/shadcn-ui-react-alert-dialog"
- "@teovilla/shadcn-ui-react-aspect-ratio"
- "@teovilla/shadcn-ui-react-avatar"
- "@teovilla/shadcn-ui-react-button"
- "@teovilla/shadcn-ui-react-checkbox"
- "@teovilla/shadcn-ui-react-collapsible"
- "@teovilla/shadcn-ui-react-context-menu"
- "@teovilla/shadcn-ui-react-dialog"
- "@teovilla/shadcn-ui-react-dropdown-menu"
- "@teovilla/shadcn-ui-react-hover-card"
- "@teovilla/shadcn-ui-react-input"
- "@teovilla/shadcn-ui-react-label"
- "@teovilla/shadcn-ui-react-menubar"
- "@teovilla/shadcn-ui-react-popover"
- "@teovilla/shadcn-ui-react-progress"
- "@teovilla/shadcn-ui-react-radio-group"
- "@teovilla/shadcn-ui-react-scroll-area"
- "@teovilla/shadcn-ui-react-select"
- "@teovilla/shadcn-ui-react-separator"
- "@teovilla/shadcn-ui-react-slider"
- "@teovilla/shadcn-ui-react-switch"
- "@teovilla/shadcn-ui-react-tabs"
- "@teovilla/shadcn-ui-react-textarea"
- "@teovilla/shadcn-ui-react-tooltip"

## Using the components

Then it's pretty straight forward! You just import the components directly from `@teovilla/shadcn-ui-react` if you installed all of them or if you installed specific packages just import them from their respective package and keep your bundle size as low as possible!

## How does this keep up to date

I've created a [fork](https://github.com/teovillanueva/shadcn-ui-next-fork) of the components and I keep the fork updated with [this workflow](https://github.com/wei/pull). Then whenever there is a change in the fork a workflow is triggered in this repo and the components are generated and published automatically!
