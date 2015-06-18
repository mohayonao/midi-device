import { input as MidiInput } from "midi";
import MIDIDevice from "./MIDIDevice";

function findPortNumberByName(input, deviceName) {
  let portCount = input.getPortCount();

  for (let i = 0; i < portCount; i++) {
    if (input.getPortName(i) === deviceName) {
      return i;
    }
  }

  return -1;
}

export default class NodeMIDIDevice extends MIDIDevice {
  open() {
    return new Promise((resolve, reject) => {
      if (this._input !== null) {
        return reject(new TypeError(`${this.deviceName} has already been opened`));
      }
      let input = new MidiInput();
      let portNumber = findPortNumberByName(input, this.deviceName);

      if (portNumber === -1) {
        return reject(new TypeError(`${this.deviceName} is not found`));
      }

      this._input = input;

      input.openPort(portNumber);
      input.on("message", (deltaTime, data) => {
        this._onmidimessage({
          receivedTime: Date.now(),
          data: new Uint8Array(data),
        });
      });

      resolve(input);
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      if (this._input === null) {
        return reject(new TypeError(`${this.deviceName} has already been closed`));
      }
      let input = this._input;

      this._input.closePort();
      this._input = null;

      resolve(input);
    });
  }
}
