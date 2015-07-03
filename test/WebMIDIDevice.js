import assert from "power-assert";
import MIDIDevice from "../src/MIDIDevice";
import WebMIDIDevice from "../src/WebMIDIDevice";

describe("NodeMIDIDevice", () => {
  describe("constructor(deviceName: string)", () => {
    it("works", () => {
      let midiDevice = new WebMIDIDevice("DX7IIFD");

      assert(midiDevice instanceof WebMIDIDevice);
      assert(midiDevice instanceof MIDIDevice);
    });
  });
  describe(".requestDeviceNames: Promise<object>", () => {
    it("works", () => {
      return WebMIDIDevice.requestDeviceNames().catch((e) => {
        assert(e.message === "Web MIDI API is not supported");
      });
    });
  });
  describe("#open(): Promise<MIDIPort>", () => {
    it("works", () => {
      let midiDevice = new WebMIDIDevice("DX7IIFD");

      return midiDevice.open().catch((e) => {
        assert(e.message === "Web MIDI API is not supported");
      });
    });
  });
  describe("#close(): Promise<MIDIPort>", () => {
    it("works", () => {
      let midiDevice = new WebMIDIDevice("DX7IIFD");

      return midiDevice.close().catch((e) => {
        assert(e.message === "DX7IIFD has already been closed");
      });
    });
  });
  describe("#send(data: number[]): void", () => {
    it("works", () => {
      let midiDevice = new WebMIDIDevice("DX7IIFD");

      assert.doesNotThrow(() => {
        midiDevice.send([ 0xb0, 0x16, 0x01 ]);
      });
    });
  });
});
