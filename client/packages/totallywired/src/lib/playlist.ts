export type PlaylistItem<V> = V & { i: number; id: string; ta: Date };

type DataStore<V> = { [k: string]: PlaylistItem<V> };

export class PlaylistManager<V> {
  _sequence: string[] = [];
  _store: DataStore<V> = {};

  count() {
    return this._sequence.length;
  }

  addItem(obj: V): PlaylistItem<V> {
    const i = this._sequence.length;
    const ta = new Date();
    const id = `${ta.getTime()}-${i}`;
    const item = { ...obj, i, id, ta };
    this._sequence.push(id);
    this._store[id] = item;
    return item;
  }

  insertItem(index: number, obj: V): PlaylistItem<V> {
    const ta = new Date();
    const id = `${ta.getTime()}-${index}`;
    const item = { ...obj, i: index, id, ta };
    this._sequence.splice(index, 0, id);
    this._store[id] = item;
    return item;
  }

  getById(id: string) {
    return this._store[id];
  }

  getByIndex(index: number): V {
    const id = this._sequence[index];
    return this._store[id];
  }

  getNextById(id: string) {
    const item = this.getById(id);
    if (!item) {
      return;
    }

    const nextId = this._sequence[item.i + 1];
    if (!nextId) {
      return;
    }

    return this._store[nextId];
  }

  getId(index: number) {
    return this._sequence[index];
  }

  getIndex(id: string) {
    return this._store[id].i;
  }

  moveTo(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) {
      return;
    }

    const sequence = this._sequence;
    const store = this._store;

    const fromId = sequence[fromIndex];
    const from = store[fromId];

    if (fromIndex < toIndex) {
      const moving = sequence.splice(fromIndex + 1, toIndex - fromIndex);
      sequence.splice(fromIndex, 0, ...moving);

      for (const id of moving) {
        const item = store[id];
        item.i -= 1;
      }
    } else {
      const moving = sequence.splice(toIndex, fromIndex - toIndex);
      sequence.splice(toIndex + 1, 0, ...moving);

      for (const id of moving) {
        const item = store[id];
        item.i += 1;
      }
    }

    from.i = toIndex;
  }

  removeRange(fromIndex: number, toIndex: number) {
    if (fromIndex >= toIndex) {
      return 0;
    }

    const removed = this._sequence.splice(fromIndex, toIndex - fromIndex);
    for (const id of removed) {
      delete this._store[id];
    }
    return removed.length;
  }

  getItems() {
    const store = this._store;
    return this._sequence.map((id) => store[id]);
  }

  getItemCount() {
    return this._sequence.length;
  }
}
