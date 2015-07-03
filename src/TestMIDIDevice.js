import MIDIDevice from "./MIDIDevice";

const DEVICE_NAMES = [ "TestDevice1", "TestDevice2" ];

export function convertMessage(value = {}) {
  let msg = {
    receivedTime: value.receivedTime,
    data: value.data || value,
  };

  if (Array.isArray(msg.data)) {
    msg.data = new Uint8Array(msg.data);
  }

  if (typeof msg.receivedTime !== "number") {
    msg.receivedTime = 0;
  }

  if (!(msg.data instanceof Uint8Array)) {
    msg.data = new Uint8Array([ 0x00, 0x00, 0x00 ]);
  }

  return msg;
}

export default class TestMIDIDevice extends MIDIDevice {
  static requestDeviceNames() {
    return Promise.resolve({
      inputs: DEVICE_NAMES.slice(),
      outputs: DEVICE_NAMES.slice(),
    });
  }

  open() {
    return new Promise((resolve, reject) => {
      if (this._input !== null || this._output !== null) {
        return reject(new TypeError(`${this.deviceName} has already been opened`));
      }

      if (DEVICE_NAMES.indexOf(this.deviceName) === -1) {
        return reject(new TypeError(`${this.deviceName} is not found`));
      }

      let input = {};
      let output = {};

      this._input = input;

      input.recv = (e) => {
        this._onmidimessage(convertMessage(e));
      };

      this._output = output;

      resolve([ input, output ]);
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      if (this._input === null && this._output === null) {
        return reject(new TypeError(`${this.deviceName} has already been closed`));
      }
      let input = this._input;
      let output = this._output;

      this._input.recv = () => {};

      this._input = null;
      this._output = null;

      resolve([ input, output ]);
    });
  }

  send(data) {
    if (this._output !== null) {
      if (typeof this._output.onmessage === "function") {
        this._output.onmessage(data);
      }
    }
  }
}
