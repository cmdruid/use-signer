import { useSigner } from '@/context/signer'

interface Props {
  id : string
}

export default function SessionElement({ id } : Props) {
  const { store } = useSigner()

  return (
    <div className="session-entry">
      <p>{ id.slice(0, 12) + ' ... ' + id.slice(-12) }</p>
      <button onClick={ () => store.remove(id) }>X</button>
    </div>
  )
}
