const EUsmapPropertyType = require('../enums/EUsmapPropertyType.js')

module.exports = class PropertyData {
  constructor(reader, names) {
    let prop_type = reader.readUInt8();
    this.Type = EUsmapPropertyType[prop_type] || EUsmapPropertyType[255];

    if (this.Type === 'StructProperty')
      this.StructName = names[reader.readUInt32()]

    if (this.Type === 'EnumProperty') {
      this.InnerType = new PropertyData(reader, names)
      this.EnumName = names[reader.readUInt32()]
    }

    if (this.Type === 'ArrayProperty')
      this.InnerType = new PropertyData(reader, names)

    if (this.Type === 'SetProperty')
      this.InnerType = new PropertyData(reader, names)

    if (this.Type === 'MapProperty') {
      this.InnerType = new PropertyData(reader, names)
      this.ValueType = new PropertyData(reader, names)
    }
  }
}