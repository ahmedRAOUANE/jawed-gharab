import crypto from 'crypto';

// Get the key from environment
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
if (!ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY is not set in environment variables');
}

// Decode the base64 key (must be exactly 32 bytes)
const KEY = Buffer.from(ENCRYPTION_KEY, 'base64');
if (KEY.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be a 32-byte (256-bit) key encoded in base64');
}

// Algorithm: AES-256-GCM
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;          // recommended for GCM
const TAG_LENGTH = 16;         // authentication tag length in bytes

/**
 * Encrypts a plaintext string.
 * @param {string} text - The text to encrypt.
 * @returns {string} - Base64 encoded string in the format: "iv:authTag:encrypted"
 */
export function encrypt(text: string) {
    try {
        // Generate a random IV
        const iv = crypto.randomBytes(IV_LENGTH);

        // Create cipher
        const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv, { authTagLength: TAG_LENGTH });

        // Encrypt the plaintext (utf8 input, output as buffer)
        const encrypted = Buffer.concat([
            cipher.update(text, 'utf8'),
            cipher.final()
        ]);

        // Get the authentication tag
        const authTag = cipher.getAuthTag();

        // Return combined data as base64 with separators
        return [
            iv.toString('base64'),
            authTag.toString('base64'),
            encrypted.toString('base64')
        ].join(':');
    } catch (error) {
        console.log("lib/cripto/encrypt > enctyption falied: ", error);
        throw new Error(`Encryption failed`);
    }
}

/**
 * Decrypts a ciphertext string produced by encrypt().
 * @param {string} payload - The combined payload (iv:authTag:encrypted) in base64.
 * @returns {string} - The original plaintext.
 */
export function decrypt(payload: string) {
    try {
        // Split the payload
        const parts = payload.split(':');
        if (parts.length !== 3) {
            throw new Error('Invalid payload format: expected iv:authTag:encrypted');
        }

        const [ivBase64, authTagBase64, encryptedBase64] = parts;

        // Decode the components
        const iv = Buffer.from(ivBase64, 'base64');
        const authTag = Buffer.from(authTagBase64, 'base64');
        const encrypted = Buffer.from(encryptedBase64, 'base64');

        // Validate IV length
        if (iv.length !== IV_LENGTH) {
            throw new Error(`Invalid IV length: expected ${IV_LENGTH} bytes`);
        }

        // Create decipher
        const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv, { authTagLength: TAG_LENGTH });
        decipher.setAuthTag(authTag);

        // Decrypt
        const decrypted = Buffer.concat([
            decipher.update(encrypted),
            decipher.final()
        ]);

        return decrypted.toString('utf8');
    } catch (error) {
        console.log("lib/cripto/decrypt > enctyption falied: ", error);
        throw new Error(`Decryption failed`);
    }
}