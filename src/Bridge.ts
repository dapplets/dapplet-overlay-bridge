export class GeneralBridge {
    _subId: number = 0;
    _callbacks: { [topic: string]: Function[] } = {};

    constructor() {
        window.addEventListener('message', async (e) => {
            try {
                const data = JSON.parse(e.data);
                if (!data || !data.topic) return;

                const callbacks = this._callbacks[data.topic] || [];

                for (const callback of callbacks) {
                    const result = callback.apply({}, [data.message]);
                    if (data.id) {
                        const msg = JSON.stringify({
                            id: data.id,
                            result: result
                        });
                        window.parent.postMessage(msg, '*');
                    }
                }
            }
            catch (ex) { }
        });

        const _call = (
            method: string,
            args: any,
        ): Promise<any> => {
            const callbackEventDone = method + '_done';
            const callbackEventUndone = method + '_undone';
            return new Promise((res, rej) => {
                this.publish(this._subId.toString(), {
                    type: method,
                    message: args,
                });
                this.subscribe(callbackEventDone, (result: any) => {
                    this.unsubscribe(callbackEventDone);
                    this.unsubscribe(callbackEventUndone);
                    res(result);
                });
                this.subscribe(callbackEventUndone, (err?: any) => {
                    this.unsubscribe(callbackEventUndone);
                    this.unsubscribe(callbackEventDone);
                    rej(`Error in ${method}. ${err ? err : ''}`);
                });
            });
        }

        return new Proxy(this, {
            get: (target: any, prop: string) => {
                if (prop in target) {
                    return target[prop];
                } else {
                    return (...args: any) => _call(prop, args);
                }
            },
        });
    }

    on(event: string, callback: Function) {
        this.subscribe(event, (data: any) => {
            this._subId = Math.trunc(Math.random() * 1_000_000_000);
            callback(data);
            return this._subId.toString();
        });
    }

    off(event: string) {
        this.unsubscribe(event);
        return;
    }

    publish(topic: string, message: any): void {
        const msg = JSON.stringify({ topic, message });
        window.parent.postMessage(msg, '*');
    }

    subscribe(topic: string, handler: Function): void {
        if (!this._callbacks[topic]) {
            this._callbacks[topic] = [];
        }
        this._callbacks[topic].push(handler);
    }

    unsubscribe(topic: string): void {
        this._callbacks[topic] = [];
    }
}

export type Bridge<T> = GeneralBridge & T;

export interface IBridge {
    new <T = {}>(): Bridge<T>
}

export const Bridge: IBridge = GeneralBridge as any;
