module.exports = class Reader {
  constructor(buffer) {
    this.buffer = buffer;
    this.offset = 0;
  }

  readUInt8() {
    const result = this.buffer.readUInt8(this.offset);
    this.offset += 1;
    return result;
  }
  readUInt16() {
    const int = this.buffer.readUInt16LE(this.offset);
    this.offset += 2;
    return int;
  }
  readUInt32() {
    const int = this.buffer.readUInt32LE(this.offset);
    this.offset += 4;
    return int;
  }

  readByte() {
    const byte = Buffer.from(this.buffer.toString('binary', this.offset, this.offset + 1), 'binary');
    this.offset += 1;
    return byte;
  }
  readBytes(count) {
    const bytes = Buffer.from(this.buffer.toString('binary', this.offset, this.offset + count), 'binary');
    this.offset += count;
    return bytes;
  }

  readFString() {
    const length = this.readUInt8();
    return this.readBytes(length).toString('utf-8');
  }
}