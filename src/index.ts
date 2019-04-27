import fs from "fs";
import IParsedURL from "url-parse";

export interface IProxyHandlerInputs {
	[key: string]: any;
	location?: string | IProxyList;
	persist?: boolean;
}

export interface IPerformance {
	//	successes.json[performance][x]
	tested: string; // "Sun Apr 14 2019 15:38:18 GMT-0500 (Central Daylight Time)",
	ping: number;
}

export interface IProxy {
	//	successes.json[x]
	id: IParsedURL;
	details: any;
	origin?: string;
	performance?: IPerformance;
}

export interface IProxyList extends Array<IProxy> { } //	successes.json

function flatten(this: any) {
	let flat: any = [];
	if (Array.isArray(this)) {
		let x = this.length;
		while (x--) {
			if (this[x].id) {
				if (this[x].id.href) {
					flat.push(this[x].id.href);
				} else throw new Error(`No "href" property found on ${this[x].id}`)
			} else throw new Error(`No "id" property found on ${this[x]}`)
		}
	} else flat = this;
	return flat;
}

export class ProxyHandlerDataStore {
	private _location: string | IProxyList = []; //	Automatically store in memory unless persist and location is set
	private _persist: boolean = false; //	Write/overwrite to disk
	private _proxies: any = { flattened: flatten }; //	flattened method is on the prototype because it is added whenever the proxies are requested.
	// _proxies is not actually of type "any" it is an array with a special "flattened" method. TODO: figure out interface declaration for this.

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
				`ProxyHandler storage "location" must be set before "persist" can be enabled.`
			);
		}
		this._persist = persistence;
	}

	set location(newName: string | IProxyList) {
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
				} else {
					this._proxies = fromDisk; //	Success
				}
			} catch (e) {
				console.error(e);
				if (this._persist) {
					//	Initialize a new proxy list (array) on disk.
					fs.writeFileSync(newName, `[]`, `UTF-8`);
				}
			}
		} else if (Array.isArray(newName)) {
			this._proxies = newName; //	Temporarily hold on to the array of proxies
		} else if (typeof newName === `object`) {
			throw new Error(
				`Datastorage is expected to be an array of proxies, not an object!`
			);
		} else {
			throw new Error(
				`Datastorage must be a filename (on disk) or an array (in memory)!`
			);
		}
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
		// this._proxies.flattened = flatten;	//	May be redundant TODO figure out if should place on GET or SET
	}

	constructor(input?: IProxyHandlerInputs) {
		if (input) {
			if (input.location) this.location = input.location; //	Must go first because can throw error when setting persist (persist requires filesystem location)
			Object.assign(this, ...Object.keys(input).map(k => ({ [k]: input[k] })));
		}
	}
}

export class ProxyHandler {
	storage: ProxyHandlerDataStore;
	constructor(input?: IProxyHandlerInputs) {
		this.storage = new ProxyHandlerDataStore(input);
	}
}

export default ProxyHandler;
