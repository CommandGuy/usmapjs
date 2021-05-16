const EUsmapCompressionMethod = require('./enums/EUsmapCompressionMethod.js');
const decompress = require('brotli/decompress');
const Schema = require('./classes/Schema.js');
const Enum = require('./classes/Enum.js');
const Reader = require('./reader.js');

module.exports = class UsmapJS {
  constructor(options = {}) {
    this.debug = options.debug && options.debug.constructor === Function ? options.debug : (() => { })
  };

  decompress(buf) {
    this.debug('Starting to read file...');

    let reader = new Reader(buf);

    let magic = reader.readUInt16();
    if (magic != 0x30C4)
      throw new Error('Invalid usmap file');

    let version = reader.readUInt8();
    if (version != 0)
      throw new Error(`Unsupported usmap version: ${version}`);

    let method = reader.readUInt8();
    if (!EUsmapCompressionMethod[method])
      throw new Error(`Invalid usmap compression method: ${method}`);

    let compressed_size = reader.readUInt32();
    let decompressed_size = reader.readUInt32();

    let data = Buffer.alloc(decompressed_size);
    let bytes = reader.readBytes(compressed_size);

    this.debug(`Usmap file compression method is ${EUsmapCompressionMethod[method]}`)

    if (method === 0) data = bytes;
    else if (method === 1) throw new Error('Oodle decompression is not added yet');
    else if (method === 2) data = Buffer.from(decompress(bytes));

    if (data.length != decompressed_size)
      throw new Error('Did not decompress the file correctly');

    this.debug('Decompressed file successfully!');

    return this.deserialize(new Reader(data));
  }

  deserialize(reader) {
    let mappings = {
      enums: {},
      schemas: {}
    }

    let names_count = reader.readUInt32()
    let names = []
    for (var i = 0; i < names_count; i++)
      names[i] = reader.readFString()

    // enums
    let enums_count = reader.readUInt32();
    for (var i = 0; i < enums_count; i++) {
      let data = new Enum(reader, names)
      mappings.enums[data.Name] = data
    }

    // schemas
    let schemas_count = reader.readUInt32();
    for (var i = 0; i < schemas_count; i++) {
      let schema = new Schema(reader, names)
      mappings.schemas[schema.Name] = schema
    }

    return mappings;
  }
};