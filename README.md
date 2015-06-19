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

#### Instance attributes
- `deviceName: string`

#### Instance methods
- `open(): Promise<any>`
- `close(): Promise<any>`
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
  it("works", (done) => {
    let midiDevice = new TestCustomMIDIDevice();

    midiDevice.open().then((input) => {
      input.send([ 0x00, 0x01, 0x02 ]);
    });

    midiDevice.on("message", (e) => {
      assert(e.receivedTime === 0);
      assert.deepEqual(e.data, new Uint8Array([ 0x00, 0x01, 0x02 ]));
      done();
    });
  });
});
```

## License
MIT
