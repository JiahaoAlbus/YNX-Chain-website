const HRP = "ynx";
const CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
const REVERSE = Object.freeze(Object.fromEntries([...CHARSET].map((character, index) => [character, index])));

export function toYNXAddress(value) {
  const canonical = toEVMAddress(value);
  const payload = decodeHex(canonical);
  const data = convertBits(payload, 8, 5, true);
  const expanded = expandHRP(HRP).concat(data, [0, 0, 0, 0, 0, 0]);
  const checksum = polymod(expanded) ^ 1;
  const checksumValues = Array.from({ length: 6 }, (_, index) => (checksum >>> (5 * (5 - index))) & 31);
  return `${HRP}1${data.concat(checksumValues).map((item) => CHARSET[item]).join("")}`;
}

export function toEVMAddress(value) {
  if (typeof value !== "string") throw new Error("Address must be text.");
  value = value.trim();
  if (!value.toLowerCase().startsWith(`${HRP}1`)) {
    return `0x${decodeHex(value).map((item) => item.toString(16).padStart(2, "0")).join("")}`;
  }
  if (value.length > 90) throw new Error("YNX address is too long.");
  if (value !== value.toLowerCase() && value !== value.toUpperCase()) throw new Error("YNX address cannot mix uppercase and lowercase.");
  value = value.toLowerCase();
  const separator = value.lastIndexOf("1");
  if (separator <= 0 || separator + 7 > value.length) throw new Error("YNX address has an invalid separator or checksum length.");
  if (value.slice(0, separator) !== HRP) throw new Error("YNX address must start with ynx1.");
  const data = [...value.slice(separator + 1)].map((character) => {
    const decoded = REVERSE[character];
    if (decoded === undefined) throw new Error("YNX address contains an invalid character.");
    return decoded;
  });
  if (polymod(expandHRP(HRP).concat(data)) !== 1) throw new Error("YNX address checksum is invalid.");
  const payload = convertBits(data.slice(0, -6), 5, 8, false);
  if (payload.length !== 20) throw new Error("YNX address must identify exactly 20 account bytes.");
  return `0x${payload.map((item) => item.toString(16).padStart(2, "0")).join("")}`;
}

export function normalizeAddress(value) {
  const evmAddress = toEVMAddress(value);
  return Object.freeze({ evmAddress, ynxAddress: toYNXAddress(evmAddress) });
}

function decodeHex(value) {
  if (typeof value !== "string" || !/^0x[0-9a-f]{40}$/i.test(value.trim())) {
    throw new Error("Enter a 0x address with 40 hex characters or a checksummed ynx1 address.");
  }
  const hex = value.trim().slice(2).toLowerCase();
  return Array.from({ length: 20 }, (_, index) => Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16));
}

function convertBits(data, fromBits, toBits, pad) {
  let accumulator = 0;
  let bits = 0;
  const result = [];
  const maxValue = (1 << toBits) - 1;
  const maxAccumulator = (1 << (fromBits + toBits - 1)) - 1;
  for (const value of data) {
    if (value < 0 || value >> fromBits !== 0) throw new Error("Address payload is invalid.");
    accumulator = ((accumulator << fromBits) | value) & maxAccumulator;
    bits += fromBits;
    while (bits >= toBits) {
      bits -= toBits;
      result.push((accumulator >> bits) & maxValue);
    }
  }
  if (pad && bits > 0) result.push((accumulator << (toBits - bits)) & maxValue);
  if (!pad && (bits >= fromBits || ((accumulator << (toBits - bits)) & maxValue) !== 0)) throw new Error("YNX address padding is invalid.");
  return result;
}

function expandHRP(hrp) {
  return [...hrp].map((character) => character.charCodeAt(0) >> 5)
    .concat([0], [...hrp].map((character) => character.charCodeAt(0) & 31));
}

function polymod(values) {
  const generators = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
  let checksum = 1;
  for (const value of values) {
    const top = checksum >>> 25;
    checksum = (((checksum & 0x1ffffff) << 5) ^ value) >>> 0;
    generators.forEach((generator, index) => {
      if ((top >>> index) & 1) checksum = (checksum ^ generator) >>> 0;
    });
  }
  return checksum >>> 0;
}
