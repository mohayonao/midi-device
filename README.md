# MIDI Device
[![Build Status](http://img.shields.io/travis/mohayonao/midi-device.svg?style=flat-square)](https://travis-ci.org/mohayonao/midi-device)
[![NPM Version](http://img.shields.io/npm/v/@mohayonao/midi-device.svg?style=flat-square)](https://www.npmjs.org/package/@mohayonao/midi-device)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

> isomorphic abstract class for MIDI device

## Installation

```
npm install @mohayonao/midi-device
```

## API
### MIDIDevice
- `constructor(deviceName: string)`

#### Class methods
- `requestDeviceNames(): Promise<{ inputs: string[], outputs: string[] }>`

#### Instance attributes
- `deviceName: string`

#### Instance methods
- `open(): Promise<[ input: any, output: any ]>`
- `close(): Promise<[ input: any, output: any ]>`
- `send(data: number[]): void`
- `_onmidimessage(e: MIDIMessageEvent): void`

## Usage

Create a subclass that is inherited from a base class needed for each target environment.

```js
// CustomMIDIDevice.js
export default {
  extends(MIDIDevice) {
    return class CustomMIDIDevice extends MIDIDevice {
      constructor(deviceName = "Name of Custom Device") {
        super(deviceName);

        this._onmidimessage = (e) => {
          this.emit(e.type, e);
        };
      }
    }
  }
};
```

##### Node.js

```js
// NodeCustomMIDIDevice.js
import NodeMIDIDevice from "@mohayonao/midi-device";
import CustomMIDIDevice from "./CustomMIDIDevice";

export default CustomMIDIDevice.extends(NodeMIDIDevice);
```

##### Browser

```js
// WebCustomMIDIDevice.js
import WebMIDIDevice from "@mohayonao/midi-device/webmidi";
import CustomMIDIDevice from "./CustomMIDIDevice";

export default CustomMIDIDevice.extends(WebMIDIDevice);
```

##### Test
This provides API interfaces that not require a real MIDI device.

```js
import TestMIDIDevice from "@mohayonao/midi-device/test";
import CustomMIDIDevice from "../src/CustomMIDIDevice";

let TestCustomMIDIDevice = CustomMIDIDevice.extends(TestMIDIDevice);

describe("CustomMIDIDevice", () => {
  it("deviceNames", () => {
    return TestCustomMIDIDevice.requestDeviceNames().then(([ inputs, outpus ]) => {
      assert(Array.isArray(inputs));
      assert(inputs.every(x => typeof x === "string"));
      assert(Array.isArray(outputs));
      assert(outputs.every(x => typeof x === "string"));
    });
  });
  it("works", () => {
    let midiDevice = new TestCustomMIDIDevice();
    let onmessage = sinon.spy();

    midiDevice.on("message", onmessage);

    return midiDevice.open().then(([ input, output ]) => {
      input.recv([ 0x00, 0x01, 0x02 ]);

      assert(onmessage.calledOnce);

      let msg = onmessage.args[0][0];
      assert(typeof msg.receivedTime === "number");
      assert.deepEqual(msg.data, new Uint8Array([ 0x00, 0x01, 0x02 ]));

      output.onmessage = sinon.spy();
      output.send([ 0x03, 0x04, 0x05 ]);

      assert(output.onmessage.calledOnce);
      assert.deepEqual(output.onmessage.args[0][0], [ 0x03, 0x04, 0x05 ]);
    });
  });
});
```

## License
MIT
