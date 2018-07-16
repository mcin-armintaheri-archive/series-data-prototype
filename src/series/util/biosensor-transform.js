const R = require("ramda");

function fromBiosensorFormat(json) {
  const { Data } = json;
  const { header, Raw_Signal } = Data;
  const {
    epoch_information,
    recording_information,
    device_information
  } = header;
  const {
    name,
    type,
    company,
    SIN,
    SignalObject_num,
    ...signals
  } = device_information;
  const signalKeys = R.keys(signals);
  return signalKeys;
}

function toBiosensorFormat(json) {
  return json;
}

module.exports.FromBiosensorFormat = fromBiosensorFormat;
module.exports.ToBiosensorFormat = toBiosensorFormat;

const fs = require("fs");
const file = JSON.parse(fs.readFileSync("JSONFile_E4Example_Unix.json"));

console.log(fromBiosensorFormat(file));
