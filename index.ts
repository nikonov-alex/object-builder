import { Types } from "@nikonov-alex/functional-library";

type Value<O extends { [k: string]: any }, V> = { ( obj: O ): V };

type EitherValue<O extends { [k: string]: any }, V extends Types.Either<any, any>> = Value<O, V>;

const calc = <O extends { [k: string]: any }, V, F extends { ( o: O ): V }>(
    func: F
): Value<O, V> =>
    ( obj: O ) => func( obj );

const value = <O extends { [k: string]: any }, V>(
    value: V
): Value<O, V> =>
    ( obj: O ) => value;





type ActionConstructor<O extends { [k: string]: any }, K extends string, V> = { (
        key: K,
        value: Value<O, V>
    ): Action<O, K, V> };

type Action<O extends { [k: string]: any }, K extends string, V> = { ( obj: O ): O & Record<K, V> };

const update = <O extends { [k: string]: any }, K extends string, V>(
    key: K,
    value: Value<O, V>
): Action<O, K, V> =>
    ( obj: O ): O & Record<K, V> =>
        ( val =>
            undefined === obj[key] || obj[key] !== val
                ? { ... obj, [key]: val }
                : obj
        )( value( obj ) );

const append = <O extends { [k: string]: any }, K extends string, V>(
    key: K,
    value: Value<O, V>
): Action<O, K, V> =>
    ( obj: O ): O & Record<K, V> =>
        ( { ... obj, [key]: value( obj ) } );





type ValidatorConstructor<O extends { [k: string]: any }, K extends string, V, T, R> = { (
    action: Action<O, K, V>,
    value: EitherValue<O, Types.Either<V, T>>
): Validator<O, K, V, R> };

type Validator<O extends { [k: string]: any }, K extends string, V, R> = { (
        obj: O
    ): R | O & Record<K, V>
};

const optional = <O extends { [k: string]: any }, K extends string, V>(
    action: Action<O, K, V>,
    value: EitherValue<O, Types.Maybe<V>>
): Validator<O, K, V, O> =>
    ( obj: O ): O | O & Record<K, V> =>
        ( val =>
            !val
                ? obj
                : action( obj )
        )( value( obj ) );

const required = <O extends { [k: string]: any }, K extends string, V>(
    action: Action<O, K, V>,
    value: EitherValue<O, Types.Either<V, Error>>
): Validator<O, K, V, Error> =>
    ( obj: O ): Error | O & Record<K, V> =>
        ( val =>
            val instanceof Error
                ? val
                : action( obj )
        )( value( obj ) );


const orerror = <O extends { [k: string]: any }, V>(
    value: Value<O, Types.Maybe<V>>,
    error: Error
): EitherValue<O, Types.Either<V, Error>> =>
    ( obj: O ) => value( obj ) || error;


const field = <O extends { [k: string]: any }, K extends string, V, T, R>(
    key: K,
    action: ActionConstructor<O, K, V>,
    validator: ValidatorConstructor<O, K, V, T, R>,
    val: EitherValue<O, Types.Either<V, T>>
): Validator<O, K, V, R> =>
    ( obj: O ): R | O & Record<K, V> =>
        ( value =>
            validator(
                action( key, value as Value<O, V> ),
                value
            )( obj )
        )( value( val( obj ) ) );

export { field, required, optional, update, append, value, calc, orerror };