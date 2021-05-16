const Property = require('./Property.js')

module.exports = class Schema {
  constructor(reader, names) {
    let index = reader.readUInt32()
    let super_index = reader.readUInt32()

    this.Name = names[index]
    this.SuperType = super_index === 0xFFFFFFFF ? null : names[super_index]
    this.SuperIndex = super_index
    this.PropertyCount = reader.readUInt16()

    this.Properties = []
    let serializable_count = reader.readUInt16();
    for (var i = 0; i < serializable_count; i++)
      this.Properties[i] = new Property(reader, names)
  }
};