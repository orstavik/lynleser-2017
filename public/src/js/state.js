class State {
  constructor(settings, books) {
    this.books = books || {};
    this.settings = settings || {};
  }

  static merge(A, B) {
    if (State.isEmpty(B)) return A;
    if (State.isEmpty(A)) return B;
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
    if (!B || !Object.keys(B).length) return A;
    if (!A || !Object.keys(A).length) return B;
    const C = Object.assign({}, A);
    for (let key of Object.keys(B))
      C[key] = State.merge1(A[key], B[key]);
    return C;
  }

  static newSetting(A, key, value) {
    const clone = new State(Object.assign({}, A.settings), A.books);
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

  static getActiveBook(state) {
    return state && state.settings && state.settings.activeBook ? state.settings.activeBook : undefined;
  }

  static isEmpty(A) {
    return !A || !Object.keys(A).length || (!Object.keys(A.settings).length && !Object.keys(A.books).length);
  }
}