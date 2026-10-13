/**
 * Minimal QR Code generator, no dependencies.
 *
 * Scope is deliberately narrow: byte mode (UTF-8), error correction level M,
 * versions 1-6 (up to 106 bytes), which is enough for a short result URL.
 * Anything longer returns null and the caller is expected to skip the code.
 *
 *   const qr = makeQR('https://example.com');   // { size, modules[y][x] } | null
 *
 * The tables below are the version 1-6 / level M rows of the QR spec (ISO 18004).
 */

const ECC_CODEWORDS_PER_BLOCK = [10, 16, 26, 18, 24, 16];
const BLOCK_COUNT = [1, 1, 1, 2, 2, 4];
const TOTAL_CODEWORDS = [26, 44, 70, 100, 134, 172];
const ALIGNMENT_POSITIONS = [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34]];

// Multiplication in GF(256) with the QR polynomial 0x11d.
function gfMultiply(x, y) {
  let product = 0;
  for (let i = 7; i >= 0; i--) {
    product = (product << 1) ^ ((product >>> 7) * 0x11d);
    product ^= ((y >>> i) & 1) * x;
  }
  return product;
}

function reedSolomonDivisor(degree) {
  const result = new Array(degree).fill(0);
  result[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < result.length; j++) {
      result[j] = gfMultiply(result[j], root);
      if (j + 1 < result.length) result[j] ^= result[j + 1];
    }
    root = gfMultiply(root, 2);
  }
  return result;
}

function reedSolomonRemainder(data, divisor) {
  const result = divisor.map(() => 0);
  for (const byte of data) {
    const factor = byte ^ result.shift();
    result.push(0);
    divisor.forEach((coefficient, i) => { result[i] ^= gfMultiply(coefficient, factor); });
  }
  return result;
}

function dataCapacity(version) {
  return TOTAL_CODEWORDS[version - 1] - ECC_CODEWORDS_PER_BLOCK[version - 1] * BLOCK_COUNT[version - 1];
}

// Encodes the payload, pads it, splits it into blocks, appends Reed-Solomon ECC
// and interleaves the blocks into the final codeword stream.
function buildCodewords(bytes, version) {
  const capacityBits = dataCapacity(version) * 8;
  const bits = [];
  const pushBits = (value, count) => {
    for (let i = count - 1; i >= 0; i--) bits.push((value >>> i) & 1);
  };

  pushBits(0b0100, 4);                       // byte mode indicator
  pushBits(bytes.length, 8);                 // character count (8 bits for versions 1-9)
  bytes.forEach(byte => pushBits(byte, 8));
  pushBits(0, Math.min(4, capacityBits - bits.length));   // terminator
  while (bits.length % 8) bits.push(0);
  for (let pad = 0xec; bits.length < capacityBits; pad ^= 0xec ^ 0x11) pushBits(pad, 8);

  const data = [];
  for (let i = 0; i < bits.length; i += 8) {
    data.push(bits.slice(i, i + 8).reduce((acc, bit) => (acc << 1) | bit, 0));
  }

  const blockCount = BLOCK_COUNT[version - 1];
  const eccLength = ECC_CODEWORDS_PER_BLOCK[version - 1];
  const totalCodewords = TOTAL_CODEWORDS[version - 1];
  const shortBlockCount = blockCount - (totalCodewords % blockCount);
  const shortBlockLength = Math.floor(totalCodewords / blockCount);
  const divisor = reedSolomonDivisor(eccLength);

  const blocks = [];
  for (let i = 0, offset = 0; i < blockCount; i++) {
    const length = shortBlockLength - eccLength + (i < shortBlockCount ? 0 : 1);
    const blockData = data.slice(offset, offset + length);
    offset += length;
    const ecc = reedSolomonRemainder(blockData, divisor);
    if (i < shortBlockCount) blockData.push(0);   // placeholder, skipped when interleaving
    blocks.push(blockData.concat(ecc));
  }

  const interleaved = [];
  for (let i = 0; i < blocks[0].length; i++) {
    blocks.forEach((block, j) => {
      if (i !== shortBlockLength - eccLength || j >= shortBlockCount) interleaved.push(block[i]);
    });
  }
  return interleaved;
}

const MASK_PATTERNS = [
  (x, y) => (x + y) % 2 === 0,
  (x, y) => y % 2 === 0,
  (x, y) => x % 3 === 0,
  (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
  (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
  (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0
];

export function makeQR(text) {
  const bytes = Array.from(new TextEncoder().encode(String(text)));

  // Smallest version that fits; the 2 bytes reserved are the mode + length header.
  let version = 0;
  for (let v = 1; v <= 6; v++) {
    if (bytes.length <= dataCapacity(v) - 2) { version = v; break; }
  }
  if (!version) return null;

  const size = version * 4 + 17;
  const modules = Array.from({ length: size }, () => new Array(size).fill(false));
  const isFunctionModule = Array.from({ length: size }, () => new Array(size).fill(false));
  const setFunctionModule = (x, y, dark) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    modules[y][x] = dark;
    isFunctionModule[y][x] = true;
  };

  // Timing patterns
  for (let i = 0; i < size; i++) {
    setFunctionModule(6, i, i % 2 === 0);
    setFunctionModule(i, 6, i % 2 === 0);
  }

  // Finder patterns, drawn with their separator ring
  const drawFinder = (cx, cy) => {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const distance = Math.max(Math.abs(dx), Math.abs(dy));
        setFunctionModule(cx + dx, cy + dy, distance !== 2 && distance !== 4);
      }
    }
  };
  drawFinder(3, 3);
  drawFinder(size - 4, 3);
  drawFinder(3, size - 4);

  // Alignment patterns (skipped where they would overlap a finder)
  const alignment = ALIGNMENT_POSITIONS[version - 1];
  alignment.forEach((ax, i) => alignment.forEach((ay, j) => {
    const overlapsFinder = (i === 0 && j === 0)
      || (i === 0 && j === alignment.length - 1)
      || (i === alignment.length - 1 && j === 0);
    if (overlapsFinder) return;
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        setFunctionModule(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
      }
    }
  }));

  // Format information: 2 bits of ECC level (M = 00) + 3 bits of mask, BCH(15,5)
  const drawFormatBits = mask => {
    const data = (0 << 3) | mask;
    let remainder = data;
    for (let i = 0; i < 10; i++) remainder = (remainder << 1) ^ ((remainder >>> 9) * 0x537);
    const bits = ((data << 10) | remainder) ^ 0x5412;
    const bit = i => ((bits >>> i) & 1) !== 0;

    for (let i = 0; i <= 5; i++) setFunctionModule(8, i, bit(i));
    setFunctionModule(8, 7, bit(6));
    setFunctionModule(8, 8, bit(7));
    setFunctionModule(7, 8, bit(8));
    for (let i = 9; i < 15; i++) setFunctionModule(14 - i, 8, bit(i));
    for (let i = 0; i < 8; i++) setFunctionModule(size - 1 - i, 8, bit(i));
    for (let i = 8; i < 15; i++) setFunctionModule(8, size - 15 + i, bit(i));
    setFunctionModule(8, size - 8, true);   // the always-dark module
  };
  drawFormatBits(0);

  // Place codeword bits in the zigzag order, two columns at a time from the right
  const codewords = buildCodewords(bytes, version);
  let bitIndex = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;   // the vertical timing column is skipped
    for (let vertical = 0; vertical < size; vertical++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const y = ((right + 1) & 2) === 0 ? size - 1 - vertical : vertical;
        if (!isFunctionModule[y][x] && bitIndex < codewords.length * 8) {
          modules[y][x] = ((codewords[bitIndex >>> 3] >>> (7 - (bitIndex & 7))) & 1) !== 0;
          bitIndex++;
        }
      }
    }
  }

  // Masking is an involution: applying the same mask twice restores the grid.
  const applyMask = mask => {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (!isFunctionModule[y][x] && MASK_PATTERNS[mask](x, y)) modules[y][x] = !modules[y][x];
      }
    }
  };

  // Simplified penalty score: runs, 2x2 blocks and dark/light balance. The
  // finder-like-pattern rule is omitted; every mask still yields a valid code.
  const penaltyScore = () => {
    let score = 0;
    for (let pass = 0; pass < 2; pass++) {
      for (let a = 0; a < size; a++) {
        let run = 1;
        for (let b = 1; b < size; b++) {
          const current = pass ? modules[b][a] : modules[a][b];
          const previous = pass ? modules[b - 1][a] : modules[a][b - 1];
          if (current === previous) {
            run++;
            if (run === 5) score += 3;
            else if (run > 5) score++;
          } else {
            run = 1;
          }
        }
      }
    }
    for (let y = 0; y < size - 1; y++) {
      for (let x = 0; x < size - 1; x++) {
        const color = modules[y][x];
        if (color === modules[y][x + 1] && color === modules[y + 1][x] && color === modules[y + 1][x + 1]) score += 3;
      }
    }
    const darkCount = modules.reduce((sum, row) => sum + row.filter(Boolean).length, 0);
    score += Math.floor(Math.abs(darkCount * 20 - size * size * 10) / (size * size)) * 10;
    return score;
  };

  let bestMask = 0;
  let bestScore = Infinity;
  for (let mask = 0; mask < 8; mask++) {
    applyMask(mask);
    drawFormatBits(mask);
    const score = penaltyScore();
    if (score < bestScore) {
      bestScore = score;
      bestMask = mask;
    }
    applyMask(mask);
  }
  applyMask(bestMask);
  drawFormatBits(bestMask);

  return { size, modules };
}
