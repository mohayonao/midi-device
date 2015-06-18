import MIDIDevice from "./MIDIDevice";

function findMIDIPortByName(iter, deviceName) {
  for (let x = iter.next(); !x.done; x = iter.next()) {
    if (x.value.name === deviceName) {
      return x.value;
    }
  }

  return null;
}

export default class WebMIDIDevice extends MIDIDevice {
  open() {
    return new Promise((resolve, reject) => {
      if (!global.navigator || typeof global.navigator.requestMIDIAccess !== "function") {
        return reject(new TypeError("Web MIDI API is not supported"));
      }

      if (this._input !== null) {
        return reject(new TypeError(`${this.deviceName} has already been opened`));
      }

      let successCallback = (m) => {
        let input = findMIDIPortByName(m.inputs.values(), this.deviceName);

        if (input === null) {
          return reject(new TypeError(`${this.deviceName} is not found`));
        }

        this._input = input;

        input.onmidimessage = (e) => {
          this._onmidimessage(e);
        };

        return input.open().then(resolve, reject);
      };

      return global.navigator.requestMIDIAccess().then(successCallback, reject);
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      if (this._input === null) {
        return reject(new TypeError(`${this.deviceName} has already been closed`));
      }
      this._input.close().then(resolve, reject);
      this._input = null;
    });
  }
}
