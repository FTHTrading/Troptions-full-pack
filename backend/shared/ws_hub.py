"""WebSocket hub for DAO real-time updates."""

from __future__ import annotations

import asyncio
import json
from datetime import datetime
from typing import Any, Dict, Set

from fastapi import WebSocket


class WsHub:
    def __init__(self) -> None:
        self._clients: Set[WebSocket] = set()
        self._lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        async with self._lock:
            self._clients.add(websocket)

    async def disconnect(self, websocket: WebSocket) -> None:
        async with self._lock:
            self._clients.discard(websocket)

    async def broadcast(self, event: str, payload: Dict[str, Any]) -> None:
        message = json.dumps({
            "event": event,
            "payload": payload,
            "ts": datetime.utcnow().isoformat(),
        })
        async with self._lock:
            dead: Set[WebSocket] = set()
            for ws in self._clients:
                try:
                    await ws.send_text(message)
                except Exception:
                    dead.add(ws)
            self._clients -= dead


dao_ws_hub = WsHub()
