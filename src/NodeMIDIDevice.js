import { input as MIDIInput, output as MIDIOutput } from "midi";
import MIDIDevice from "./MIDIDevice";

function findPortNumberByName(port, deviceName) {
  let portCount = port.getPortCount();

  for (let i = 0; i < portCount; i++) {
    if (port.getPortName(i) === deviceName) {
      return i;
    }
  }

  return -1;
}

export default class NodeMIDIDevice extends MIDIDevice {
  open() {
    return new Promise((resolve, reject) => {
      if (this._input !== null || this._output !== null) {
        return reject(new TypeError(`${this.deviceName} has already been opened`));
      }

      let input = new MIDIInput();
      let inputPortNumber = findPortNumberByName(input, this.deviceName);

      let output = new MIDIOutput();
      let outputPortNumber = findPortNumberByName(output, this.deviceName);

      if (inputPortNumber === -1 && outputPortNumber === -1) {
        return reject(new TypeError(`${this.deviceName} is not found`));
      }

      if (inputPortNumber !== -1) {
        this._input = input;

        input.openPort(inputPortNumber);
        input.on("message", (deltaTime, data) => {
          this._onmidimessage({
            receivedTime: Date.now(),
            data: new Uint8Array(data),
          });
        });
      }

      if (outputPortNumber !== -1) {
        this._output = output;

        output.openPort(outputPortNumber);
      }

      resolve([ this._input, this._output ]);
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      if (this._input === null && this._output === null) {
        return reject(new TypeError(`${this.deviceName} has already been closed`));
      }
      let input = this._input;
      let output = this._output;

      if (this._input !== null) {
        this._input.closePort();
      }
      if (this._output !== null) {
        this._output.closePort();
      }

      this._input = null;
      this._output = null;

      resolve([ input, output ]);
    });
  }

  send(data) {
    if (this._output !== null) {
      this._output.sendMessage(data);
    }
  }
}
