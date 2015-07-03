import { input as MIDIInput, output as MIDIOutput } from "midi";
import synchronizer from "synchronizer";
import MIDIDevice from "./MIDIDevice";

let synchronized = synchronizer.create();

function findPortNumberByName(port, deviceName) {
  let portCount = port.getPortCount();

  for (let i = 0; i < portCount; i++) {
    if (port.getPortName(i) === deviceName) {
      return i;
    }
  }

  return -1;
}

function collectDeviceNames(port) {
  let result = [];
  let portCount = port.getPortCount();

  for (let i = 0; i < portCount; i++) {
    result.push(port.getPortName(i));
  }

  return result;
}

/* eslint-disable no-unused-vars */
function async(func) {
  return () => new Promise((resolve) => {
    setTimeout(() => func(resolve), 0);
  });
}
/* eslint-enable no-unused-vars */

export default class NodeMIDIDevice extends MIDIDevice {
  static requestDeviceNames() {
    return new Promise((resolve) => {
      let input, inputDeviceNames;
      let output, outputDeviceNames;

      synchronized(async(done => {
        input = new MIDIInput();
        inputDeviceNames = collectDeviceNames(input);
        done();
      }));

      synchronized(async(done => {
        output = new MIDIOutput();
        outputDeviceNames = collectDeviceNames(output);
        done();
      }));

      synchronized(async(done => {
        input.closePort();
        done();
      }));

      synchronized(async(done => {
        output.closePort();
        done();
      }));

      synchronized(() => resolve({
        inputs: inputDeviceNames,
        outputs: outputDeviceNames,
      }));
    });
  }

  open() {
    return new Promise((resolve, reject) => {
      if (this._input !== null || this._output !== null) {
        return reject(new TypeError(`${this.deviceName} has already been opened`));
      }

      let input, inputPortNumber;
      let output, outputPortNumber;

      synchronized(async(done => {
        input = new MIDIInput();
        inputPortNumber = findPortNumberByName(input, this.deviceName);
        done();
      }));

      synchronized(async(done => {
        output = new MIDIOutput();
        outputPortNumber = findPortNumberByName(output, this.deviceName);
        done();
      }));

      synchronized(async(done => {
        if (inputPortNumber === -1) {
          input.closePort();
        } else {
          input.openPort(inputPortNumber);
          input.on("message", (deltaTime, data) => {
            this._onmidimessage({
              receivedTime: Date.now(),
              data: new Uint8Array(data),
            });
          });
          this._input = input;
        }
        done();
      }));

      synchronized(async(done => {
        if (outputPortNumber === -1) {
          output.closePort();
        } else {
          output.openPort(outputPortNumber);
          this._output = output;
        }
        done();
      }));

      synchronized(() => {
        if (inputPortNumber === -1 && outputPortNumber === -1) {
          reject(new TypeError(`${this.deviceName} is not found`));
        } else {
          resolve([ this._input, this._output ]);
        }
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      if (this._input === null && this._output === null) {
        return reject(new TypeError(`${this.deviceName} has already been closed`));
      }
      let input = this._input;
      let output = this._output;

      this._input = null;
      this._output = null;

      if (input !== null) {
        synchronized(async(done => {
          input.closePort();
          done();
        }));
      }

      if (output !== null) {
        synchronized(async(done => {
          output.closePort();
          done();
        }));
      }

      synchronized(() => {
        resolve([ input, output ]);
      });
    });
  }

  send(data) {
    if (this._output !== null) {
      this._output.sendMessage(data);
    }
  }
}
