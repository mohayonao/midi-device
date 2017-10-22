import { EventEmitter } from "events";

export default class MIDIDevice extends EventEmitter {
  constructor(deviceName) {
    super();

    this._input = null;
    this._output = null;
    this._deviceName = deviceName;
  }

  static requestDeviceNames() {
    return Promise.reject(new Error("subclass responsibility"));
  }

  get deviceName() {
    return this._deviceName;
  }

  open() {
    return Promise.reject(new Error("subclass responsibility"));
  }

  close() {
    return Promise.reject(new Error("subclass responsibility"));
  }

  send() {
    throw new Error("subclass responsibility");
  }

  _onmidimessage() {}
}
