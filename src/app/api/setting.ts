import { getSession } from "next-auth/react"

const basePath = process.env.NEXT_PUBLIC_BASEPATH
const horacePath = process.env.NEXT_PUBLIC_HORACE
// let MONGO_URI = process.env.MONGO_URI!;

//const authKey = "" //process.env.NEXT_PUBLIC_APIKEY
// export const auth = {
//   headers: { Authorization: `Basic ${authKey}` },
// }
// export const mixedAuth = {
//   headers: {
//     Authorization: `Basic ${authKey}`,
//     "Content-Type": "application/json",
//   },
// }
export const cookieAuth = {
  method: "GET",
  headers: {
    accept: "*/*",
  },
  credentials: "include" as RequestCredentials,
}
export const PostSettings = async <T>(
  obj: T,
  additionalHeaders?: HeadersInit
) => {
  const session = await getSession()

  return {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(session?.accessToken && {
        Authorization: `Bearer ${session.accessToken}`,
      }),
      ...additionalHeaders,
    },
    body: JSON.stringify(obj),
  }
}
export const PostUnsecured = <T>(obj: T) => {
  return {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  }
}
export const DeleteSettings = <T>(obj: T) => {
  return {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  }
}
export const PutSettings = <T>(obj: T) => {
  return {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  }
}

export { basePath, horacePath }
