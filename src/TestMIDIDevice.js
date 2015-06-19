import MIDIDevice from "./MIDIDevice";

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
  open() {
    return new Promise((resolve, reject) => {
      if (this._input !== null || this._output !== null) {
        return reject(new TypeError(`${this.deviceName} has already been opened`));
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

  send() {}
}
