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
  describe(".requestDeviceNames: Promise<object>", () => {
    it("works", () => {
      return TestMIDIDevice.requestDeviceNames().then((result) => {
        assert.deepEqual(result.inputs, [ "TestDevice1", "TestDevice2" ]);
        assert.deepEqual(result.outputs, [ "TestDevice1", "TestDevice2" ]);
      });
    });
  });
  describe("#open(): Promise<{ send: function }>", () => {
    it("works", () => {
      let midiDevice = new TestMIDIDevice("TestDevice1");

      midiDevice._onmidimessage = sinon.spy();

      return midiDevice.open().then(([ input, output ]) => {
        assert(typeof input.recv === "function");
        assert(typeof output.recv !== "function");

        input.recv([ 0x00, 0x01, 0x02 ]);

        assert(midiDevice._onmidimessage.calledOnce);
        assert(midiDevice._onmidimessage.args[0][0].receivedTime === 0);
        assert.deepEqual(midiDevice._onmidimessage.args[0][0].data, new Uint8Array([ 0x00, 0x01, 0x02 ]));

        return midiDevice.open().catch((e) => {
          assert(e.message === "TestDevice1 has already been opened");
        });
      });
    });
  });
  describe("#close(): Promise<{ send: function }>", () => {
    it("works", () => {
      let midiDevice = new TestMIDIDevice("TestDevice1");

      midiDevice._onmidimessage = sinon.spy();

      return midiDevice.open().then(() => {
        return midiDevice.close().then(([ input, output ]) => {
          assert(typeof input.recv === "function");
          assert(typeof output.recv !== "function");

          return midiDevice.close().catch((e) => {
            assert(e.message === "TestDevice1 has already been closed");

            input.recv([ 0x00, 0x01, 0x02 ]);

            assert(!midiDevice._onmidimessage.called);
          });
        });
      });
    });
  });
  describe("#send(data: number[]): void", () => {
    it("works", () => {
      let midiDevice = new TestMIDIDevice("TestDevice1");

      return midiDevice.open().then((ports) => {
        let output = ports[1];

        output.onmessage = sinon.spy();

        midiDevice.send([ 0xb0, 0x16, 0x01 ]);

        assert(output.onmessage.calledOnce);
        assert.deepEqual(output.onmessage.args[0][0], [ 0xb0, 0x16, 0x01 ]);
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
