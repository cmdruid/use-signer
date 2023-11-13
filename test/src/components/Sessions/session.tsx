import { useSigner } from '@/context/signer'

interface Props {
  id : string
}

export default function SessionElement({ id } : Props) {
  const { remove } = useSigner()

  return (
    <div className="session-entry">
      <p>ID:</p>
      <pre>{ id }</pre>
      <button onClick={ () => remove(id) }>X</button>
    </div>
  )
}
