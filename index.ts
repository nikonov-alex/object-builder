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






const update = <O extends { [k: string]: any }, K extends string, V>(
    obj: O,
    key: K,
    value: V
): O & Record<K, V> =>
    undefined === obj[key] || obj[key] !== value
        ? { ... obj, [key]: value }
        : obj

const optional = <O extends { [k: string]: any }, K extends string, V>(
    obj: O,
    key: K,
    value: Value<O, Types.Maybe<V>>
): O | O & Record<K, V> =>
        ( val =>
            !val
                ? obj
                : update( obj, key, val )
        )( value( obj ) );

const required = <O extends { [k: string]: any }, K extends string, V>(
    obj: O,
    key: K,
    value: Value<O, Types.Either<V, Error>>
): Error | O & Record<K, V> =>
        ( val =>
            val instanceof Error
                ? val
                : update( obj, key, val )
        )( value( obj ) );


export { required, optional, value, calc };