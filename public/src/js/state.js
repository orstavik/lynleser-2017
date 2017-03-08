class LynleserServerData {

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

  static make(userData, systemBooks, bookData) {
    let res = new LynleserServerData();
    if (userData){
      res.settings = Object.assign(res.settings, userData.settings);
      res.books = Object.assign(res.books, userData.books);
      if (userData.books.prefixes)
        res.books.prefixes = userData.books.prefixes.slice();
    }
    if (systemBooks){
      for (let key of Object.keys(systemBooks)){
        res.books[key] = Object.assign({}, res.books[key], systemBooks[key]);
        if (bookData && bookData[key])
          res.books[key].body = bookData[key].body;
      }
    }
    return res;
  }
}

class LynleserData {
  constructor(serverData, uiChanges) {
    this.settings = serverData.settings;
    this.books = serverData.books;
    if (!uiChanges)
      return;
    if (uiChanges.books) {
      for (let key of Object.keys(uiChanges.books))
        this.books[key] = Object.assign({}, this.books[key], uiChanges.books[key]);
    }
    if (uiChanges.settings)
      this.settings = Object.assign({}, this.settings, uiChanges.settings);
  }
}

class LynleserUIData {
  constructor() {
    this.books = {};
    this.settings = {};
  }

  addSetting(change) {
    this.settings[change.key] = change.value;
  }

  clearRedundant(serverData) {
    let empty = true;
    for (let s of Object.keys(this.settings)) {
      if (this.settings[s] == serverData.settings[s])
        delete this.settings[s];
      else
        empty = false;
    }
    return empty;
  }
}
