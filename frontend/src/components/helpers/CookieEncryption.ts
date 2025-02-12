import CryptoJS from 'crypto-js';

export const encryptData = (data: string) => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    import.meta.env.VITE_COOKIE_KEY_ENCRYPTION,
  ).toString();
};

export const decryptData = (encryptedData: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(
      encryptedData,
      import.meta.env.VITE_COOKIE_KEY_ENCRYPTION,
    );
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error('failed to decrypt', error);
    return null;
  }
};
