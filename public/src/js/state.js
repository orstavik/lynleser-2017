class State {
  constructor(settings, books) {
    this.books = books || {};
    this.settings = settings || {};
    this.activeBook = this.settings.activeBook ? this.books[this.settings.activeBook] : undefined;
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

  isEmpty() {
    return Object.keys(this.settings).length === 0 && Object.keys(this.books).length === 0;
  }

  nextBookPosition() {
    if (!this.activeBook)
      return undefined;
    const res = new State();
    const activeInList = res.books[this.settings.activeBook] = {};
    activeInList.position = (this.activeBook.position || 0) + 1;
    return res;
  }

  newSettingRes(key, value) {
    const res = new State();
    res.settings[key] = value;
    return res;
  }
}