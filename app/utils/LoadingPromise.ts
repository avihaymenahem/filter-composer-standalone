export enum LoadingState {
    LOADING = 'LOADING',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR'
}

export class LoadingPromise<T> implements Promise<T | never> {
    static forceUpdateHandler;
    private promise;
    private loading: boolean = true;
    private state = LoadingState.LOADING;

    constructor(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void) {
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

    static all<T>(values: (T | PromiseLike<T>)[]): LoadingPromise<T[]> {
        return LoadingPromise.getInstance(Promise.all(values));
    }

    static race<T>(values: Iterable<PromiseLike<T> | T>): LoadingPromise<T> {
        return LoadingPromise.getInstance(Promise.race(values));
    }

    static reject<T>(reason: any): LoadingPromise<T> {
        return LoadingPromise.getInstance(Promise.reject(reason));
    };

    static resolve<T>(value?: T | PromiseLike<T>): Promise<T> {
        return LoadingPromise.getInstance(Promise.resolve(value));
    }

    catch<TResult = never>(onrejected?: ((reason: any) => (PromiseLike<TResult> | TResult)) | null | undefined): LoadingPromise<T | TResult> {
        this.promise = this.promise.catch(onrejected);
        return this;
    }

    finally(onfinally?: (() => void) | null | undefined): LoadingPromise<T> {
        this.promise = this.promise.finally(onfinally);
        return this;
    }

    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => (PromiseLike<TResult1> | TResult1)) | null | undefined, onrejected?: ((reason: any) => (PromiseLike<TResult2> | TResult2)) | null | undefined): LoadingPromise<TResult1 | TResult2> {
        this.promise = this.promise.then(onfulfilled, onrejected);
        return this as any;
    }

    readonly [Symbol.toStringTag]: 'Promise';


    private static getInstance(promise) {
        return new LoadingPromise((resolve, reject) => {
            return promise.then((data) => resolve(data), (e) => reject(e));
        }) as LoadingPromise<any>;
    }


    get isLoading() {
        return this.loading;
    }

    get loadingState() {
        return this.state;
    }


}
