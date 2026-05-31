import crypto from 'crypto';

/**
 * Builds the X-VERIFY header value required by PhonePe.
 *
 * Formula: SHA256(base64Payload + apiEndpoint + saltKey) + "###" + saltIndex
 *
 * @param {string} base64Payload  - Base64-encoded JSON request body
 * @param {string} apiEndpoint    - e.g. "/pg/v1/pay"
 * @param {string} saltKey        - PhonePe salt key from env
 * @param {string|number} saltIndex - PhonePe salt index from env
 * @returns {string}
 */
export function buildXVerify(base64Payload, apiEndpoint, saltKey, saltIndex) {
  const hash = crypto
    .createHash('sha256')
    .update(base64Payload + apiEndpoint + saltKey)
    .digest('hex');
  return `${hash}###${saltIndex}`;
}

/**
 * Verifies the X-VERIFY header on a PhonePe callback/redirect POST.
 *
 * @param {string} base64Response - Base64-encoded response body from PhonePe
 * @param {string} xVerifyHeader  - The X-VERIFY header value received
 * @param {string} saltKey
 * @param {string|number} saltIndex
 * @returns {boolean}
 */
export function verifyXVerify(base64Response, xVerifyHeader, saltKey, saltIndex) {
  const hash = crypto
    .createHash('sha256')
    .update(base64Response + saltKey)
    .digest('hex');
  const expected = `${hash}###${saltIndex}`;
  return expected === xVerifyHeader;
}
