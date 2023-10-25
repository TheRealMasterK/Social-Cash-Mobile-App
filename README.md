# Project Name

Banter Bubbles Native

## Project Description

React Native project built with Expo.

## Installation

`yarn install`

## Run

`yarn start`

Run with clean cache
`yarn start --clear`

## Adding a library

By installing libs via expo, you can ensure that the library is compatible with the expo environment.

`npx expo install <library>`

## Building

This will create a build on the expo servers. We are currently setup to auto increment build number but not version number. You can manually set the version number in the app.json file.

`eas build`

## Building internal testing APK

`eas build -p android --Settings preview`

## Release Build

`eas submit --platform ios` or `eas submit --platform android`

## Web Build

Builds to the web directory.
`npx expo export --platform web`

Test build locally
`npx serve dist`

Host with netlify
`netlify deploy --dir dist`

## NativeWind

Followed steps from: https://www.nativewind.dev/guides/cli-native#native

Regenerate nativewind-output.js:
`npx tailwindcss -i nativewind-input.css --postcss postcss.config.js`

## Packages Notes

Hard version of "tailwindcss": "3.3.2", as 3.3.3 has a bug with expo. Date 2023-10-11.
