const calc = (func) => (obj) => func(obj);
const value = (value) => (obj) => value;
const update = (obj, key, value) => undefined === obj[key] || obj[key] !== value
    ? Object.assign(Object.assign({}, obj), { [key]: value }) : obj;
const optional = (key, value, obj) => (val => !val
    ? obj
    : update(obj, key, val))(value(obj));
const required = (key, value, obj) => (val => val instanceof Error
    ? val
    : update(obj, key, val))(value(obj));
export { required, optional, value, calc };
//# sourceMappingURL=index.js.map