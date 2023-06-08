import { CipherKey, createDecipheriv } from "crypto";
import { deserialize } from "v8";

interface Decrypt {
  (algorithm: string, key: CipherKey, hash: string): Buffer;
}

export const decrypt: Decrypt = (algorithm, key, hash) => {
  const decipher = createDecipheriv(algorithm, key, Buffer.alloc(16, 0));
  try {
    const decrpyted = Buffer.concat([
      decipher.update(Buffer.from(hash, "hex")),
      decipher.final(),
    ]);
    return deserialize(decrpyted);
  } catch (error) {
    return null;
  }
};
