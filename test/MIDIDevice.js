import assert from "power-assert";
import EventEmitter from "../src/EventEmitter";
import MIDIDevice from "../src/MIDIDevice";

describe("MIDIDevice", () => {
  describe("constructor(deviceName: string)", () => {
    it("works", () => {
      let midiDevice = new MIDIDevice("DX7IIFD");

      assert(midiDevice instanceof MIDIDevice);
      assert(midiDevice instanceof EventEmitter);
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
  describe("#_onmidimessage(): void", () => {
    it("works", () => {
      let midiDevice = new MIDIDevice("DX7IIFD");

      assert(typeof midiDevice._onmidimessage === "function");

      delete midiDevice._onmidimessage;

      assert(typeof midiDevice._onmidimessage === "function");
    });
  });
});
