## Overall Approach

#### Stack

- Node + express for the Server
- Vue.js + socket.io for the webapp
- bun.js for the desktop client

#### Server / Webapp

- This is the thing that will serve the scoreboard state / and scoreboard editing frontend
- using nodejs/express + htmx probably
- go to [scoreboard.kevbot.xyz/abbey](https://scoreboard.kevbot.xyz/abbey)
- see an interface to set char, score, etc
- set score / char stuff as desired

#### Desktop Client

- This is the thing that will read the site and write the files for obs to ingest
- Probably use [bun.js](https://bun.sh/), so this can be a single file
- run some simple client that pulls from the webserver, say every 5 seconds (or be cool and use websockets) or something and writes the p1_char.txt, p2_score.txt, etc to a specified output dir.
- currently polls, may eventually use websockets

## Stuff

- https://github.com/Readek/Melee-Stream-Tool (prior art, but not web-based)
- https://www.start.gg/tournament/melee-abbey-tavern-43/event/melee-singles/set/73770319
- https://developer.start.gg/docs/examples/queries/set-score

## Todo

Server / Webapp

- [x] make a fake endpoint that serves the spec as json
  - https://serve-gist.kevbot.xyz/?url=https://gist.githubusercontent.com/kleutzinger/8ea57f477ed0b7b91c2657f8cd0c0e1b/raw/8fd0abb62503616ec35eb7abd50c2ca027b42edd/scoreboard.json
- [x] copy [spec from](https://github.com/Readek/Melee-Stream-Tool/blob/master/Stream%20Tool/Resources/Texts/ScoreboardInfo.json)
- [ ] Copy over resources from https://github.com/Readek/Melee-Stream-Tool/tree/master/Stream%20Tool/Resources
- [x] make express server
- [x]? how to store state? maybe just in memory for now
- [x] make json endpoint for scoreboard state
- [x] separate into rooms (?) e.g. /924, /abbey, or maybe tied to a twitch channel?? (e.g. /sfmelee)
- [x] make a way to update the scoreboard
- [x] websocket for updating client
- [ ] watch a given twitch stream chat for `!score 1 2` commands (maybe check for moderator status at first)
- [ ] maybe add more !commands later (!p1tag !p2tag !round at least)

Desktop Client

- [x] make bun client.js
- [x] make client that reads from the json endpoint above
- [x] make client poll the endpoint every x seconds
- [ ] read appropriate resources from Resources/ dir
- [ ] obs instructions
- [ ] evenutally make client/ folder?
- [ ] add windows .bat runfile
- [ ] add --output-dir flag to specify output dir (default to $cwd/output)

Other

- [x] make demo
