import { Buff }      from '@cmdcode/buff'
import { hash340 }   from '@cmdcode/crypto-tools/hash'
import { useState }  from 'react'
import { initStore } from './store.js'

import {
  decrypt,
  encrypt
} from './cipher.js'

import {
  Signer,
  SignerConfig
} from '@scrow/core'

import {
  SessionEntry,
  SignerStore
} from './types.js'

import * as importer from './importer.js'

export const session_key = 'signer'

type StoreAPI  = ReturnType<typeof initStore<SignerStore>>
type SignerAPI = Signer 

export function initSigner (reducer : StoreAPI) {
  const { store, update, reset } = reducer
  const { init_key, sessions } = store
  const [ signer, setSigner ]  = useState<SignerAPI | null>(null)

  const gen_words = importer.gen_words
  
  const get_id = (pass : string) => {
    const preimg = Buff.json([ session_key, init_key, pass ])
    return hash340('signer/id', preimg).hex
  }

  const close_key = () => {
    void setSigner(null)
  }

  const clear_all = () => {
    close_key()
    void reset()
  }

  const create_key = async (
    pass   : string,
    seckey : string,
    config : SignerConfig = {}
  ) => {
    const id = get_id(pass)
    if (get_session(id, sessions) !== undefined) {
      throw new Error('session already exists: ' + id)
    }
    const encrypted = await encrypt_session(seckey, config, pass, session_key, init_key)
    const created   = new Signer(seckey, config)
    setSigner(created)
    update({ sessions : [ ...store.sessions, [ id, encrypted ] ] })
    return created
  }

  const import_key = (
    pass    : string,
    config ?: SignerConfig
  ) => {
    return {
      from_bip39 : (words : string | string[], password ?: string) => {
        const { seckey, hd_code } = importer.from_bip39(words, password)
        config = { ...config, hd_code }
        return create_key(pass, seckey.hex, config)
      },
      from_phrase : (phrase : string) => {
        const { seckey, hd_code } = importer.from_phrase(phrase)
        config = { ...config, hd_code }
        return create_key(pass, seckey.hex, config)
      },
      from_seed : (seed : string) => {
        const { seckey, hd_code } = importer.from_seed(seed)
        config = { ...config, hd_code }
        return create_key(pass, seckey.hex, config)
      },
      from_xprv : (xprv : string) => {
        const { seckey, hd_code } = importer.from_xprv(xprv)
        config = { ...config, hd_code }
        return create_key(pass, seckey.hex, config)
      }
    }
  }

  const remove_key = async (id : string) => {
    const updated = rem_session(id, sessions)
    update({ sessions : updated })
  }

  const load_key = async (pass : string) => {
    const id   = get_id(pass)
    const data = get_session(id, sessions)
    if (data === undefined) {
      throw new Error('session not found for id: ' + id)
    }
    const selected = await decrypt_session(pass, data[1], session_key, init_key)
    setSigner(selected)
    return selected
  }

  return {
    store : {
      clear  : clear_all,
      close  : close_key,
      create : create_key,
      data   : store,
      import : import_key,
      load   : load_key,
      remove : remove_key
    },
    gen_words,
    get_id,
    sessions,
    signer
  }
}

async function encrypt_session (
  seckey   : string,
  config   : SignerConfig,
  pass     : string,
  sess_key : string,
  init_key : string
) {
  const session = JSON.stringify([ seckey, config ])
  const vector  = Buff.random(32).hex
  const stamp   = Math.floor(Date.now() / 1000).toString()
  const preimg  = Buff.json([ sess_key, init_key, pass, stamp ])
  const secret  = hash340('signer/key', preimg)
  const payload = await encrypt(session, secret, vector)
  return `${payload}?iv=${vector}&stamp=${stamp}`
}

async function decrypt_session (
  pass     : string,
  payload  : string,
  sess_key : string,
  init_key : string
) {
  const { encrypted, iv, stamp } = parse_payload(payload)
  const preimg    = Buff.json([ sess_key, init_key, pass, stamp ])
  const secret    = hash340('signer/key', preimg)
  const decrypted = await decrypt(encrypted, secret, iv) 
  try {
    const [ secret, config ] = JSON.parse(decrypted)
    return new Signer(secret, config)
  } catch (err) {
    throw new Error('failed to parse decrypted data')
  }
}

function parse_payload (payload : string) {
  if (!payload.includes('?')) {
    throw new Error('payload missing query string')
  }

  const [ encrypted, query ] = payload.split('?')
  const parsed = new URLSearchParams(query)
  const params = Object.fromEntries(parsed.entries())
  const { iv, stamp } = params

  if (typeof iv !== 'string') {
    throw new Error('iv is missing from payload')
  }

  if (typeof stamp !== 'string') {
    throw new Error('stamp is missing from payload')
  }

  return { encrypted, iv, stamp }
}

function get_session (
  hash_id : string,
  entries : SessionEntry[]
) {
  return entries.find(e => e[0] === hash_id)
}

function rem_session (
  hash_id : string,
  entries : SessionEntry[]
) {
  const ent = [ ...entries ]
  const idx = ent.findIndex(e => e[0] === hash_id)
  if (idx !== -1) {
    ent.splice(idx, 1)
  }
  return ent
}