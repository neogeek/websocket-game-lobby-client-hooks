# websocket-game-lobby-client-hooks

> ⚛️ React hooks for use with websocket-game-lobby

[![NPM Version](http://img.shields.io/npm/v/websocket-game-lobby-client-hooks.svg?style=flat)](https://www.npmjs.org/package/websocket-game-lobby-client-hooks)

## Install

```bash
$ npm install websocket-game-lobby websocket-game-lobby-client-hooks
```

## Usage

```javascript
const { data, connected, send } = useWebSocketGameLobbyClient();
```

```javascript
send('create'); // Create new game
send('join', { gameCode: 'ABCD' }); // Join game with game code
send('leave'); // Leave current game
send('start'); // Start current game
send('end'); // End current game
```
