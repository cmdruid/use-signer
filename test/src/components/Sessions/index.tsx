import { useSigner }  from '@/context/signer'
import SessionElement from './session'

export default function () {
  const { sessions } = useSigner()

  return (
    <div className='container' id='posts'>
      <h2>Sessions</h2>
      { sessions.length !== 0
        && sessions.map(e => <SessionElement id={e[0]} key={e[0]} />)
        || <pre>[ no sessions ]</pre>
      }
    </div>
  )
}
