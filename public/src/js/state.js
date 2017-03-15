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
    return Tools.filter1Level(this, B);
  }

  //ATT!! mutable
  //this is like a custom post constructor
  prepare() {
    if (this.settings.activeBook)
      this.activeBook = this.books[this.settings.activeBook];
  }

  isEmpty() {
    return Object.keys(this.settings).length == 0 && Object.keys(this.books).length == 0;
  }
}