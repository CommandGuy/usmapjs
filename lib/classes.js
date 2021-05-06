const { EUsmapPropertyType } = require('./enums.js')

exports.UsmapPropertyData = class {
  constructor(reader, names, name) {
    if (name != null ) this.Name = name;
    
    let prop_type = reader.readByteInt();
    this.Type = EUsmapPropertyType[prop_type] || EUsmapPropertyType[255];

    if (this.Type === 'StructProperty')
      this.StructName = names[reader.readUInt32()]

    if (this.Type === 'EnumProperty') {
      this.InnerType = new exports.UsmapPropertyData(reader, names)
      this.EnumName = names[reader.readUInt32()]
    }

    if (this.Type === 'ArrayProperty')
      this.InnerType = new exports.UsmapPropertyData(reader, names)

    if (this.Type === 'SetProperty')
      this.InnerType = new exports.UsmapPropertyData(reader, names)

    if (this.Type === 'MapProperty') {
      this.InnerType = new exports.UsmapPropertyData(reader, names)
      this.ValueType = new exports.UsmapPropertyData(reader, names)
    }
  }
}