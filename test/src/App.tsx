import { ReactElement } from 'react'

import SignerView  from './components/Signer'
import SessionView from './components/Sessions'
import SendPost    from './components/Submit'

export default function App () : ReactElement {

  return (
    <div className='App'>
      <SignerView />
      <SessionView />
      <SendPost />
    </div>
  )
}
