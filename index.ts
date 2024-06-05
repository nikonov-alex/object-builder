import { Types } from "@nikonov-alex/functional-library";

type Value<O extends { [k: string]: any }, V> = { ( obj: O ): V };

const calc = <O extends { [k: string]: any }, V, F extends { ( o: O ): V }>(
    func: F
): Value<O, V> =>
    ( obj: O ) => func( obj );

const value = <O extends { [k: string]: any }, V>(
    value: V
): Value<O, V> =>
    ( obj: O ) => value;






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
    value: Value<O, Types.Maybe<V>>,
    callback: { ( obj: O | O & Record<K, V> ): B }
) =>
        ( val => !val
                ? callback( obj )
                : update( obj, key, val, callback )
        )( value( obj ) );

const required = <O extends { [k: string]: any }, K extends string, V, B>(
    obj: O,
    key: K,
    value: Value<O, Types.Either<V, Error>>,
    callback: { ( obj: O & Record<K, V> ): B }
) =>
        ( val =>
            val instanceof Error
                ? val
                : update( obj, key, val, callback )
        )( value( obj ) );


export { update, required, optional, value, calc };