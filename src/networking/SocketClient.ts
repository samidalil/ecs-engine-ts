import WebSocket from "ws";

import EventEmitter from "../utils/EventEmitter";

class SocketClient {
  constructor(private ws: WebSocket) {
    this.setup();
  }

  public id = 0;
  
  private eventEmitter = new EventEmitter();

  public emit = (eventName: string, arg: any) => {
    this.ws.send(JSON.stringify({ eventName, arg }));
  };

  public on = (event: string, listener: (arg: any) => void) => {
    this.eventEmitter.on(event, listener);
  };

  private setup = () => {
    this.ws.on('message', (data) => {
      const { eventName, arg } = JSON.parse(data as string);
      this.eventEmitter.emit(eventName, arg);
    });
  };
}

export default SocketClient;
