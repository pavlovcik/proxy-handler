"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const path_1 = __importDefault(require("path"));
const chai = __importStar(require("chai"));
const expect = chai.expect;
// No location set
const PH = new index_1.ProxyHandler();
const S = PH.storage;
// Location set and loading successes.json
const PH2 = new index_1.ProxyHandler({ location: path_1.default.join(process.cwd(), `test`, `successes`) });
const S2 = PH2.storage;
const T = {
    "00": () => chai.should().exist(PH),
    "01": () => chai.should().exist(S),
    "02": () => chai.assert.isArray(S.location, `is not an array by default`),
    "03": () => chai.assert.isNotTrue(S.persist, `persistence is not false`),
    "04": () => chai.should().exist(S.proxies),
    "05": () => chai.should().exist(PH2.storage.proxies),
    "06": () => chai.assert.isFunction(S.proxies.flattened, `flatten isn't a method of storage.proxies!`),
    "07": () => chai.assert.isArray(S2.proxies.flattened(), `flatten method didn't return an array!`)
};
describe(`new ProxyHandler()`, () => {
    it(`exists when instantiated`, T[`00`]);
    describe(`.storage`, () => {
        it(`exists when instantiated`, T[`01`]);
        describe(`.location`, () => it(`is an array by default`, T[`02`]));
        describe(`.persistence`, () => it(`is false by default`, T[`03`]));
        describe(`.proxies`, () => {
            it(`exists by default`, T[`04`]);
            describe(`.flattened`, () => {
                it(`is a method on storage.proxies`, T[`06`]);
            });
        });
    });
});
describe(`new ProxyHandler({location: <pathname>}).storage.proxies`, () => {
    it(`exists file loaded`, T[`05`]);
    describe(`.flattened`, () => {
        it(`returns an array`, T[`07`]);
    });
});
//# sourceMappingURL=index.test.js.map