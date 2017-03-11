class State {
  constructor(settings, books) {
    this.books = books || {};
    this.settings = settings || {};
  }

  static merge(A, B) {
    if (!B) return A;
    if (!A) return B;
    return {
      settings: State.merge1(A.settings, B.settings),
      books: State.merge2(A.books, B.books)
    };
  }

  static merge1(A, B) {
    if (!B) return A;
    if (!A) return B;
    return Object.assign({}, A, B);
  }

  static merge2(A, B) {
    if (!B || Object.keys(B).length == 0) return A;
    if (!A || Object.keys(A).length == 0) return B;
    const C = Object.assign({}, A);
    for (let key of Object.keys(B))
      C[key] = State.merge1(A[key], B[key]);
    return C;
  }

  setSetting(key, value) {
    const clone = new State(Object.assign({}, this.settings), this.books);
    clone.settings[key] = value;
    return clone;
  }

  static reduceOverlapping(thiz, A) {
    for (let s of Object.keys(thiz.settings)) {
      if (JSON.stringify(A[s]) == JSON.stringify(thiz.settings[s]))
        delete thiz.settings[s];
    }
    for (let b of Object.keys(thiz.books)) {
      if (JSON.stringify(A[b]) == JSON.stringify(thiz.books[b]))
        delete thiz.books[b];
    }
  }

  static isEmpty(thiz) {
    return Object.keys(thiz.settings).length == 0 && Object.keys(thiz.books).length == 0;
  }
}