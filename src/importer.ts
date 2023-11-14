import * as bip39      from '@scure/bip39'
import { wordlist }    from '@scure/bip39/wordlists/english'
import { Buff, Bytes } from '@cmdcode/buff'

import {
  derive_extkey,
  derive_seed,
} from '@cmdcode/crypto-tools/hd'

import * as assert from './assert.js'

export function gen_words () {
  return bip39.generateMnemonic(wordlist, 256).split(' ')
}

export function from_phrase (
  phrase : string
) {
  const seed = Buff.str(phrase).digest
  return from_seed(seed)
}

export function from_seed (
  seed : Bytes
) {
  const hd = derive_seed("m/84'/0'/0'/0", seed)
  assert.ok(hd.seckey !== null)
  return { seckey : hd.seckey, hd_code : hd.code }
}

export function from_xprv (
  xprv  : string,
  path ?: string
) {
  const hd = derive_extkey(xprv, path)
  assert.ok(hd.seckey !== null)
  return { seckey : hd.seckey, hd_code : hd.code }
}

export function from_bip39 (
  phrase    : string | string[],
  password ?: string
) {
  if (Array.isArray(phrase)) {
    phrase = phrase.join(' ')
  }
  bip39.validateMnemonic(phrase, wordlist)
  const seed = bip39.mnemonicToSeedSync(phrase, password)
  return from_seed(seed)
}
