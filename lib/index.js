const { UsmapPropertyData } = require('./classes.js');
const { CompressedMethod } = require('./enums.js');
const decompress = require('brotli/decompress');
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

    let version = reader.readByteInt();
    if (version != 0)
      throw new Error(`Unsupported usmap version: ${version}`);

    let method = reader.readByteInt();
    if (method < 0 || method > 2)
      throw new Error(`Invalid usmap compression method: ${method}`);

    let compressed_size = reader.readUInt32();
    let decompressed_size = reader.readUInt32();

    let data = Buffer.alloc(decompressed_size);
    let bytes = reader.readBytes(compressed_size);

    this.debug(`Usmap file compression method is ${CompressedMethod[method]}`)

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

    let names_size = reader.readUInt32();
    let names = []
    for (var i = 0; i < names_size; i++)
      names[i] = reader.readFString()

    // enums
    let enums_count = reader.readUInt32();
    for (var i = 0; i < enums_count; i++) {
      let name = names[reader.readUInt32()];

      let values_count = reader.readUInt8();
      let values = []
      for (var idx = 0; idx < values_count; idx++)
        values[idx] = names[reader.readUInt32()];

      mappings.enums[name] = values;
    }

    // schemas
    let schemas_count = reader.readUInt32();
    for (var i = 0; i < schemas_count; i++) {
      let name = names[reader.readUInt32()];
      let super_index = reader.readUInt32();
      let prop_count = reader.readUInt16();

      let serializable_count = reader.readUInt16();
      let props = []
      for (var idx = 0; idx < serializable_count; idx++) {
        let schema_index = reader.readUInt16();
        let array_size = reader.readByteInt();
        let name = names[reader.readUInt32()];
        props[idx] = new UsmapPropertyData(reader, names)
      }

      mappings.schemas[name] = {
        Name: name,
        SuperIndex: super_index,
        PropertyCount: prop_count,
        Properties: props
      }
    }

    return mappings;
  }
};