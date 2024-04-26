## Overall Approach

#### Server

- using nodejs/express + htmx probably
- go to scoreboard.kevbot.xyz/abbey
- see an interface to set char, score, etc
- set score / char stuff as desired

#### Desktop Client

- Probably use [bun.js](https://bun.sh/), so this can be a single file
- run some simple client that pulls from the webserver, say every 5 seconds (or be cool and use websockets) or something and writes the p1_char.txt, p2_score.txt, etc to a specified output dir.

## Stuff

- https://github.com/Readek/Melee-Stream-Tool (prior art, but not web-based)
- https://www.start.gg/tournament/melee-abbey-tavern-43/event/melee-singles/set/73770319
- https://developer.start.gg/docs/examples/queries/set-score

## Todo

Server

- [x] make a fake endpoint that serves the spec as json
  - https://serve-gist.kevbot.xyz/?url=https://gist.githubusercontent.com/kleutzinger/8ea57f477ed0b7b91c2657f8cd0c0e1b/raw/8fd0abb62503616ec35eb7abd50c2ca027b42edd/scoreboard.json
- [ ] copy [spec from](https://github.com/Readek/Melee-Stream-Tool/blob/master/Stream Tool/Resources/Texts/ScoreboardInfo.json)
- [ ] Copy over resources from https://github.com/Readek/Melee-Stream-Tool/tree/master/Stream%20Tool/Resources
- [ ] make express server
- [ ] make json endpoint for scoreboard state
- [ ] separate into rooms (?) e.g. /genesis
- [ ] make a way to update the scoreboard
- [ ] websocket for updating client

Desktop Client

- [x] make bun client.js
- [x] make client that reads from the json endpoint above
- [ ] read appropriate resources from Resources/ dir
- [ ] obs instructions
- [ ] evenutally make client/ folder?
- [ ] add windows .bat runfile
