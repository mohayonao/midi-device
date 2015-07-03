import MIDIDevice from "./MIDIDevice";

function findMIDIPortByName(iter, deviceName) {
  for (let x = iter.next(); !x.done; x = iter.next()) {
    if (x.value.name === deviceName) {
      return x.value;
    }
  }

  return null;
}

function collectDeviceNames(iter) {
  let result = [];

  for (let x = iter.next(); !x.done; x = iter.next()) {
    result.push(x.value.name);
  }

  return result;
}

export default class WebMIDIDevice extends MIDIDevice {
  static requestDeviceNames() {
    return new Promise((resolve, reject) => {
      if (!global.navigator || typeof global.navigator.requestMIDIAccess !== "function") {
        return reject(new TypeError("Web MIDI API is not supported"));
      }

      return global.navigator.requestMIDIAccess().then((access) => {
        let inputDeviceNames = collectDeviceNames(access.inputs.values());
        let outputDeviceNames = collectDeviceNames(access.outputs.values());

        resolve({
          inputs: inputDeviceNames,
          outputs: outputDeviceNames,
        });
      }, reject);
    });
  }

  open() {
    return new Promise((resolve, reject) => {
      if (!global.navigator || typeof global.navigator.requestMIDIAccess !== "function") {
        return reject(new TypeError("Web MIDI API is not supported"));
      }

      if (this._input !== null || this._output !== null) {
        return reject(new TypeError(`${this.deviceName} has already been opened`));
      }

      let successCallback = (access) => {
        this._access = access;

        let input = findMIDIPortByName(access.inputs.values(), this.deviceName);
        let output = findMIDIPortByName(access.outputs.values(), this.deviceName);

        if (input === null && output === null) {
          return reject(new TypeError(`${this.deviceName} is not found`));
        }

        if (input !== null) {
          this._input = input;

          input.onmidimessage = (e) => {
            this._onmidimessage(e);
          };
        }

        if (output !== null) {
          this._output = output;
        }

        return Promise.all([
          this._input && this._input.open(),
          this._output && this._output.open(),
        ]).then(resolve, reject);
      };

      if (this._access) {
        return successCallback(this._access);
      }

      return global.navigator.requestMIDIAccess().then(successCallback, reject);
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

      return Promise.all([
        input && input.close(),
        output && output.close(),
      ]).then(resolve, reject);
    });
  }

  send(data) {
    if (this._output !== null) {
      this._output.send(data);
    }
  }
}
