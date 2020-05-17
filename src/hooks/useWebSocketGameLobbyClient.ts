import { useEffect, useState } from 'react';

import { useLocalStorage } from '@neogeek/common-react-hooks';

import { WebSocketGameLobbyClient } from 'websocket-game-lobby';

export const useWebSocketGameLobbyClient = ({
    keepAliveMilliseconds = 30000,
    port = process.env.NODE_ENV === 'development' ? 5000 : null,
}: {
    keepAliveMilliseconds?: number;
    port?: number | null;
} = {}) => {
    const [gameLobby, setGameLobby] = useState();

    const [data, setData] = useState({});

    const [playerId, setPlayerId] = useLocalStorage('playerId');
    const [gameCode, setGameCode] = useLocalStorage('gameCode');
    const [gameId, setGameId] = useLocalStorage('gameId');

    const [connected, setConnected] = useState(false);

    const [keepAliveInterval, setKeepAliveInterval] = useState();

    useEffect(() => {
        setGameLobby(
            new WebSocketGameLobbyClient({
                port,
                gameId,
                playerId,
            })
        );
    }, []);

    useEffect(() => {
        setKeepAliveInterval(
            setInterval(() => gameLobby?.send('ping'), keepAliveMilliseconds)
        );

        gameLobby?.addEventListener('open', handleConnect);
        gameLobby?.addEventListener('message', handleMessage);
        gameLobby?.addEventListener('close', handleDisconnect);

        return () => {
            setKeepAliveInterval(clearInterval(keepAliveInterval));

            gameLobby?.removeEventListener('open', handleConnect);
            gameLobby?.removeEventListener('message', handleMessage);
            gameLobby?.removeEventListener('close', handleDisconnect);
        };
    }, [gameLobby]);

    useEffect(() => {
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
