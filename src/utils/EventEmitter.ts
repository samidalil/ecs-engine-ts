export type Listener = (...args: any[]) => any;

export type ListenerObject = Record<string, Listener[]>;

class EventEmitter {
  private listeners: ListenerObject = {};

  on = (event: string, listener: Listener) => {
    if (!(event in this.listeners)) this.listeners[event] = [];
    this.listeners[event].push(listener);
  };

  off = (event: string, listener: Listener) => {
    if (event in this.listeners) {
      const index = this.listeners[event].indexOf(listener);
      if (~index) this.listeners[event].splice(index, 1);
    }
  };

  emit = (event: string, ...args: any[]) => {
    if (!(event in this.listeners)) return;
    this.listeners[event].forEach((listener) => listener(...args));
  };
}

export default EventEmitter;
