import IParsedURL from "url-parse";
export interface IProxyHandlerInputs {
    [key: string]: any;
    location?: string;
    persist?: boolean;
}
export interface IPerformance {
    tested: string;
    ping: number;
}
export interface IProxy {
    id: IParsedURL;
    details: any;
    origin?: string;
    performance?: IPerformance;
}
export interface IProxyList extends Array<IProxy> {
}
export declare class ProxyHandlerDataStore {
    private _location;
    private _persist;
    private _proxies;
    persist: boolean;
    location: string | IProxyList;
    proxies: any;
    constructor(input?: IProxyHandlerInputs);
}
export declare class ProxyHandler {
    storage: ProxyHandlerDataStore;
    constructor(input?: IProxyHandlerInputs);
}
export default ProxyHandler;
/**
 * Usage:
 * let handler = new IProxyHandler({
 * 	 location: path.join(process.cwd(), `test`, `successes.json`),
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
//# sourceMappingURL=index.d.ts.map