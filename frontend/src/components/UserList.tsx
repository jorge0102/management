import { useEffect } from 'react'
import { type User, type UserLocalStorage } from '../types.d'
import { Table, Button } from 'flowbite-react'

interface Props {
  handelDelete: (index: number) => void
  handelUpdatePopup: (user: User) => void
  users: User[]
  userLocalStorage: UserLocalStorage | undefined
}

export function ListUsers ({ users, handelUpdatePopup, handelDelete, userLocalStorage }: Props) {
  const handleEditClick = (index: number) => {
    const user = users.find(user => user.id === index)
    if (user) {
      handelUpdatePopup(user)
    }
  }

  const isUserSession = (userId: number) => {
    return userLocalStorage && userId === userLocalStorage.id
  }

  useEffect(() => {
    console.log('Updated users:', users)
  }, [users])

  return (
    <Table hoverable>
      <Table.Head>
        <Table.HeadCell>ID</Table.HeadCell>
        <Table.HeadCell>Name</Table.HeadCell>
        <Table.HeadCell>Email</Table.HeadCell>
        <Table.HeadCell>
          <span className="sr-only">Edit</span>
        </Table.HeadCell>
        <Table.HeadCell>
          <span className="sr-only">Delete</span>
        </Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {users.map(user => (
          <Table.Row
            key={user.id}
            className={`${isUserSession(user.id) ? 'bg-blue-300' : 'bg-white'
              } dark:border-gray-700 dark:bg-gray-800`}
          >            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {user.id}
            </Table.Cell>
            <Table.Cell>{user.name}</Table.Cell>
            <Table.Cell>{user.email}</Table.Cell>
            <Table.Cell>
              <Button color="warning" onClick={() => { handleEditClick(user.id) }}>
                Edit
              </Button>
            </Table.Cell>
            <Table.Cell>
              <Button color="failure" onClick={() => { handelDelete(user.id) }}>Delete</Button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}
