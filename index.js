"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
function flatten() {
    let flat = [];
    if (Array.isArray(this)) {
        let x = this.length;
        while (x--)
            flat.push(this[x].id.href);
    }
    else
        flat = this;
    return flat;
}
class ProxyHandlerDataStore {
    constructor(input) {
        this._location = []; //	Automatically store in memory unless persist and location is set
        this._persist = false; //	Write/overwrite to disk
        this._proxies = { flattened: flatten }; //	flattened method is on the prototype because it is added whenever the proxies are requested.
        if (input) {
            if (input.location)
                this.location = input.location; //	Must go first because can throw error when setting persist (persist requires filesystem location)
            Object.assign(this, ...Object.keys(input).map(k => ({ [k]: input[k] })));
        }
    }
    // _proxies is not actually of type "any" it is an array with a special "flattened" method. TODO: figure out interface declaration for this.
    get persist() {
        return this._persist;
    }
    get location() {
        return this._location;
    }
    get proxies() {
        this._proxies.flattened = flatten;
        return this._proxies;
    }
    set persist(persistence) {
        if (!this._location) {
            throw new Error(`ProxyHandler storage "location" must be set before "persist" can be enabled.`);
        }
        this._persist = persistence;
    }
    set location(newName) {
        /**
         * This can accept either a string representing a filename
         * to save out to, or, an array of proxies which will automatically
         * be stored in this._proxies, where it belongs.
         *
         * This allows the user to be flexible by allowing this module to
         * temporarily hold on to (and not forget) about a proxy list
         * moving it along to where it belongs and then later allowing
         * the user to set a filepath location at their convenience in
         * order to enable persistence.
         *
         */
        if (typeof newName === `string`) {
            /**
             * This TRY/CATCH block needs to be thoroughly tested
             * Because it needs to know how to juggle the filename or
             * the array that was passed in, while making sure
             * that the file it will be writing to is accessible and not corrupted.
             *
             * If corrupted, initialize with empty array.
             * If readable, check that it is an array and then load into memory.
             * If not an array, throw an error.
             */
            this._location = newName;
            try {
                let fromDisk = require(newName);
                if (!Array.isArray(fromDisk)) {
                    //	File contents must be an array.
                    throw new Error(`Datastorage is expected to be an array of proxies!`);
                }
                else {
                    this._proxies = fromDisk; //	Success
                }
            }
            catch (e) {
                console.error(e);
                if (this._persist) {
                    //	Initialize a new proxy list (array) on disk.
                    fs_1.default.writeFileSync(newName, `[]`, `UTF-8`);
                }
            }
        }
        else if (Array.isArray(newName)) {
            this._proxies = newName; //	Temporarily hold on to the array of proxies
        }
        else if (typeof newName === `object`) {
            throw new Error(`Datastorage is expected to be an array of proxies, not an object!`);
        }
        else {
            throw new Error(`Datastorage must be a filename (on disk) or an array (in memory)!`);
        }
    }
    set proxies(input) {
        if (this._persist) {
            // Determine if it is in memory (should not be possible) because persist requires filesystem
            if (typeof this._location === `string`) {
                // Or else if it is a filename then write to disk
                fs_1.default.writeFileSync(this._location, input, `UTF-8`);
            }
        }
        this._proxies = input;
        this._proxies.flattened = flatten;
    }
}
exports.ProxyHandlerDataStore = ProxyHandlerDataStore;
class ProxyHandler {
    constructor(input) {
        this.storage = new ProxyHandlerDataStore(input);
    }
}
exports.ProxyHandler = ProxyHandler;
exports.default = ProxyHandler;
//# sourceMappingURL=index.js.map