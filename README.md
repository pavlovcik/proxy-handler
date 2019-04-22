# proxy-handler
Typings and interface definitions for a manager of a list of proxies.

Example Usage:

```javascript
const handler = new ProxyHandler({
  location: path.join(process.cwd(), `test`, `successes.json`),  //  Filepath allows it to persist.
  //  Can also use variable ( i.e. an array [] ) which can only stay in RAM, and of course, is temporary.
  persist: true  //  Write to disk
});

console.log(handler);
console.log(handler.storage.proxies); //  Shows the list of proxies in the handler
console.log(handler.storage.proxies.flattened()); //  Handy flatten function to return only the proxies.
```