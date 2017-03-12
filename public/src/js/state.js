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

  static newSetting(thiz, key, value) {
    const clone = new State(Object.assign({}, thiz.settings), thiz.books);
    clone.settings[key] = value;
    return clone;
  }

  static removeIdenticalPropertiesFromA(A, B) {
    for (let s of Object.keys(A.settings)) {
      if (JSON.stringify(B[s]) == JSON.stringify(A.settings[s]))
        delete A.settings[s];
    }
    for (let b of Object.keys(A.books)) {
      if (JSON.stringify(B[b]) == JSON.stringify(A.books[b]))
        delete A.books[b];
    }
  }

  static getActiveBook(state){
    return state && state.settings && state.settings.activeBook ? state.settings.activeBook : undefined;
  }

  static isEmpty(thiz) {
    return !thiz || (Object.keys(thiz.settings).length == 0 && Object.keys(thiz.books).length == 0);
  }
}