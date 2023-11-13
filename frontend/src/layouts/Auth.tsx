import React, { useState } from 'react'
import { login } from '../services/api'
import { Button, Label, TextInput, Card } from 'flowbite-react'

export default function Auth () {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prevData) => ({ ...prevData, [id]: value }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const response = await login('api/users/login', formData)

    if (response && response === 200) {
      window.location.reload()
    } else {
      alert('Usuario o contraseña incorecta')
    }
  }

  return (
    <Card className="max-w-sm">
      <form className="flex flex-col gap-4" onSubmit={handleLogin}>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email1" value="Your email" />
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
            <Label htmlFor="password1" value="Your password" />
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
        <Button type="submit">Submit</Button>
      </form>
    </Card>
  )
}
