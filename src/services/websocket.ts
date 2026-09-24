import { SharedFile, ActivityEvent, UserProfile } from '../types';

type EventCallback = (payload: any) => void;

class RealtimeService {
  private ws: WebSocket | null = null;
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private reconnectTimer: any = null;
  private isConnecting: boolean = false;
  private currentUser: UserProfile | null = null;
  public isConnected: boolean = false;
  public onlineCount: number = 1;

  constructor() {
    this.connect();
  }

  public connect() {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.isConnecting = true;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnected = true;
        this.isConnecting = false;
        console.log('[DochGames Real-Time WS] Connected to live distribution network');
        this.emitLocal('connection:change', { connected: true });

        if (this.currentUser) {
          this.registerPresence(this.currentUser);
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const { event: eventName, payload } = data;

          if (eventName === 'init') {
            this.onlineCount = payload.onlineCount || 1;
            this.emitLocal('init', payload);
          } else if (eventName === 'presence:count') {
            this.onlineCount = payload.onlineCount || 1;
            this.emitLocal('presence:count', payload);
          } else {
            this.emitLocal(eventName, payload);
          }
        } catch (err) {
          console.error('[DochGames WS] Failed to parse message', err);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.isConnecting = false;
        this.emitLocal('connection:change', { connected: false });
        this.scheduleReconnect();
      };

      this.ws.onerror = (err) => {
        console.warn('[DochGames WS] Socket error', err);
        this.ws?.close();
      };
    } catch (e) {
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, 3000);
  }

  public registerPresence(user: UserProfile) {
    this.currentUser = user;
    this.send('presence:register', {
      user: {
        name: user.name,
        role: user.role,
        company: user.companyOrStudio
      }
    });
  }

  public shareFile(file: Partial<SharedFile>) {
    this.send('file:upload', { file });
  }

  public addFileComment(fileId: string, author: string, role: string, message: string) {
    this.send('file:comment', {
      fileId,
      comment: { author, role, message }
    });
  }

  public deleteFile(fileId: string, userName: string) {
    this.send('file:delete', { fileId, userName });
  }

  public broadcastNotification(actor: string, role: string, action: string, details: string) {
    this.send('notification:send', { actor, role, action, details });
  }

  private send(event: string, payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ event, payload }));
    }
  }

  public on(event: string, cb: EventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(cb);
    return () => this.off(event, cb);
  }

  public off(event: string, cb: EventCallback) {
    const set = this.listeners.get(event);
    if (set) {
      set.delete(cb);
    }
  }

  private emitLocal(event: string, payload: any) {
    const set = this.listeners.get(event);
    if (set) {
      set.forEach((cb) => {
        try {
          cb(payload);
        } catch (e) {
          console.error(`Error in WS listener for ${event}`, e);
        }
      });
    }
  }
}

export const realtime = new RealtimeService();
