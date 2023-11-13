import { useSigner } from '@/context/signer'

export default function () {
  const { signer } = useSigner()

  return (
    <div className='container' id='posts'>
      <h2>Current Signer</h2>
      { signer !== null &&
        (
          <div className="session-entry">
            <p>ID:</p>
            <pre>{ signer.id }</pre>
          </div>
        )
      }
    </div>
  )
}
