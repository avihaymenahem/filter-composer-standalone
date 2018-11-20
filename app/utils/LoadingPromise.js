"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LoadingState;
(function (LoadingState) {
    LoadingState["LOADING"] = "LOADING";
    LoadingState["SUCCESS"] = "SUCCESS";
    LoadingState["ERROR"] = "ERROR";
})(LoadingState = exports.LoadingState || (exports.LoadingState = {}));
class LoadingPromise {
    constructor(executor) {
        this.loading = true;
        this.state = LoadingState.LOADING;
        this.promise = new Promise(executor)
            .then((data) => {
            this.loading = false;
            this.state = LoadingState.SUCCESS;
            LoadingPromise.forceUpdateHandler && LoadingPromise.forceUpdateHandler();
            return Promise.resolve(data);
        }, (e) => {
            this.loading = false;
            this.state = LoadingState.ERROR;
            LoadingPromise.forceUpdateHandler && LoadingPromise.forceUpdateHandler();
            return Promise.reject(e);
        });
    }
    static all(values) {
        return LoadingPromise.getInstance(Promise.all(values));
    }
    static race(values) {
        return LoadingPromise.getInstance(Promise.race(values));
    }
    static reject(reason) {
        return LoadingPromise.getInstance(Promise.reject(reason));
    }
    ;
    static resolve(value) {
        return LoadingPromise.getInstance(Promise.resolve(value));
    }
    catch(onrejected) {
        this.promise = this.promise.catch(onrejected);
        return this;
    }
    finally(onfinally) {
        this.promise = this.promise.finally(onfinally);
        return this;
    }
    then(onfulfilled, onrejected) {
        this.promise = this.promise.then(onfulfilled, onrejected);
        return this;
    }
    static getInstance(promise) {
        return new LoadingPromise((resolve, reject) => {
            return promise.then((data) => resolve(data), (e) => reject(e));
        });
    }
    get isLoading() {
        return this.loading;
    }
    get loadingState() {
        return this.state;
    }
}
exports.LoadingPromise = LoadingPromise;
//# sourceMappingURL=LoadingPromise.js.map