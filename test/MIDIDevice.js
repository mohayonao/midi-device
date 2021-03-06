import assert from "power-assert";
import { EventEmitter } from "events";
import MIDIDevice from "../src/MIDIDevice";

describe("MIDIDevice", () => {
  describe("constructor(deviceName: string)", () => {
    it("works", () => {
      let midiDevice = new MIDIDevice("DX7IIFD");

      assert(midiDevice instanceof MIDIDevice);
      assert(midiDevice instanceof EventEmitter);
    });
  });
  describe(".requestDeviceNames: Promise<object>", () => {
    it("works", () => {
      return MIDIDevice.requestDeviceNames().catch((e) => {
        assert(e.message === "subclass responsibility");
      });
    });
  });
  describe("#deviceName: string", () => {
    it("works", () => {
      let midiDevice = new MIDIDevice("DX7IIFD");

      assert(midiDevice.deviceName === "DX7IIFD");
    });
  });
  describe("#open(): Promise<any>", () => {
    it("works", () => {
      let midiDevice = new MIDIDevice("DX7IIFD");

      return midiDevice.open().catch((e) => {
        assert(e.message === "subclass responsibility");
      });
    });
  });
  describe("#close(): Promise<any>", () => {
    it("works", () => {
      let midiDevice = new MIDIDevice("DX7IIFD");

      return midiDevice.close().catch((e) => {
        assert(e.message === "subclass responsibility");
      });
    });
  });
  describe("#send(data: number[]): void", () => {
    it("works", () => {
      let midiDevice = new MIDIDevice("DX7IIFD");

      assert.throws(() => {
        midiDevice.send([ 0xb0, 0x16, 0x01 ]);
      }, "subclass responsibility");
    });
  });
  describe("#_onmidimessage(): void", () => {
    it("works", () => {
      let midiDevice = new MIDIDevice("DX7IIFD");

      assert(typeof midiDevice._onmidimessage === "function");

      delete midiDevice._onmidimessage;

      assert(typeof midiDevice._onmidimessage === "function");
    });
  });
});
