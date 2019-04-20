// import path from "path";
import fs from "fs";
import IParsedURL from "url-parse";

export interface IProxyHandlerInputs {
	[key: string]: any;
	location?: string;
	persist?: boolean;
}

export interface IPerformance {
	tested: string; // "Sun Apr 14 2019 15:38:18 GMT-0500 (Central Daylight Time)",
	ping: number;
}

export interface IProxy {
	id: IParsedURL;
	details: any;
	origin?: string;
	performance?: IPerformance;
}

export interface IProxyList extends Array<IProxy> {}

function flatten(this: any) {
	let flat: any = [];
	if (Array.isArray(this)) {
		let x = this.length;
		while (x--) flat.push(this[x].id.href);
	} else flat = this;
	return flat;
}

export class IProxyHandlerDataStore {
	private _location: string | IProxyList = []; //	Automatically store in memory unless persist and location is set
	private _persist: boolean = false; //	Write/overwrite to disk
	private _proxies: any = { flattened: flatten }; //	flattened method is on the prototype because it is added whenever the proxies are requested.

	get persist(): boolean {
		return this._persist;
	}

	get location(): string | IProxyList {
		return this._location;
	}

	get proxies() {
		this._proxies.flattened = flatten;
		return this._proxies;
	}

	set persist(persistence: boolean) {
		if (!this._location) {
			throw new Error(
				`ProxyHandler storage "location" must be set before "persistence" can be enabled.`
			);
		}
		this._persist = persistence;
	}

	set location(newName: string | IProxyList) {
		if (typeof newName === `string`) {
			try {
				this._proxies = require(newName).successes; //	.successes?
			} catch (e) {
				fs.open(newName, `w`, (err, fd) => {
					if (err) throw err;
					fs.close(fd, err => {
						if (err) throw err;
					});
				});
			}
		} else if (Array.isArray(newName)) {
			this._proxies = newName;
		} else if (typeof newName === `object`) {
			//	Unhandled
		} else {
			throw new Error(
				`Datastorage must be a filename (on disk) or an array (in memory)!`
			);
		}
		this._location = newName;
	}

	set proxies(input: any) {
		if (this._persist) {
			// Determine if it is in memory (should not be possible) because persist requires filesystem
			if (typeof this._location === `string`) {
				// Or else if it is a filename then write to disk
				fs.writeFileSync(this._location, input, `UTF-8`);
			}
		}
		this._proxies = input;
	}

	constructor(input?: IProxyHandlerInputs) {
		if (input) {
			//	Probably can use object mapping for this
			if (input.location) this.location = input.location; //	Must go first because can throw error when setting persist (persist requires filesystem location)
			// if (input.persist) this.persist = input.persist;
			Object.assign(this, ...Object.keys(input).map(k => ({ [k]: input[k] })));
		}
		return this;
	}
}

export default class IProxyHandler {
	storage: IProxyHandlerDataStore;
	constructor(input?: IProxyHandlerInputs) {
		this.storage = new IProxyHandlerDataStore(input);
		return this;
	}
}

/**
 * Usage:
 * let handler = new IProxyHandler({
 * 	 location: path.join(process.cwd(), `test`, `report.json`),
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