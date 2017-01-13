import Result from "../src/Result";
import {expect} from "chai";

describe('Result', () => {

    describe('Success', () => {
        it('Resolves Successes in then', (done) => {
            const expectedValue: {a: number} = {a: 1};

            Result.success(expectedValue)
                .then((value: {a: number}) => {
                    expect(value).to.equal(expectedValue);
                    return "A String Now!"
                })
                .then((aString) => {
                    expect(aString).to.equal("A String Now!");
                    done();
                });
        });

        it('works with generics', (done) => {
            const expectedValue: {a: number} = {a: 1};

            const myResult = Result.success<{a: number}, Error>(expectedValue)
                .then((value: {a: number}) => {
                    expect(value).to.equal(expectedValue);
                    return "A String Now!"
                });

            function something(a: Result<string, Error>) {
                done();
            }

            something(myResult);
        });

        it('supports Returning Results inside then', (done) => {
            const expectedValue: {a: number} = {a: 1};

            const myResult = Result.success<{a: number}, Error>(expectedValue)
                .then((value: {a: number}) => {
                    expect(value).to.equal(expectedValue);
                    return Result.success<String, Error>("A String Now!");
                })
                .then((aString) => {
                    expect(aString).to.equal("A String Now!");
                    done();
                });

        });

        it('supports Returning nothing inside then', (done) => {
            const expectedValue: {a: number} = {a: 1};

            Result.success<{a: number}, Error>(expectedValue)
                .then((value: {a: number}) => {
                    expect(value).to.equal(expectedValue);
                })
                .then(() => {
                    done();
                });

        });

        it('behaves like a promise success', () => {
            const expectedValue: {a: number} = {a: 1};

            return Result.success(expectedValue)
        });
    });

    describe('failure', () => {
        it('Resolves failures in catch', (done) => {
            const expectedValue: Error = new Error('hello Message');

            Result.failure(expectedValue)
                .then(() => {
                    expect.fail("Should not resolve");
                })
                .catch((err) => {
                    return err.message;
                })
                .then((value) => {
                    expect(value).to.equal('hello Message');
                    done();
                });
        });

        it('Supports returning new Results in catch', (done) => {
            const expectedValue: Error = new Error('hello Message');

            Result.failure(expectedValue)
                .then(() => {
                    expect.fail("Should not resolve");
                })
                .catch((err) => {
                    return Result.failure(new Error('New Message'));
                })
                .then(expect.fail)
                .catch((err) => {
                    expect(err.message).to.equal('New Message');
                    done();
                });
        });
    });
});
