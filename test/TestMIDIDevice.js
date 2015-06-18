import assert from "power-assert";
import sinon from "sinon";
import MIDIDevice from "../src/MIDIDevice";
import TestMIDIDevice, { convertMessage } from "../src/TestMIDIDevice";

describe("TestMIDIDevice", () => {
  describe("constructor(deviceName: string)", () => {
    it("works", () => {
      let midiDevice = new TestMIDIDevice("DX7IIFD");

      assert(midiDevice instanceof TestMIDIDevice);
      assert(midiDevice instanceof MIDIDevice);
    });
  });
  describe("#open(): Promise<{ send: function }>", () => {
    it("works", () => {
      let midiDevice = new TestMIDIDevice("DX7IIFD");

      midiDevice._onmidimessage = sinon.spy();

      return midiDevice.open().then((input) => {
        assert(typeof input.send === "function");

        input.send([ 0x00, 0x01, 0x02 ]);

        assert(midiDevice._onmidimessage.calledOnce);
        assert(midiDevice._onmidimessage.args[0][0].receivedTime === 0);
        assert.deepEqual(midiDevice._onmidimessage.args[0][0].data, new Uint8Array([ 0x00, 0x01, 0x02 ]));

        return midiDevice.open().catch((e) => {
          assert(e.message === "DX7IIFD has already been opened");
        });
      });
    });
  });
  describe("#close(): Promise<{ send: function }>", () => {
    it("works", () => {
      let midiDevice = new TestMIDIDevice("DX7IIFD");

      midiDevice._onmidimessage = sinon.spy();

      return midiDevice.open().then(() => {
        return midiDevice.close().then((input) => {
          assert(typeof input.send === "function");
          return midiDevice.close().catch((e) => {
            assert(e.message === "DX7IIFD has already been closed");

            input.send([ 0x00, 0x01, 0x02 ]);

            assert(!midiDevice._onmidimessage.called);
          });
        });
      });
    });
  });
  describe("convertMessage(value: any): object", () => {
    it("works", () => {
      let msg;

      msg = convertMessage();
      assert.deepEqual(msg, { receivedTime: 0, data: new Uint8Array([ 0x00, 0x00, 0x00 ]) });

      msg = convertMessage([ 0x00, 0x01, 0x02 ]);
      assert.deepEqual(msg, { receivedTime: 0, data: new Uint8Array([ 0x00, 0x01, 0x02 ]) });

      msg = convertMessage({ receivedTime: 1, data: [ 0x00, 0x01, 0x02 ] });
      assert.deepEqual(msg, { receivedTime: 1, data: new Uint8Array([ 0x00, 0x01, 0x02 ]) });
    });
  });
});
