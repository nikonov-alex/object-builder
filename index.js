const calc = (func) => (obj) => func(obj);
const value = (value) => (obj) => value;
const update = (obj, key, value, callback) => callback(undefined === obj[key] || obj[key] !== value
    ? Object.assign(Object.assign({}, obj), { [key]: value }) : obj);
const optional = (obj, key, value, callback) => (val => !val
    ? callback(obj)
    : update(obj, key, val, callback))(value(obj));
const required = (obj, key, value, callback) => (val => val instanceof Error
    ? val
    : update(obj, key, val, callback))(value(obj));
export { update, required, optional, value, calc };
//# sourceMappingURL=index.js.map