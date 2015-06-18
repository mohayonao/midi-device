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
      if (this._input !== null) {
        return reject(new TypeError(`${this.deviceName} has already been opened`));
      }

      let input = {};

      this._input = input;

      input.send = (e) => {
        this._onmidimessage(convertMessage(e));
      };

      resolve(input);
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      if (this._input === null) {
        return reject(new TypeError(`${this.deviceName} has already been closed`));
      }
      let input = this._input;

      this._input.send = () => {};
      this._input = null;

      resolve(input);
    });
  }
}
