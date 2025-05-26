//a class to manage loading states
//the delay parameter states how long should be waited to
//set the loading state to true
//this is used to avoid flashing loading screens, when a request
//only takes a few milliseconds to complete
export class DelayLoader {
    private _isLoading: boolean = false;
    private loadingTimeout: number | undefined = undefined;
    private readonly delay: number;

    constructor(delayInMs: number = 100) {
        this.delay = delayInMs;
    }

    get isLoading() {
        return this._isLoading;
    }

    set isLoading(value: boolean) {
        if(value) {
            this.loadingTimeout = setTimeout(() => {
                this._isLoading = true;
            }, this.delay);
        } else {
            if(this.loadingTimeout) clearTimeout(this.loadingTimeout);
            this._isLoading = false;
        }
    }

    set isLoadingWithoutDelay(value: boolean) {
        this._isLoading = value;
    }
}