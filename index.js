#!/usr/bin/env node

/**
 * @license Copyright 2018 Aleksei Koziatinskii All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
updateNotifier({pkg}).notify({ isGlobal: true });

const program = require('commander');
program
  .version(pkg.version)
  .usage('[options] <webSocketUrl>')
  .option('-t, --type [type]', 'Target type: browser|node|...')
  .option('-p, --port <n>', 'Port to specify on chrome://inspect, default one is 9239', parseInt)
  .parse(process.argv);

if (program.args.length !== 1) program.help();

const webSocketUrl = program.args[0];
const port = program.port || 9239;

const http = require('http');
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (req.url === '/json/version') {
    res.end(JSON.stringify({ Browser: 'InspectWebServer' }));
  } else if (req.url === '/json' || req.url === '/json/list') {
    res.end(JSON.stringify([{
      title: 'target',
      type: program.type || 'page',
      webSocketDebuggerUrl: `ws://localhost:${port}/`
    }]));
  } else if (req.url === '/json/protocol') {
    res.end(JSON.stringify({}));
  } else {
    res.end();
  }
});

const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });
wss.on('connection', (ws, req) => {
  const messages = [];
  let channel = null;
  const backend = new WebSocket(webSocketUrl);
  backend.on('message', message => ws.send(message));
  backend.on('open', () => {
    channel = backend;
    messages.splice(0).forEach(message => backend.send(message));
  });
  backend.on('close', () => ws.close());
  backend.on('error', () => channel = null);
  ws.on('message', message => {
    if (channel) {
      channel.send(message)
    } else {
      messages.push(message);
    }
  });
  ws.on('close', () => channel ? channel.close() : null);
});

console.log(`Starting server on ${port}..`);
console.log('You can go to chrome://inspect now and click inspect next to available target.');
console.log('(port should be added using "Configure.." button first)');
server.listen(program.port || 9239);
