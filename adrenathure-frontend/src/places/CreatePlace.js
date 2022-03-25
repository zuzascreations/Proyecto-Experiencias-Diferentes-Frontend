import { Suspense, useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useUser } from '../hooks'
import Loading from '../Loading'
import '../Form.css'


function CreatePlace() {
  const [placeName, setPlaceName] = useState('')
  const [placeDescription, setPlaceDescription] = useState('')
  const [coordsLong, setCoordsLong] = useState('')
  const [coordsLat, setCoordsLat] = useState('')
  const [file, setFile] = useState(null)

  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const user = useUser()

  const handleSubmit = async e => {
    e.preventDefault()
    const fd = new FormData()
    if (file) {
      fd.append('avatar', file)
    }
    fd.append('placeName', placeName)
    fd.append('placeDescription', placeDescription)
    if (coordsLong) {
          fd.append('coordsLong', coordsLong)
    }
    if (coordsLat) {
          fd.append('coordsLat', coordsLat)
    }

    const res = await fetch('http://localhost:3000/places/admin', {
      method: 'POST',
      body: fd,
      headers: {
        Authorization: 'Bearer ' + user.token
      }
    })

    if (res.ok) {
      // const data = await res.json()
      setError('Updated successfully')
      navigate('/Places')
      window.location.reload(true)
    } else {
      setError('Error desconocido')
    }
    setPlaceName('')
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return (
    <>
      <form className="form" onSubmit={handleSubmit}>
        <fieldset className="form-section">
          <legend>CREAR DESTINO</legend>
          <label>
            <span>Nombre destino</span>
            <br/>
            <input required name="name" placeholder="Introduce nombre del destino..." value={placeName} onChange={e => setPlaceName(e.target.value)} />
          </label>
          <label>
            <span>Descripción destino</span>
            <br/>
            <textarea required name="description" placeholder="Introduce descripción del destino..." value={placeDescription} onChange={e => setPlaceDescription(e.target.value)} />
          </label>
          <label>
            <span>Coords longitude</span>
            <br/>
            <input name="dates" placeholder="Introduce longitude del destino..." value={coordsLong} onChange={e => setCoordsLong(e.target.value)} />
          </label>
          <label>
            <span>Coords latitude</span>
            <br/>
            <input name="hour" placeholder="Introduce latitude del destino..." value={coordsLat} onChange={e => setCoordsLat(e.target.value)} />
          </label>
          <label>
          <span>Escojer foto destino</span>
          <input  className="input" type='file' onChange={e => setFile(e.target.files[0])} />
          </label>
          <button>GUARDAR</button>
          <p>{error}</p>
        </fieldset>
      </form>
    </>
  )
}

const CreatePlaceWrapper = () =>
  <Suspense fallback={<Loading className='page' />}>
    <CreatePlace />
  </Suspense>

export default CreatePlaceWrapper
