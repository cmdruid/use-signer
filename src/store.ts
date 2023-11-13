import { useReducer }  from 'react'
import useSessionStore from './session.js'

// We can strictly type our dispatch actions here.
export type Action<T> =
  | { type: 'reset',  payload: T          }
  | { type: 'update', payload: Partial<T> }

export function initStore<T> (
  defaults     : T,
  session_key ?: string
) {
  /**
   * Create a reducer store with custom hooks, then
   * return it along with our Store API.
   */
  let cacher : (value: T) => void | undefined,
      data   : T = defaults

  if (session_key !== undefined) {
    const [ session, setSession ] = useSessionStore(session_key, defaults)
    cacher = setSession
    data   = session
  }

  function reducer (
    store  : T,
    action : Action<T>
  ) : T {
    const { type, payload } = action
    switch (type) {
      case 'reset':
        if (cacher !== undefined) {
          cacher(payload)
        }
        return payload
      case 'update':
        const new_store = { ...store, ...payload }
        if (cacher !== undefined) {
          cacher(new_store)
        }
        return new_store
      default:
        throw new Error(`Invalid action: ${String(type)}`)
    }
  }

  const [ store, dispatch ] = useReducer(reducer, data)

  function reset (store : Partial<T> = {}) {
    const payload = { ...defaults, ...store }
    dispatch({ type: 'reset', payload })
  }

  function update (store : Partial<T>) {
    dispatch({ type: 'update', payload: store })
  }

  return {
    reset,
    store,
    update
  }
}
