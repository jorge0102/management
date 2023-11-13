import React, { useEffect, useState } from 'react'
import { Button, Label, TextInput } from 'flowbite-react'
import { type UserCore, type User } from '../../types'
import AlertPopUp from './AlertPopUp'

interface Props {
  openPopUp: boolean
  closePopUp: () => void
  handelUpdate: (userId: number, data: UserCore) => Promise<UserCore>
  userToUpdate: User | null
}

const Update = ({ openPopUp, closePopUp, handelUpdate, userToUpdate }: Props) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    id: 0
  })
  const [alert, setAlert] = useState('')
  const [response, setResponse] = useState('')

  useEffect(() => {
    if (userToUpdate) {
      setFormData({
        id: userToUpdate.id ?? null,
        email: userToUpdate.email || '',
        name: userToUpdate.name || ''
      })
    }
  }, [userToUpdate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prevData) => ({ ...prevData, [id]: value }))
  }

  const handelSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const apiResponse = await handelUpdate(formData.id, formData)

    setAlert(apiResponse.name ? 'success' : 'warning')
    setResponse('ok')
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
            <div className="p-5 flex justify-center items-center">
              <Button type="submit">Update account</Button>
            </div>
          </form>
        </div>
        <AlertPopUp alert={alert} response={response} />
      </div>
    </div>
  )
}

export default Update
