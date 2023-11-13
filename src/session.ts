import { useState } from 'react'

export default function useSessionStore <T> (
  key: string, defaults: T
) : [ T, (value: T) => void ] {
  // Fetch from session storage and parse it as JSON. 
  // If it doesn't exist or parsing fails, use defaultValue.
  const get_init_value = () => {
    const stored_value = sessionStorage.getItem(key);
    
    if (
      stored_value === undefined ||
      stored_value === null
    ) return defaults
    
    try {
      return JSON.parse(stored_value) as T
    } catch (err) {
      throw new Error('failed to parse value from key: ' + key)
    }
  }

  const [ session, setValue ] = useState<T>(get_init_value)

  // Update session storage when the stored value is updated.
  const setSession = (value: T) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const value_to_store = value instanceof Function
        ? value(session)
        : value
      // Save state
      setValue(value_to_store)
      // Save to session storage
      sessionStorage.setItem(key, JSON.stringify(value_to_store))
    } catch (err) {
      // A more advanced implementation would handle the error case
      throw new Error('failed to serialize data to session store: ' + String(value))
    }
  }

  return [ session, setSession ]
}
