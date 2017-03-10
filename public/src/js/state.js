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
    if (!A && !B) return;
    if (!B) return A;
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

class FullState {
  constructor(state, serverBooks) {
    if (!state)
      return;
    this.books = state.books;
    this.settings = state.settings;
    //1. merge activeBook
    let active = this.settings.activeBook ? this.settings.activeBook.key : undefined;
    if (active && !this.settings.activeBook.body)
      this.settings.activeBook = Object.assign({}, this.books[active], serverBooks[active]);
  }
}

class RawUIData {
  constructor() {
    this.books = {};
    this.settings = {};
  }

  addSetting(change) {
    let res = new RawUIData();
    res.books = this.books;
    res.settings = Object.assign({}, this.settings);
    res.settings[change.key] = change.value;
    return res;
  }
}

class UIData {
  constructor(uiDataRaw, serverData) {
    this.books = {};
    this.settings = {};
    this.empty = true;
    //1. add only settings that differ from those in the server data
    for (let s of Object.keys(uiDataRaw.settings)) {
      if (uiDataRaw.settings[s] != serverData.settings[s]) {
        this.settings[s] = uiDataRaw.settings[s];
        this.empty = false;
      }
    }
    //2. add only book data that differ from those in the server data
    for (let b of Object.keys(uiDataRaw.books)) {
      if (uiDataRaw.books[b] == serverData.books[b]) {
        this.books[b] = Object.assign({}, uiDataRaw[b]);
        this.empty = false;
      }
    }
  }
}

class ServerBooks {
  set(book) {
    const res = Object.assign(new ServerBooks(), this);
    res[book.key] = book;
    return res;
  }
}