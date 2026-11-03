"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisposableCollection = exports.Disposable = void 0;
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
const event_1 = require("./event");
var Disposable;
(function (Disposable) {
    function create(func) {
        return {
            dispose: func,
        };
    }
    Disposable.create = create;
    Disposable.NULL = create(() => { });
})(Disposable || (exports.Disposable = Disposable = {}));
class DisposableCollection {
    constructor() {
        this.disposables = [];
        this.onDisposeEmitter = new event_1.Emitter();
    }
    get onDispose() {
        return this.onDisposeEmitter.event;
    }
    checkDisposed() {
        if (this.disposed) {
            this.onDisposeEmitter.fire(undefined);
        }
    }
    get disposed() {
        return this.disposables.length === 0;
    }
    dispose() {
        if (this.disposed) {
            return;
        }
        while (!this.disposed) {
            this.disposables.pop().dispose();
        }
        this.checkDisposed();
    }
    push(disposable) {
        const disposables = this.disposables;
        disposables.push(disposable);
        const originalDispose = disposable.dispose.bind(disposable);
        const toRemove = Disposable.create(() => {
            const index = disposables.indexOf(disposable);
            if (index !== -1) {
                disposables.splice(index, 1);
            }
            this.checkDisposed();
        });
        disposable.dispose = () => {
            toRemove.dispose();
            originalDispose();
        };
        return toRemove;
    }
    pushAll(disposables) {
        return disposables.map((disposable) => this.push(disposable));
    }
}
exports.DisposableCollection = DisposableCollection;
//# sourceMappingURL=disposable.js.map