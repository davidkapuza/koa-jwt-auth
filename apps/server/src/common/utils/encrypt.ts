import { CipherKey, createCipheriv } from "crypto";
import { serialize } from "v8";

interface Encrypt {
  (algorithm: string, key: CipherKey, data: unknown): string;
}

export const encrypt: Encrypt = (algorithm, key, data) => {
  const cipher = createCipheriv(algorithm, key, Buffer.alloc(16, 0));

  const encrypted = Buffer.concat([
    cipher.update(serialize(data)),
    cipher.final(),
  ]);

  return encrypted.toString("hex");
};
