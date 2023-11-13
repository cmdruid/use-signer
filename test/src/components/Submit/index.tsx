import { useState }  from 'react'
import { useSigner } from '@/context/signer'

export default function () {
  const [ text, setText ] = useState('')
  const { generate, unlock, clear } = useSigner()

  const create_signer = () => {
    generate('test', text)
  }

  const unlock_signer = () => {
    unlock('test', text)
  }

  return (
    <div className='container' id='post'>
      <h2>Password</h2>
      <input 
        name        = 'post' 
        type        = 'password'
        placeholder = 'enter password...'
        value       = { text } 
        onChange    = { (e) => setText(e.target.value) }
      />
      <div className='controls'>
        <button onClick={ create_signer }>Generate</button>
        <button onClick={ unlock_signer }>Unlock</button>
        <button onClick={ () => clear() }>Clear</button>
      </div>
      
    </div>
  )
}
