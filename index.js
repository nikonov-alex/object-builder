const calc = (func) => (obj) => func(obj);
const value = (value) => (obj) => value;
const update = (obj, key, value, callback) => callback((val => undefined === obj[key] || obj[key] !== val
    ? Object.assign(Object.assign({}, obj), { [key]: val }) : obj)(value(obj)));
const optional = (obj, key, val, callback) => (v => !v
    ? callback(obj)
    : update(obj, key, value(v), callback))(val(obj));
const required = (obj, key, val, callback) => (v => v instanceof Error
    ? v
    : update(obj, key, value(v), callback))(val(obj));
export { update, required, optional, value, calc };
//# sourceMappingURL=index.js.map