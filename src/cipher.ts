import { Buff, Bytes } from '@cmdcode/buff'

// Attempt to import the crypto library from somewhere.
const { subtle } = globalThis?.crypto ?? crypto ?? window?.crypto

if (
  typeof subtle === 'undefined'  ||
  subtle.importKey === undefined ||
  subtle.encrypt   === undefined ||
  subtle.decrypt   === undefined
) {
  throw new Error('Subtle crypto library not found on this device!')
}

async function get_key (secret : Bytes) {
  /** Derive a CryptoKey object (for Webcrypto library). */
  const key     = Buff.bytes(secret)
  const options = { name: 'AES-GCM' }
  const usage   = [ 'encrypt', 'decrypt' ] as KeyUsage[]
  return subtle.importKey('raw', key, options, true, usage)
}

export async function encrypt (
  message : string,
  secret  : Bytes,
  vector ?: Bytes
) {
  /** Encrypt a message using a CryptoKey object. */
  const key = await get_key(secret)
  const msg = Buff.str(message)
  const iv  = (vector !== undefined)
    ? Buff.bytes(vector)
    : Buff.random(32)
  const opt = { name: 'AES-GCM', iv }
  return subtle.encrypt(opt, key, msg)
    .then((bytes) => Buff.bytes(bytes).b64url)
}

export async function decrypt (
  encoded : string,
  secret  : Bytes,
  vector  : Bytes
) {
  /** Decrypt an encrypted message using a CryptoKey object. */
  const key = await get_key(secret)
  const msg = Buff.b64url(encoded)
  const opt = { name: 'AES-GCM', iv : Buff.bytes(vector) }
  return subtle.decrypt(opt, key, msg)
    .then(decoded => Buff.bytes(decoded).str)
}
