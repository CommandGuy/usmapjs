module.exports = class Enum {
  constructor(reader, names) {
    let index = reader.readUInt32()

    this.Name = names[index]

    this.Values = []
    let values_count = reader.readUInt8()
    for (var i = 0; i < values_count; i++)
      this.Values[i] = names[reader.readUInt32()]
  }
};