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

  //todo this should be made immutable.
  filterUnionBranches(B) {
    return Tools.filter1Level(A,B);
  }

  getActiveBook() {
    return this.settings.activeBook;
  }

  isEmpty() {
    return Object.keys(this.settings).length == 0 && Object.keys(this.books).length == 0;
  }
}