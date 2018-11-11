# inspect-web-server
Simple implementation of /json and /json/list endpoints for DevTools protocol clients.

## Install
```bash
npm install -g inspect-web-server
```

## Usage
1. launch app and get `<webSocketUrl>`,
1. run server `inspect-web-server <webSocketUrl>`, e.g., inspect-web-server ws://localhost:8199/
1. open `chrome://inspect` in Google Chrome (after 71),
1. add `9239` port in configure dialog,
1. click inspect next to discovered target.
<img width="411" alt="screen shot 2018-11-10 at 10 54 10 pm" src="https://user-images.githubusercontent.com/426418/48310065-beb27e00-e53b-11e8-9a9e-9b96e4a70564.png">
<img width="221" alt="screen shot 2018-11-10 at 10 56 14 pm" src="https://user-images.githubusercontent.com/426418/48310070-e30e5a80-e53b-11e8-97ff-45f5623cdcb0.png">
