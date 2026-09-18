import { Address6 } from "ip-address/ip-address";

export function createContiguousByteMask(totalBytes, startByte, lengthBytes) {
  const mask = new Array(totalBytes).fill("00");
  const safeStart = Math.max(0, Math.min(totalBytes - 1, Number(startByte)));
  const safeLength = Math.max(
    1,
    Math.min(Math.min(4, totalBytes - safeStart), Number(lengthBytes))
  );

  for (let i = safeStart; i < safeStart + safeLength; i++) {
    mask[i] = "ff";
  }

  return mask.join("");
}

export function formatMacMask(maskHex) {
  return maskHex.match(/.{1,4}/g).join(".");
}

export function formatIpv6Mask(maskHex) {
  return maskHex.match(/.{1,4}/g).join(":");
}

export function countTripletsFromHexMask(maskHex) {
  const groups = maskHex.match(/.{1,8}/g) || [];
  return groups.filter((group) => group !== "00000000").length;
}

export function countTripletsFromFormattedMask(mask, separatorPattern) {
  if (!mask) {
    return 0;
  }
  return countTripletsFromHexMask(mask.replace(separatorPattern, ""));
}

export function canonicalIpv6Hex(address) {
  const parsed = new Address6(address.replace(/^\s+|\s+$/g, ""));
  if (!parsed.isValid()) {
    return null;
  }
  return parsed.canonicalForm().replace(/:/g, "").toLowerCase();
}

export function bitwiseAndHex(a, b) {
  let ans = "";
  for (let i = 0; i < a.length; i++) {
    const temp = parseInt("0x" + a.charAt(i), 16) & parseInt("0x" + b.charAt(i), 16);
    ans += temp.toString(16);
  }
  return ans;
}

export function buildTripletsFromHexMask(label, baseOffset, valueHex, maskHex) {
  const strippedMask = maskHex.replace(/^0+/, "");
  if (strippedMask === "") {
    return "";
  }

  let start = maskHex.length - strippedMask.length;
  let offset = baseOffset + Math.floor(start / 2);
  let activeMask = strippedMask.replace(/0+$/, "");

  if (start / 2 !== Math.floor(start / 2)) {
    start -= 1;
    activeMask = "0" + activeMask;
  }

  const valueChunks =
    valueHex.substr(start, activeMask.length).match(/.{1,8}/g) || [];
  const maskChunks = activeMask.match(/.{1,8}/g) || [];
  let ans = "";

  for (let i = 0; i < valueChunks.length; i++) {
    ans +=
      label +
      ": Offset " +
      (offset + i * 4) +
      " Value 0x" +
      bitwiseAndHex(valueChunks[i], maskChunks[i]) +
      " Mask 0x" +
      maskChunks[i] +
      "\n";
  }

  return ans;
}

export function buildLocatorMask(locatorBits) {
  const safeBits = Math.max(0, Math.min(96, Number(locatorBits)));
  if (safeBits % 8 !== 0) {
    return null;
  }
  return formatIpv6Mask(createContiguousByteMask(16, 0, safeBits / 8));
}

export function buildMicroSidMask(locatorBits, usidBits, usidIndex) {
  const safeLocatorBits = Number(locatorBits);
  const safeUsidBits = Number(usidBits);
  const safeIndex = Number(usidIndex);

  if (
    safeLocatorBits % 8 !== 0 ||
    safeUsidBits % 8 !== 0 ||
    safeUsidBits <= 0 ||
    safeUsidBits > 32
  ) {
    return null;
  }

  const startByte = safeLocatorBits / 8 + (safeUsidBits / 8) * safeIndex;
  const lengthBytes = safeUsidBits / 8;

  if (startByte + lengthBytes > 16) {
    return null;
  }

  return formatIpv6Mask(createContiguousByteMask(16, startByte, lengthBytes));
}
