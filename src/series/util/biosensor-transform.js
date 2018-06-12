function fromBiosensorFormat(json) {
  return json;
}

function toBiosensorFormat(json) {
  return json;
}

module.exports.FromBiosensorFormat = fromBiosensorFormat;
module.exports.ToBiosensorFormat = toBiosensorFormat;

const fs = require("fs");
const file = JSON.parse(fs.readFileSync("JSONFile_E4Example_Unix.json"));

console.log(fromBiosensorFormat(file));
