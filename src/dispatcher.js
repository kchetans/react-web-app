import {Dispatcher} from "flux";
import {EventEmitter} from "events";

let __dispatcher = new Dispatcher();
let __eventEmitter = new EventEmitter();

window.e = __eventEmitter;
window.d = __dispatcher;

export const dispatcher = __dispatcher;
export const eventEmitter = __eventEmitter;
export default  dispatcher;
