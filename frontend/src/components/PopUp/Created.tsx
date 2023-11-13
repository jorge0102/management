import React, { useState } from 'react'
import { Button, Label, TextInput, Select } from 'flowbite-react'
import { type UserCreate } from '../../types'
import AlertPopUp from './AlertPopUp'

interface Props {
  openPopUp: boolean
  closePopUp: () => void
  handelCreated: (data: UserCreate) => Promise<UserCreate>
  handelListUser: () => void
}

const Created = ({ openPopUp, closePopUp, handelCreated, handelListUser }: Props) => {
  const initialFormData = {
    email: '',
    name: '',
    role: 'user',
    password: ''
  }

  const [formData, setFormData] = useState(initialFormData)
  const [alert, setAlert] = useState('')
  const [response, setResponse] = useState<UserCreate>()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prevData) => ({ ...prevData, [id]: value }))
  }

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target
    setFormData((prevData) => ({ ...prevData, role: value }))
  }

  const handelSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const apiResponse = await handelCreated(formData)

    setAlert(apiResponse.id ? 'success' : 'warning')
    setResponse(formData)
    handelListUser()

    setFormData(initialFormData)
  }

  const handelClose = () => {
    closePopUp()
    setAlert('')
  } 

  if (!openPopUp) return null

  return (
    <div
      id="ModelContainer"
      className="fixed inset-0 bg-black flex justify-center items-center bg-opacity-20 backdrop-blur-sm"
    >
      <div className="p-2 bg-white w-10/12 md:w-1/2 lg:1/3 shadow-inner border-e-emerald-600 rounded-lg py-5">
        <button
          className="absolute top-2 right-2 bg-red-500 text-white cursor-pointer"
          onClick={handelClose}
        >
          X
        </button>
        <div className="w-full p-3 justify-center items-center">
          <form className="w-full p-3 justify-center items-center" onSubmit={handelSubmit}>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Your email" />
              </div>
              <TextInput
                id="email"
                type="email"
                placeholder="name@flowbite.com"
                required
                shadow
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Your Name" />
              </div>
              <TextInput
                id="name"
                type="text"
                required
                shadow
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Your Password" />
              </div>
              <TextInput
                id="password"
                type="password"
                required
                shadow
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="role" value="Select your rol" />
              </div>
              <Select id="role" required value={formData.role} onChange={handleRoleChange}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Select>
            </div>
            <div className="p-5 flex justify-center items-center">
              <Button type="submit">Register new account</Button>
            </div>
          </form>
        </div>
        <AlertPopUp alert={alert} response={response} />
      </div>
    </div>
  )
}

export default Created
