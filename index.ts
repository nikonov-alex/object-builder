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
    value: Value<O, V>,
    callback: { ( obj: O & Record<K, V> ): B }
): B =>
    callback(
        ( val => undefined === obj[key] || obj[key] !== val
                ? { ... obj, [key]: val }
                : obj )( value( obj ) )
    );

const optional = <O extends { [k: string]: any }, K extends string, V, B>(
    obj: O,
    key: K,
    val: Value<O, Types.Maybe<V>>,
    callback: { ( obj: O | O & Record<K, V> ): B }
) =>
        ( v => !v
                ? callback( obj )
                : update( obj, key, value( v ), callback )
        )( val( obj ) );

const required = <O extends { [k: string]: any }, K extends string, V, B>(
    obj: O,
    key: K,
    val: Value<O, Types.Either<V, Error>>,
    callback: { ( obj: O & Record<K, V> ): B }
) =>
        ( v =>
            v instanceof Error
                ? v
                : update( obj, key, value( v ), callback )
        )( val( obj ) );


export { update, required, optional, value, calc };