#!/usr/bin/env bun

// install bun: https://bun.sh/docs/installation
// usage: `bun run client.js`

const ENDPOINT =
  "https://serve-gist.kevbot.xyz/?url=https://gist.githubusercontent.com/kleutzinger/8ea57f477ed0b7b91c2657f8cd0c0e1b/raw/8fd0abb62503616ec35eb7abd50c2ca027b42edd/scoreboard.json";

// get endpoint as json

const state = await (await fetch(ENDPOINT)).json();
console.log(state);
