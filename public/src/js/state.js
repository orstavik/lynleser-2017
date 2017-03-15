class State {
  constructor(settings, books) {
    this.books = books || {};
    this.settings = settings || {};
  }

  merge(B) {
    if (!B)
      return this;
    return new State(
      Tools.merge1(this.settings, B.settings),
      Tools.merge2(this.books, B.books)
    );
  }

  newSetting(key, value) {
    const clone = new State(Object.assign({}, this.settings), this.books);
    clone.settings[key] = value;
    return clone;
  }

  static removeIdenticalPropertiesFromA(A, B) {
    for (let s of Object.keys(A.settings)) {
      if (JSON.stringify(B.settings[s]) == JSON.stringify(A.settings[s]))
        delete A.settings[s];
    }
    for (let b of Object.keys(A.books)) {
      if (JSON.stringify(B.books[b]) == JSON.stringify(A.books[b]))
        delete A.books[b];
    }
  }

  getActiveBook() {
    return this.settings.activeBook;
  }

  isEmpty() {
    return Object.keys(this.settings).length == 0 && Object.keys(this.books).length == 0;
  }
}