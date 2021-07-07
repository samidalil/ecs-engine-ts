import assert from "./assert";

class Stack<T> {
  constructor(private maxSize: number = Infinity) {}

  private content: T[] = [];

  push = (item: T) => {
    assert(this.content.length < this.maxSize, "Max size reached");

    this.content.push(item);
    return this;
  };

  pop = () => {
    assert(this.content.length > 0, "No elements in stack");

    return this.content.pop();
  };

  top = () => this.content[this.content.length - 1];

  get size() {
    return this.content.length;
  }
}

export default Stack;
