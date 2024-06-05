import { Types } from "@nikonov-alex/functional-library";




const update = <O extends { [k: string]: any }, K extends string, V, B>(
    obj: O,
    key: K,
    value: V,
    callback: { ( obj: O & Record<K, V> ): B }
): B =>
    callback(
        undefined === obj[key] || obj[key] !== value
                ? { ... obj, [key]: value }
                : obj
    );

const optional = <O extends { [k: string]: any }, K extends string, V, B>(
    obj: O,
    key: K,
    value: Types.Maybe<V>,
    callback: { ( obj: O | O & Record<K, V> ): B }
) => !value
    ? callback( obj )
    : update( obj, key, value, callback )

const required = <O extends { [k: string]: any }, K extends string, V, B>(
    obj: O,
    key: K,
    value: Types.Either<V, Error>,
    callback: { ( obj: O & Record<K, V> ): B }
) =>
    value instanceof Error
        ? value
        : update( obj, key, value, callback );




export { update, required, optional };