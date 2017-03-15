class State {
  constructor(settings, books) {
    this.books = books || {};
    this.settings = settings || {};
  }

  static merge(A, B) {
    if (!B) return A;
    if (!A) return B;
    return {
      settings: Tools.merge1(A.settings, B.settings),
      books: Tools.merge2(A.books, B.books)
    };
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
    return !A || (Object.keys(A.settings).length == 0 && Object.keys(A.books).length == 0);
  }
}