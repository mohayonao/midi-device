import assert from "power-assert";
import MIDIDevice from "../src/MIDIDevice";
import NodeMIDIDevice from "../src/NodeMIDIDevice";

describe("NodeMIDIDevice", () => {
  describe("constructor(deviceName: string)", () => {
    it("works", () => {
      let midiDevice = new NodeMIDIDevice("DX7IIFD");

      assert(midiDevice instanceof NodeMIDIDevice);
      assert(midiDevice instanceof MIDIDevice);
    });
  });
  describe("#open(): Promise<midi.input>", () => {
    // skip this test for travis ci
    it.skip("works", () => {
      let midiDevice = new NodeMIDIDevice("DX7IIFD");

      return midiDevice.open().catch((e) => {
        assert(e.message === "DX7IIFD is not found");
      });
    });
  });
  describe("#close(): Promise<midi.input>", () => {
    it("works", () => {
      let midiDevice = new NodeMIDIDevice("DX7IIFD");

      return midiDevice.close().catch((e) => {
        assert(e.message === "DX7IIFD has already been closed");
      });
    });
  });
});
