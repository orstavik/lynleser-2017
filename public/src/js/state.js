class LynleserData {
  constructor(userData, systemBooks, uiChanges) {
    const settings = userData ? userData.settings : {};
    const userBooks = userData ? userData.books : {};
    systemBooks = systemBooks || {};
    uiChanges = uiChanges || {};
    const organized = LynleserData.organizeBooks(systemBooks, userBooks);
    this.userBooks = organized.userBooks;
    this.systemBooks = organized.systemBooks;
    this.settings = Object.assign(LynleserData.defaultSettings(), settings, uiChanges.settings);
  }

  static defaultSettings() {
    return {
      speed: 200,
      wordWidth: 14,
      prefixes: ["the", "an", "a"],
      fontSize: 14,
      fontType: "serif",
      theme: "day"
    };
  }

  static organizeBooks(systemBooks, userBooks) {
    const userBookKeys = Object.keys(userBooks);
    const systemBookKeys = Object.keys(systemBooks);
    const filteredSystemBookKeys = systemBookKeys.filter(systemKey => userBookKeys.indexOf(systemKey));
    return {
      userBooks: userBookKeys.map(key => Object.assign({key: key}, systemBooks[key], userBooks[key])),
      systemBooks: filteredSystemBookKeys.map(key => Object.assign({key: key}, systemBooks[key]))
    };
  }
}

class DataChanges {
  constructor() {
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
