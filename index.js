const calc = (func) => (obj) => func(obj);
const value = (value) => (obj) => value;
const update = (key, value) => (obj) => (val => undefined === obj[key] || obj[key] !== val
    ? Object.assign(Object.assign({}, obj), { [key]: val }) : obj)(value(obj));
const append = (key, value) => (obj) => (Object.assign(Object.assign({}, obj), { [key]: value(obj) }));
const optional = (action, value) => (obj) => (val => !val
    ? obj
    : action(obj))(value(obj));
const required = (action, value) => (obj) => (val => val instanceof Error
    ? val
    : action(obj))(value(obj));
const field = (key, action, val, validator) => (obj) => (value => validator(action(key, value), value)(obj))(value(val(obj)));
field("test", update, value(10), required);
export {};
//# sourceMappingURL=index.js.map