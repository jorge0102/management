export interface Login {
  email: string
  password: string
}

export interface UserCore {
  email: string
  name: string
}

export interface User extends UserCore {
  id: number
}

export interface UserCreate extends UserCore {
  id?: number | null
  role: string
  password: string
}

export interface UserLocalStorage extends UserCore {
  id: number
  roles: string
}
