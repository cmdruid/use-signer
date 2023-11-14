import { useState }  from 'react'
import { useSigner } from '@/context/signer'

export default function () {
  const [ input, setInput ] = useState('')
  const [ pass,  setPass  ] = useState('')
  const [ words, setWords ] = useState<string[]>([])

  const { gen_words, store } = useSigner()

  const generate = () => {
    store.import(pass).from_bip39(words)
    setWords(gen_words())
  }

  return (
    <>
      <div className='container'>
        <h2>Unlock</h2>
        <input 
          name        = 'pass' 
          type        = 'password'
          placeholder = 'enter password...'
          value       = { pass } 
          onChange    = { (e) => setPass(e.target.value) }
        />
        <div className='controls'>
          <button onClick={ () => store.load(pass) }>Unlock</button>
        </div>
      </div>

      <div className='container'>

        <h2>Generate</h2>
        <input 
          name        = 'pass' 
          type        = 'password'
          placeholder = 'enter password...'
          value       = { pass } 
          onChange    = { (e) => setPass(e.target.value) }
        />
        <div id='words'>{words.map(e => <span key={e}>{e}</span>)}</div>
        <div className='controls'>
          <button onClick={ () => setWords(gen_words()) }>Gen Words</button>
          <button onClick={ () => generate() }>Create</button>
        </div>
      </div>

      <div className='container'>

        <h2>Import</h2>
        <input 
          name        = 'pass' 
          type        = 'password'
          placeholder = 'enter password...'
          value       = { pass } 
          onChange    = { (e) => setPass(e.target.value) }
        />
        <input 
          name        = 'seed' 
          type        = 'text'
          placeholder = 'enter data...'
          value       = { input } 
          onChange    = { (e) => setInput(e.target.value) }
        />
        <div className='controls'>
          <button onClick={ () => store.import(pass).from_phrase(input) }>Phrase</button>
          <button onClick={ () => store.import(pass).from_seed(input)   }>Seed</button>
          <button onClick={ () => store.import(pass).from_bip39(input)  }>Words</button>
          <button onClick={ () => store.import(pass).from_xprv(input)   }>XPrv</button>
        </div>
        
      </div>
    </>
  )
}
