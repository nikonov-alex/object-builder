const calc = (func) => (obj) => func(obj);
const value = (value) => (obj) => value;
const update = (obj, key, value) => undefined === obj[key] || obj[key] !== value
    ? Object.assign(Object.assign({}, obj), { [key]: value }) : obj;
const optional = (obj, key, value, callback) => (val => callback(!val ? obj : update(obj, key, val)))(value(obj));
const required = (obj, key, value, callback) => (val => val instanceof Error
    ? val
    : callback(update(obj, key, val)))(value(obj));
export { required, optional, value, calc };
//# sourceMappingURL=index.js.map