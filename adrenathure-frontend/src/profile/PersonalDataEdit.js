import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useUser } from '../hooks'
import useFetch from '../useFetch'
import UploadAvatar from './UploadAvatar'

function PersonalDataEdit() {
  const personalData = useFetch('http://localhost:3000/users/profile')

  const [firstName, setFirstName] = useState(personalData.firstName || '')
  const [lastName, setLastName] = useState(personalData.lastName || '')
  const [email, setEmail] = useState(personalData.email || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const user = useUser()

  const handleSubmit = async e => {
    e.preventDefault()
    const res = await fetch('http://localhost:3000/users', {
      method: 'PUT',
      body: JSON.stringify({ firstName, lastName, email, password }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.token
      }
    })
    const data = await res.json()

    if (res.ok) {
      setError('Updated successfully')
      navigate('/')
    } else {
      setError(data?.error || 'Error desconocido')
    }
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return (
    <>
      <UploadAvatar />
      <form className="page login" onSubmit={handleSubmit}>
        <label>
          <span>nombre*:</span>
          <input name="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} />
        </label>
        <label>
          <span>apellidos*:</span>
          <input name="lastName" value={lastName} onChange={e => setLastName(e.target.value)} />
        </label>
        <label>
          <span>e-mail*:</span>
          <input name="email" value={email} onChange={e => setEmail(e.target.value)} />
        </label>
        <label>
          <span>contraseña*:</span>
          <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        <p>* datos obligatorios</p>
        <button>guardar</button>
        <p>{error}</p>
      </form>
    </>
  )
}

export default PersonalDataEdit
