const PropertyData = require('./PropertyData.js')

module.exports = class Property {
  constructor(reader, names) {
    let schema_index = reader.readUInt16()
    let array_size = reader.readUInt8()
    let name = names[reader.readUInt32()]

    this.Name = name
    this.SchemaIndex = schema_index
    this.ArraySize = array_size // i have never seen this a number other than 1 in here

    this.Data = new PropertyData(reader, names)
  }
};