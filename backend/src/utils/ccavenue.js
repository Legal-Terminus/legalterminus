import crypto from 'crypto';

/**
 * CCAvenue uses AES-128-CBC encryption.
 * Key  = MD5 hash of the Working Key (produces 16 bytes).
 * IV   = 16 zero bytes (CCAvenue standard).
 */
function getKeyAndIV(workingKey) {
  const key = crypto.createHash('md5').update(workingKey).digest();
  const iv = Buffer.alloc(16, 0);
  return { key, iv };
}

/**
 * Encrypt a plain-text string for CCAvenue.
 * @param {string} plainText  – URL-encoded parameter string
 * @param {string} workingKey – your CCAvenue Working Key
 * @returns {string} hex-encoded cipher text
 */
export function encrypt(plainText, workingKey) {
  const { key, iv } = getKeyAndIV(workingKey);
  const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

/**
 * Decrypt a CCAvenue response string.
 * @param {string} encText    – hex-encoded cipher text from CCAvenue
 * @param {string} workingKey – your CCAvenue Working Key
 * @returns {string} decrypted URL-encoded parameter string
 */
export function decrypt(encText, workingKey) {
  const { key, iv } = getKeyAndIV(workingKey);
  const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
  let decrypted = decipher.update(encText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
