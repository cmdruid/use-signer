import { useSigner } from '@/context/signer'

export default function () {
  const { signer, store } = useSigner()

  return (
    <div className='container' id='posts'>
      <h2>Current Signer</h2>
      { signer !== null &&
        (
          <>
            <div className="session-entry" style={{ marginBottom: 15 }}>
              <p>{ signer.id.slice(0, 16) + ' ... ' + signer.id.slice(-16) }</p>
            </div>
            <div className='controls'>
              <button onClick={ () => store.close() }>Close</button>
            </div>
          </>
        )
      }
    </div>
  )
}
