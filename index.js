const update = (obj, key, value, callback) => callback(undefined === obj[key] || obj[key] !== value
    ? Object.assign(Object.assign({}, obj), { [key]: value }) : obj);
const optional = (obj, key, value, callback) => !value
    ? callback(obj)
    : update(obj, key, value, callback);
const required = (obj, key, value, callback) => value instanceof Error
    ? value
    : update(obj, key, value, callback);
export { update, required, optional };
//# sourceMappingURL=index.js.map