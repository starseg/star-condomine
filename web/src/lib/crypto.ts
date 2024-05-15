const key = Number(process.env.NEXT_PUBLIC_CRYPTO_KEY);

export function encrypt(value: number): string {
  const encryptedValue = (value + key) * 8 - 69;
  return encryptedValue.toString();
}

export function decrypt(encryptedText: string): number {
  const encryptedNumber = parseInt(encryptedText, 10);
  const decryptedNumber = (encryptedNumber + 69) / 8 - key;
  return decryptedNumber;
}
