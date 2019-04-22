# ProxyHandler
Typings and interface definitions for a manager of a list of proxies.

## Quickstart

```javascript
import path from "path";
import ProxyHandler from "@pavlovcik/proxy-handler";

const handler = new ProxyHandler({
  location: path.join(process.cwd(), `test`, `successes.json`),  //  Filepath allows it to persist.
  //  Can also use variable ( i.e. an array [] ) which can only stay in RAM, and of course, is temporary.
  persist: true  //  Write to disk
});

console.log(handler);
console.log(handler.storage.proxies); //  Shows the list of proxies in the handler
console.log(handler.storage.proxies.flattened()); //  Handy flatten function to return only the proxies.
```

---

## Context

Building a botnet is no joke. In the parent application, the software must be able to aggregate free proxies from various sources; then test each proxy's performance; then finally make good use of the functional proxies. 

This object acts as a way to more easily manage the large lists of acquired proxies, along with all of their respective and deeply nested metadata.

---

## Interfaces to be aware of

A single proxy is represented as follows:
```javascript
interface IProxy {
	id: IParsedURL;
	details: any;
	origin?: string;
	performance?: IPerformance;
}
```

`IParsedURL` is actually `URLParse` from [url-parse](https://github.com/unshiftio/url-parse)
```javascript
interface URLParse {
    readonly auth: string;
    readonly hash: string;
    readonly host: string;
    readonly hostname: string;
    readonly href: string;
    readonly origin: string;
    readonly password: string;
    readonly pathname: string;
    readonly port: string;
    readonly protocol: string;
    readonly query: { [key: string]: string | undefined };
    readonly slashes: boolean;
    readonly username: string;
    set(part: URLParse.URLPart, value: string | object | number | undefined, fn?: boolean | URLParse.QueryParser): URLParse;
    toString(stringify?: URLParse.StringifyQuery): string;
}
```

---

See an example proxy list structure [here](https://github.com/pavlovcik/proxy-handler/blob/master/test/successes.json).
