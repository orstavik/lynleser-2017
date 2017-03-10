class DefaultSettings {
  constructor() {
    this.speed = 200;
    this.wordWidth = 14;
    this.prefixes = ["the", "an", "a"];
    this.fontSize = 14;
    this.fontType = "serif";
    this.theme = "day";
  }
}

class GenericUser {
  constructor(defaultSettings, serverSystemBooks) {
    this.settings = defaultSettings;
    this.books = serverSystemBooks || {};
  }
}

class SpecificUser {
  constructor(generic, specific) {
    //1. merge booklists
    let userBooks = (specific && specific.books) ? specific.books : {};
    this.books = {};
    for (let key of Object.keys(generic.books))
      this.books[key] = Object.assign({}, generic.books[key], userBooks[key]);
    //2. merge settings
    let userSettings = (specific && specific.settings) ? specific.settings : {};
    this.settings = Object.assign({}, generic.settings, userSettings);
  }
}

class PartialState {
  constructor(specific, ui) {
    //1. merge settings
    this.settings = Object.assign({}, specific.settings, ui.settings);
    //2. merge bookList
    this.books = Object.assign({}, specific.books);                   //ATT!! immutable problem in many layers
    for (let key of Object.keys(ui.books))
      this.books[key] = Object.assign({}, specific.books[key], ui.books[key]);
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
    if (active)
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
  set(book){
    const res = Object.assign(new ServerBooks(), this);
    res[book.key] = book;
    return res;
  }
}