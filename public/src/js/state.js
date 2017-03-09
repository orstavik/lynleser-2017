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

class SystemUser {
  constructor(defaultSettings, serverSystemBooks) {
    this.settings = defaultSettings;
    this.books = serverSystemBooks || {};
  }
}

class UserData {
  constructor(systemUser, user) {
    //1. merge booklists
    let userBooks = (user && user.books) ? user.books : {};
    this.books = {};
    for (let key of Object.keys(systemUser.books))
      this.books[key] = Object.assign({}, systemUser.books[key], userBooks[key]);
    //2. merge settings
    let userSettings = (user && user.settings) ? user.settings : {};
    this.settings = Object.assign({}, systemUser.settings, userSettings);
  }
}

class PartialState {
  constructor(server, ui) {
    //1. merge settings
    this.settings = Object.assign({}, server.settings, ui.settings);
    //2. merge bookList
    this.books = Object.assign({}, server.books);                   //ATT!! immutable problem in many layers
    for (let key of Object.keys(ui.books))
      this.books[key] = Object.assign({}, server.books[key], ui.books[key]);
  }
}

class FullState {
  constructor(state, serverBooks) {
    this.books = state.books;
    this.settings = state.settings;
    this.bookData = serverBooks;
    //1. merge activeBook
    let active = this.settings.activeBook ? this.settings.activeBook.key : undefined;
    if (active)
      this.settings.activeBook = Object.assign({}, this.books[active], this.bookData[active]);
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

//
//
// class LynleserServerData {
//
//   static defaultServerUser() {
//     return {
//       books: {},
//       settings: {
//         speed: 200,
//         wordWidth: 14,
//         prefixes: ["the", "an", "a"],
//         fontSize: 14,
//         fontType: "serif",
//         theme: "day"
//       }
//     };
//   }
//
//
//   static make(userData, systemBooks) {
//     let res = new LynleserServerData();
//     if (userData) {
//       res.settings = Object.assign(res.settings, userData.settings);
//       res.books = Object.assign(res.books, userData.books);
//       if (userData.books.prefixes)
//         res.books.prefixes = userData.books.prefixes.slice();
//     }
//     if (systemBooks) {
//       for (let key of Object.keys(systemBooks)) {
//         res.books[key] = Object.assign({}, res.books[key], systemBooks[key]);
//         // if (bookData && bookData[key])
//         //   res.books[key].body = bookData[key].body;
//       }
//     }
//     return res;
//   }
// }
//
// class LynleserServerDataWithBooks {
//   constructor(serverData, bookData) {
//     this.settings = serverData.settings;
//     this.books = serverData.books;
//     this.bookData = bookData;
//   }
// }
//
// class LynleserData {
//   constructor(serverData, uiChanges) {
//     this.settings = serverData.settings;
//     this.books = serverData.books;
//     this.bookData = serverData.bookData;
//     if (!uiChanges)
//       return;
//     if (uiChanges.books) {
//       for (let key of Object.keys(uiChanges.books))
//         this.books[key] = Object.assign({}, this.books[key], uiChanges.books[key]);
//     }
//     if (uiChanges.settings)
//       this.settings = Object.assign({}, this.settings, uiChanges.settings);
//   }
//
//   getActiveBook() {
//     if (!this.setting)
//       return null;
//     const key = this.settings.activeBook;
//     if (!key)
//       return null;
//     const bookInfo = this.books[key];
//     if (!this.bookData || !this.bookData[key])
//       return bookInfo;
//     return Object.assign({}, bookInfo, this.bookData[key]);
//   }
// }
//
// class UIData {
//   constructor() {
//     this.books = {};
//     this.settings = {};
//   }
//
//   addSetting(change) {
//     this.settings[change.key] = change.value;
//   }
//
//   clearRedundant(serverData) {
//     let empty = true;
//     for (let s of Object.keys(this.settings)) {
//       if (this.settings[s] == serverData.settings[s])
//         delete this.settings[s];
//       else
//         empty = false;
//     }
//     return empty;
//   }
// }