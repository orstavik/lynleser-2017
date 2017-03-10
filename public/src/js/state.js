class State {
  constructor() {
    this.books = {};
    this.settings = {
      speed: 200,
      wordWidth: 14,
      prefixes: ["the", "an", "a"],
      fontSize: 14,
      fontType: "serif",
      theme: "day"
    };
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
}

class MutableState {
  constructor() {
    this.books = {};
    this.settings = {};
  }

  reduceOverlapping(A) {
    for (let s of Object.keys(this.settings)) {
      if (JSON.stringify(A[s]) == JSON.stringify(this.settings[s]))
        delete this.settings[s];
    }
    for (let b of Object.keys(this.books)) {
      if (JSON.stringify(A[b]) == JSON.stringify(this.books[b]))
        delete this.books[b];
    }
  }

  isEmpty() {
    return Object.keys(this.settings).length == 0 && Object.keys(this.books).length == 0;
  }

  addSetting(key, value){
    this.settings[key] = value;
  }
}

class ServerBooks {
  set(book) {
    const res = Object.assign(new ServerBooks(), this);
    res[book.key] = book;
    return res;
  }
}