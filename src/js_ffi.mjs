import { readSync } from 'node:fs';
import { Buffer } from 'node:buffer';

const NEW_LINE = '\n'.charCodeAt(0);

function* stdinGenerator() {
  process.stdin.resume();

  let lineBuff = Buffer.allocUnsafe(0);

  try {
    while (true) {
      const readBuff = Buffer.allocUnsafe(1);
      const read = readSync(process.stdin.fd, readBuff, 0, 1);
      if (read === 0) {
        // EOF
        break;
      }
      lineBuff = Buffer.concat([lineBuff, readBuff]);
      if (readBuff[0] === NEW_LINE) {
        yield lineBuff.toString();
        lineBuff = Buffer.allocUnsafe(0);
      }
    }

    if (lineBuff.length > 0) {
      yield lineBuff.toString();
    }
  } catch {
    return [];
  }
}

const stdin = stdinGenerator();

export function read_line(_) {
  const next = stdin.next();
  if (next.done) {
    return null;
  }
  return next.value;
}