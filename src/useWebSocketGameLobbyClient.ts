import { useEffect, useState } from 'react';

import { useLocalStorage } from '@neogeek/common-react-hooks';

import { WebSocketGameLobbyClient } from 'websocket-game-lobby-client';

export const useWebSocketGameLobbyClient = ({
    port = 80,
    keepAliveMilliseconds = 30000,
}: {
    port?: number;
    keepAliveMilliseconds?: number;
} = {}): {
    data: any;
    gameId: string;
    gameCode: string;
    playerId: string;
    connected: boolean;
    send: (type: string, data: any) => void;
} => {
    const [gameLobby, setGameLobby] = useState();

    const [data, setData] = useState(null);

    const [gameId, setGameId] = useLocalStorage('gameId');
    const [gameCode, setGameCode] = useLocalStorage('gameCode');
    const [playerId, setPlayerId] = useLocalStorage('playerId');

    const [connected, setConnected] = useState(false);

    useEffect(() => {
        setGameLobby(
            new WebSocketGameLobbyClient({
                port,
                gameId,
                playerId,
                keepAliveMilliseconds,
            })
        );
    }, []);

    useEffect(() => {
        gameLobby?.addEventListener('open', handleConnect);
        gameLobby?.addEventListener('message', handleMessage);
        gameLobby?.addEventListener('close', handleDisconnect);

        return () => {
            gameLobby?.removeEventListener('open', handleConnect);
            gameLobby?.removeEventListener('message', handleMessage);
            gameLobby?.removeEventListener('close', handleDisconnect);
        };
    }, [gameLobby]);

    useEffect(() => {
        if (!data) {
            return;
        }

        setGameId(data.game?.gameId);
        setGameCode(data.game?.gameCode);
        setPlayerId(data.player?.playerId || data.spectator?.spectatorId);
    }, [data]);

    const handleConnect = () => setConnected(true);
    const handleMessage = (message: any) => setData(JSON.parse(message.data));
    const handleDisconnect = () => setConnected(false);

    const send = (type: string, options = {}) =>
        gameLobby.send(type, {
            gameId,
            gameCode,
            playerId,
            ...options,
        });

    return { data, gameId, gameCode, playerId, connected, send };
};
