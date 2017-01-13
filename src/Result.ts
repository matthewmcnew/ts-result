const thisIsAResult = Symbol('thisIsAResult');

export default class Result<S, F> {
    private readonly thisIsAResult = thisIsAResult;
    private success?: S;
    private failure?: F;

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

        if (this.isResult(result)) {
            return result;
        }

        return Result.success<N,F>(result);
    }

    catch<N>(callBack: (failure: F) => N | Result<N, F>): Result<N,F> {
        const result = callBack(this.failure as F);

        if (this.isResult<N,F>(result)) {
            return result;
        }

        return Result.success<N,F>(result);
    }

    private isResult<N, O>(possiblyResult: N | O | Result<N, O>): possiblyResult is Result<N, O> {
        return possiblyResult && ((<Result<N, O>> possiblyResult).thisIsAResult === thisIsAResult);
    }
}
