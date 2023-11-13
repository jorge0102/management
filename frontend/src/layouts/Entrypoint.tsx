import { useEffect, useState } from 'react'
import '../App.css'
import { type UserCore, type User, type UserCreate, type UserLocalStorage } from '../types.d'
import { ListUsers } from '../components/UserList'
import { Button } from 'flowbite-react'
import Created from '../components/PopUp/Created'
import { createUser, deleteUser, downloadExcel, getUsers, updateUser } from '../services/api'
import Update from '../components/PopUp/Update'

/**
 *  Puntos a seguir creando el codigo
 *  Login
 *  Rutas
 *  Listar usuarios
 *  Hacer tabla con funcionalidades
 *  Crear usuarios
 *  Actualizar usuarios
 *  Borrar usuarios
 *  Ordenacion usuarios
 *  Exportacion de usuarios
 *  colorear de azul el usuario que eres
 */
interface Props {
  userSession: UserLocalStorage
  tokenLocalStorage: string
}

function Entrypoint ({ userSession, tokenLocalStorage }: Props) {
  const [users, setUsers] = useState<User[]>([])
  const [userLocalStorage, setUserLocalStorage] = useState<UserLocalStorage>()
  const [sortByName, setSortByName] = useState(false)
  const [openPopup, setOpenPopup] = useState(false)
  const [openPopupUpdate, setOpenPopupUpdate] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const handelSortByName = () => {
    setSortByName((prevState) => !prevState)
  }

  const handleRemovePopUp = () => {
    setOpenPopup(false)
  }
  const handleRemovePopUpUpdate = () => {
    setOpenPopupUpdate(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')

    window.location.reload()
  }

  const handelListUser = async () => {
    let userList
    if (userSession?.roles === 'admin') {
      userList = await getUsers('api/users', tokenLocalStorage)
    } else {
      const userResponse = await getUsers(`api/users/${userSession?.email}`, tokenLocalStorage)
      userList = Array.isArray(userResponse) ? userResponse : [userResponse]
    }

    setUsers(userList)
    return userList
  }

  const handelCreated = async (data: UserCreate) => {
    return await createUser('api/users', data, tokenLocalStorage)
  }

  const handelUpdate = async (userId: number, data: UserCore) => {
    const userUpdate = await updateUser(`api/users/update/${userId}`, data, tokenLocalStorage)
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, ...data } : user
      )
    )
    return userUpdate
  }

  const handelDelete = async (userId: number) => {
    const deteleUser = await deleteUser(`api/users/delete/${userId}`, tokenLocalStorage)
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId))
    return deteleUser
  }

  const handleDownload = async () => {
    await downloadExcel('api/users/excel', tokenLocalStorage)
  }

  const handelUpdatePopup = (user: User) => {
    setSelectedUser(user)
    setOpenPopupUpdate(true)
  }

  useEffect(() => {
    const fetchData = () => {
      handelListUser()
        .then((userList) => {
          setUsers(userList)
        })
        .catch((error) => {
          console.error('Error fetching user data:', error)
        })
    }

    setUserLocalStorage(userSession)
    fetchData()
  }, [])

  const orderUser = sortByName
    ? [...users].sort((a, b) => {
        return a.name.localeCompare(b.name)
      })
    : users

  return (
        <>
            <div>
                <Button
                    onClick={handleLogout}
                    className="bg-red-500 text-white border border-red-500 rounded-md px-3 py-1 hover:bg-red-400"
                >
                    Logout
                </Button>
                <h1>User Management</h1>
                <br />
                <h2><strong>Session User Id:</strong> {userLocalStorage?.id}</h2>
                <h2><strong>Session User name:</strong> {userLocalStorage?.name}</h2>
                <h2><strong>Session User email:</strong> {userLocalStorage?.email}</h2>
                <h2><strong>Session User role:</strong> {userLocalStorage?.roles}</h2>
                <br />
                <div className="flex w-max gap-4">
                    {userLocalStorage?.roles === 'admin'
                      ? <><Button
                            onClick={() => {
                              setOpenPopup(true)
                            }}
                            className="bg-blue-400 text-500 border border-blue-400 rounded-md px-3 py-1 hover:bg-blue-100"
                        >New User</Button><Button onClick={handelSortByName} className="bg-blue-400 text-500 border border-blue-400 rounded-md px-3 py-1 hover:bg-blue-100"
                        >Order By Name</Button><Button
                            className="bg-blue-400 text-500 border border-blue-400 rounded-md px-3 py-1 hover:bg-blue-100"
                        onClick={handleDownload}
                          >Download Excel</Button></>
                      : null
                    }

                </div>
                <br />
                <ListUsers
                    userLocalStorage={userLocalStorage}
                    users={orderUser}
                    handelUpdatePopup={handelUpdatePopup}
                    handelDelete={handelDelete}
                />
            </div>
            <Created
                openPopUp={openPopup}
                closePopUp={handleRemovePopUp}
                handelCreated={handelCreated}
                handelListUser={handelListUser}
            />
            <Update
                openPopUp={openPopupUpdate}
                closePopUp={handleRemovePopUpUpdate}
                handelUpdate={handelUpdate}
                userToUpdate={selectedUser}
            />
        </>
  )
}

export default Entrypoint
