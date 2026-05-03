"use client";

class SwarmSocket {
  private ws: WebSocket | null = null;
  private listeners: ((data: any) => void)[] = [];

  connect() {
    this.ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.listeners.forEach((fn) => fn(data));
    };
    this.ws.onerror = (err) => console.error("WS error", err);
    this.ws.onclose = () => {
      console.log("WS closed – reconnecting in 3s");
      setTimeout(() => this.connect(), 3000);
    };
  }

  onMessage(fn: (data: any) => void) {
    this.listeners.push(fn);
    if (!this.ws) this.connect();
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }
}

export const socket = new SwarmSocket();