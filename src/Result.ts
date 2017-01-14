const thisIsAResult = Symbol('thisIsAResult');

export default class Result<S, F> {
    private readonly thisIsAResult = thisIsAResult;
    private readonly success?: S;
    private readonly failure?: F;

    constructor(s?: S, f?: F) {
        this.success = s;
        this.failure = f;
    }

    static success<S, F>(sucess: S): Result<S,F> {
        return new Result<S,F>(sucess, undefined);
    }

    static failure<S, F>(failure: F): Result<S,F> {
        return new Result<S, F>(undefined, failure);
    }

    then<N>(callBack: (success: S) => N | Result<N, F>): Result<N, F> {
        if (!this.success && this.failure)
            return new Result<N, F>(undefined, this.failure);

        const result = callBack(this.success as S);

        if (Result.isResult(result)) {
            return result;
        }

        return Result.success<N,F>(result);
    }

    //noinspection ReservedWordAsName
    catch(callBack: (failure: F) => S | Result<S, F>): Result<S,F> {
        if (!this.failure)
            return this;

        const result = callBack(this.failure as F);

        if (Result.isResult<S,F>(result)) {
            return result;
        }

        return Result.success<S,F>(result);
    }

    private static isResult<N, O>(possiblyResult: N | O | Result<N, O>): possiblyResult is Result<N, O> {
        return possiblyResult && ((<Result<N, O>> possiblyResult).thisIsAResult === thisIsAResult);
    }
}
