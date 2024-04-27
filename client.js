#!/usr/bin/env bun

// install bun: https://bun.sh/docs/installation
// usage: `bun run client.js`

const ENDPOINT = "http://localhost:5000/getState/abbey";

// get endpoint as json

// poll endpoint every 3 seconds and print
setInterval(async () => {
  const state = await (await fetch(ENDPOINT)).json();
  console.log(state);
}, 3000);
