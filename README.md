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

node.js

```js
import MIDIDevice from "@mohayonao/midi-device";
```

browser

```js
import MIDIDevice from "@mohayonao/midi-device/webmidi";
```

common

```js
export default class CustomMIDIDevice extends MIDIDevice {
  constructor(deviceName = "Name of Custom Device") {
    super(deviceName);

    this._onmidimessage = (e) => {
      this.emit(e.type, e);
    };
  }
}
```

## License
MIT
