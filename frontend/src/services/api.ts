import { type Login, type UserCore, type UserCreate } from '../types'

const fetchData = async (path: string, data: UserCreate | UserCore | null, method: string, tokenLocalStorage: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SOME_BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: tokenLocalStorage
      },
      body: JSON.stringify(data)
    })

    if (response.status === 409 || response.status === 404) {
      return await response.json()
    }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return await response.json()
  } catch (e) {
    console.error(e)
    return { data: [{ message: e }] }
  }
}

const fetchDataLogin = async (path: string, data: Login, method: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SOME_BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const result = await response.json()

    if (response.status === 409 || response.status === 404) {
      return result
    }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    if (result?.accessToken && result?.accessToken !== null) {
      console.log(result?.user)
      localStorage.setItem('token', `Bearer ${result?.accessToken}`)
      localStorage.setItem('user', JSON.stringify(result?.user))
    }

    return 200
  } catch (e) {
    console.error(e)
    return { data: [{ message: e }] }
  }
}

const fetchGetData = async (path: string, method: string, tokenLocalStorage: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SOME_BASE_URL}${path}`, {
      method,
      headers: {
        Authorization: tokenLocalStorage
      }
    })

    if (response.status === 409 || response.status === 404) {
      return await response.json()
    }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return await response.json()
  } catch (e) {
    console.error(e)
  }
}

const fetchExcelData = async (path: string, method: string, tokenLocalStorage: string) => {
  const response = await fetch(`${import.meta.env.VITE_SOME_BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: tokenLocalStorage
    }
  })

  if (!response.ok) {
    throw new Error(`Error getting the file: ${response.status}`);
  }
  try {
    const { fileUrl } = await response.json();

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'users.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading the Excel file:', error)
    return { data: [{ message: error }] }
  }
}

export const login = async (path: string, data: Login) => {
  return await fetchDataLogin(path, data, 'POST')
}

export const getUsers = async (path: string, tokenLocalStorage: string) => {
  return await fetchGetData(path, 'GET', tokenLocalStorage)
}

export const createUser = async (path: string, data: UserCreate, tokenLocalStorage: string) => {
  return await fetchData(path, data, 'POST', tokenLocalStorage)
}

export const updateUser = async (path: string, data: UserCore, tokenLocalStorage: string) => {
  return await fetchData(path, data, 'POST', tokenLocalStorage)
}

export const deleteUser = async (path: string, tokenLocalStorage: string) => {
  return await fetchData(path, null, 'POST', tokenLocalStorage)
}

export const downloadExcel = async (path: string, tokenLocalStorage: string) => {
  await fetchExcelData(path, 'GET', tokenLocalStorage)
}
