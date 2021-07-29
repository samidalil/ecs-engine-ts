import assert from "./assert";

class Queue<T> {
  constructor(private maxSize: number = Infinity) {}

  private content: T[] = [];

  enqueue = (item: T) => {
    assert(this.content.length < this.maxSize, "Max size reached");

    this.content.push(item);
    return this;
  };

  dequeue = () => {
    assert(this.content.length > 0, "No elements in queue");

    const elem = this.content[0];
    this.content.splice(0, 1);
    return elem;
  };

  top = () => this.content[0];

  get size() {
    return this.content.length;
  }
}

export default Queue;
