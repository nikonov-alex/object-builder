import { Types } from "@nikonov-alex/functional-library";

type Value<O extends { [k: string]: any }, V extends any> = { ( obj: O ): V };

const calc = <O extends { [k: string]: any }, V extends any, F extends { ( o: O ): V }>(
    func: F
): Value<O, V> =>
    ( obj: O ) => func( obj );

const value = <O extends { [k: string]: any }, V extends any>(
    value: V
): Value<O, V> =>
    ( obj: O ) => value;






type ActionConstructor<O extends { [k: string]: any }, K extends string, V extends any> = { (
        key: K,
        value: Value<O, V>
    ): Action<O, K, V> };

type ActionResult<O extends { [k: string]: any }, K extends string, V extends any> = O & Record<K, V>;

type Action<O extends { [k: string]: any }, K extends string, V extends any> = { ( obj: O ): ActionResult<O, K, V> };

const update = <O extends { [k: string]: any }, K extends string, V extends any>(
    key: K,
    value: Value<O, V>
): Action<O, K, V> =>
    ( obj: O ): O & Record<K, V> =>
        ( val =>
            undefined === obj[key] || obj[key] !== val
                ? { ... obj, [key]: val }
                : obj
        )( value( obj ) );

const append = <O extends { [k: string]: any }, K extends string, V extends any>(
    key: K,
    value: Value<O, V>
): Action<O, K, V> =>
    ( obj: O ): O & Record<K, V> =>
        ( { ... obj, [key]: value( obj ) } );






type ValidatorConstructor<O extends { [k: string]: any }, K extends string, V extends any, T extends any, R extends any> = { (
    action: Action<O, K, V>,
    value: Value<O, V | T>
): Validator<O, K, V, R> };

type ValidatorResult<O extends { [k: string]: any }, K extends string, V extends any, R extends any> = R | ActionResult<O, K, V>;

type Validator<O extends { [k: string]: any }, K extends string, V extends any, R extends any> = { (
        obj: O
    ): ValidatorResult<O, K, V, R>
};

const optional = <O extends { [k: string]: any }, K extends string, V extends any>(
    action: Action<O, K, V>,
    value: Value<O, Types.Maybe<V>>
): Validator<O, K, V, O> =>
    ( obj: O ): ValidatorResult<O, K, V, O> =>
        ( val =>
            !val
                ? obj
                : action( obj )
        )( value( obj ) );

const required = <O extends { [k: string]: any }, K extends string, V extends any>(
    action: Action<O, K, V>,
    value: Value<O, V | Error>
): Validator<O, K, V, Error> =>
    ( obj: O ): ValidatorResult<O, K, V, Error> =>
        ( val =>
            val instanceof Error
                ? val
                : action( obj )
        )( value( obj ) );





const field = <O extends { [k: string]: any }, K extends string, V extends any, T extends any, R extends any>(
    key: K,
    action: ActionConstructor<O, K, V>,
    validator: ValidatorConstructor<O, K, V, T, R>,
    val: Value<O, V | T>
): Validator<O, K, V, R> =>
    ( obj: O ): ValidatorResult<O, K, V, R> =>
        ( value =>
            validator(
                action( key, value as Value<O, V> ),
                value
            )( obj )
        )( value( val( obj ) ) );

export { field, required, optional, update, append, value, calc };