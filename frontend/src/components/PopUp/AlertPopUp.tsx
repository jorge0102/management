import { Alert } from 'flowbite-react'
import { type UserCreate } from '../../types'

interface Props {
  alert: string;
  response: UserCreate | string | undefined;
}

const AlertPopUp = ({ alert, response }: Props) => {
  if (!response) {
    return null
  }

  if (alert === 'success') {
    return (
      <>
        <Alert color="success">
          {response === 'ok'
            ? (
            <p>Correct Update</p>
              )
            : (
            <>
              <h2>Copi to send</h2>
              <br />
              {isUserCreate(response) && (
                <>
                  <span className="font-medium">NAME: {response.name}</span>
                  <br />
                  <span className="font-medium">EMAIL: {response.email}</span>
                  <br />
                  <span className="font-medium">PASSWORD: {response.password}</span>
                </>
              )}
            </>
              )}
        </Alert>
      </>
    )
  }

  if (alert === 'warning') {
    return (
      <Alert color="warning">
        <span className="font-medium">Error creating user</span>
      </Alert>
    )
  }
}

function isUserCreate (obj: any): obj is UserCreate {
  return typeof obj === 'object' && 'name' in obj
}

export default AlertPopUp
