/**
 * Created by orstavik on 15.03.17.
 */
class Tools {

  static merge1(A, B) {
    if (A === B) return A;
    if (!B) return A;
    if (!A) return B;
    return Object.assign({}, A, B);
  }

  static merge2(A, B) {
    if (A === B) return A;
    if (!B || Object.keys(B).length === 0) return A;
    if (!A || Object.keys(A).length === 0) return B;
    const C = Object.assign({}, A);
    for (let key of Object.keys(B))
      C[key] = Tools.merge1(A[key], B[key]);
    return C;
  }

  static merge(A, B) {
    if (!B) return A;
    if (!A) return B;
    return {
      settings: Tools.merge1(A.settings, B.settings),
      books: Tools.merge2(A.books, B.books)
    };
  }

  // static isEmpty(A) {
  //   return Object.keys(A.settings).length === 0 && Object.keys(A.books).length === 0;
  // }


  //it should remove all branches from A that is already in B
  //todo make it immutable
  //todo make this general and multilevel
  // static filter1Level(A, B) {
  //   for (let key of Object.keys(B)) {
  //     let b = B[key];
  //     let a = A[key];
  //     if (!a || !b)
  //       continue;
  //     for (let s of Object.keys(b)) {
  //       if (JSON.stringify(b[s]) === JSON.stringify(a[s]))
  //         delete a[s];
  //     }
  //   }
  // }

  /**
   * Flattens a normal object tree to an array of {path, value} objects
   * where path is an array of keys as strings. Only works with objects.
   *
   *     let tree = {a: {x: 1}, b: {y: {"12": "something"}}};
   *     let flatTree = Tools.flatten(tree);
   *     //[{path: ["a","x"], value: 1}, {path: ["b","y","12"], value: "something"}]
   *
   * @param object object to be flattened
   * @returns an array of [{path: <array>, value: ?}] for that object
   */
  static flatten(object) {
    const res = []; //mutable
    Tools._flattenImpl(object, [], res);
    return res;
  }

  static _flattenImpl(obj, path, res) {
    if (!(obj instanceof Object)) {
      res.push({path: path, value: obj});
      return;
    }
    for (let key of Object.keys(obj))
      Tools._flattenImpl(obj[key], path.concat([key]), res);
  }

  /**
   * adds a startPath to all keys
   *
   * let flat = {"a/b": 1, c: 2, "xyz/12": 3};
   * let extendedFlat = State.flatToObject("new/root/", flat);
   * extendedFlat == {"new/root/a/b": 1, "new/root/c": 2, "new/root/xyz/12": 3}; //true
   *
   * @param flat an array of a flattened object
   * @param {string} startPath
   * @returns a new object with extended key names.
   */
  static flatToObject(flat, startPath, separator) {
    let result = {};
    for (let pathValue of flat)
      result[startPath + pathValue.path.join(separator)] = pathValue.value;
    return result;
  }

  static setIn(obj, path, value) {
    return Tools._getInImpl(obj, path, 0) === value ? obj : Tools._setInImpl(obj, path, value, 0);
  }

  static _setInImpl(obj, path, value, pos) {
    if (path.length <= pos)
      return value;
    if (!(obj instanceof Object))
      obj = {}; //we overwrite all none object values by default
    const key = path[pos];
    const clone = Object.assign({}, obj);
    clone[key] = Tools._setInImpl(obj[key], path, value, ++pos);
    return clone;
  }

  static getIn(obj, path) {
    return Tools._getInImpl(obj, path, 0);
  }

  static _getInImpl(obj, path, pos) {
    if (path.length <= pos)
      return obj;
    if (!obj)
      return undefined;
    const key = path[pos];
    return Tools._getInImpl(obj[key], path, ++pos);
  }

  /**
   * Immutable filter that strips out
   * 1) entries of A that are matching exactly entries in B
   * 2) all empty entries (with undefined as value).
   *
   * @param {object} A the thing to be filtered
   * @param {object} B the filter
   * @returns A if nothing is filtered away,
   *          undefined if A is empty or the whole content of A is filtered out by B,
   *          a new object C which is an immuted version of the partially filtered A.
   */
  static filterDeep(A, B) {
    if (A === B)
      return undefined;
    if (B === undefined /*|| B === null*/)
      return A;
    if (!(A instanceof Object) || !(B instanceof Object))
      return A;
    if (Object.keys(A).length === 0)
      return undefined;

    const C = {};
    let hasFiltered = false;
    for (let key of Object.keys(A)) {
      const a = A[key];
      const b = B[key];
      let c = Tools.filterDeep(a, b);
      if (c !== a)
        hasFiltered = true;
      if (c !== undefined /*&& c !== null*/)
        C[key] = c;
    }
    if (!hasFiltered)
      return A;
    if (Object.keys(C).length === 0)
      return undefined;
    return C;
  }
}