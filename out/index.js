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
class IProxyHandlerDataStore {
    constructor(input) {
        this._location = []; //	Automatically store in memory unless persist and location is set
        this._persist = false; //	Write/overwrite to disk
        this._proxies = { flattened: flatten }; //	flattened method is on the prototype because it is added whenever the proxies are requested.
        if (input) {
            //	Probably can use object mapping for this
            if (input.location)
                this.location = input.location; //	Must go first because can throw error when setting persist (persist requires filesystem location)
            // if (input.persist) this.persist = input.persist;
            Object.assign(this, ...Object.keys(input).map(k => ({ [k]: input[k] })));
        }
        return this;
    }
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
            throw new Error(`ProxyHandler storage "location" must be set before "persistence" can be enabled.`);
        }
        this._persist = persistence;
    }
    set location(newName) {
        if (typeof newName === `string`) {
            try {
                this._proxies = require(newName).successes; //	.successes?
            }
            catch (e) {
                fs_1.default.open(newName, `w`, (err, fd) => {
                    if (err)
                        throw err;
                    fs_1.default.close(fd, err => {
                        if (err)
                            throw err;
                    });
                });
            }
        }
        else if (Array.isArray(newName)) {
            this._proxies = newName;
        }
        else if (typeof newName === `object`) {
            //	Unhandled
        }
        else {
            throw new Error(`Datastorage must be a filename (on disk) or an array (in memory)!`);
        }
        this._location = newName;
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
    }
}
exports.IProxyHandlerDataStore = IProxyHandlerDataStore;
class IProxyHandler {
    constructor(input) {
        this.storage = new IProxyHandlerDataStore(input);
        return this;
    }
}
exports.default = IProxyHandler;
/**
 * Usage:
 * let handler = new IProxyHandler({
 * 	 location: path.join(process.cwd(), `..`, `report.json`),
 * 	 persist: true
 * 	});
 *
 * 	console.log();
 * 	console.log(handler);
 * 	console.log();
 *
 * 	// console.log(handler.storage.proxies);
 * 	// console.log(handler.storage.proxies.flattened());
 *
 **/ 
//# sourceMappingURL=index.js.map