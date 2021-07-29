import WebSocket from "ws";

import EventEmitter from "../utils/EventEmitter";
import SocketClient from "./SocketClient";

class SocketServer {
  constructor(private port = 8080) {
    this.wss = new WebSocket.Server({ port });
    this.setup();
  }

  private clients: SocketClient[] = []
  private eventEmitter = new EventEmitter();
  private id = 0;
  private wss: WebSocket.Server;

  public onConnect = (listener: (arg: SocketClient) => void) => {
    this.eventEmitter.on("connection", listener);
  };

  public on = (event: string, listener: (arg: any) => void) => {
    this.eventEmitter.on(event, listener);
  };

  public emit = (eventName: string, arg: any) => {
    this.clients.forEach((client) => client.emit(eventName, arg));
  }

  private setup = () => {
    this.wss.on("connection", (ws) => {
      const client = new SocketClient(ws);
      client.id = this.id++;

      this.clients.push(client);
      client.on("close", () => {
        const index = this.clients.indexOf(client);
        if (~index) this.clients.splice(index, 1);
      });
      this.eventEmitter.emit("connection", client);
    });

    this.wss.on('listening', () => console.log(`Listening to port ${this.port}`));
  }
}

export default SocketServer;
