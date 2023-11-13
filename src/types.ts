export type SessionEntry = [ id : string, session : string ]

export interface SignerStore {
  init_key : string 
  sessions : SessionEntry[]
}
