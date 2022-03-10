export abstract class AbstractEntity<T> {
  constructor(partial: Partial<T>) {
    Object.assign(this, partial);
  }
}
