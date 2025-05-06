import { loadStripe } from "@stripe/stripe-js"
import { auth, basePath, PostSettings } from "./setting"
import {
  CardDto,
  tInterview,
  TransactionData,
  Tranx,
  tReview,
  UserDto,
} from "@/types/types"
const getUsers = async (signal: AbortSignal) => {
  const resp = await fetch(`${basePath}user/users`, { signal })
  return resp.json()
}
const loginUser = async (data: {
  email: string
  password: string | number
  type?: string
}) => {
  const resp = await fetch(`${basePath}user/login`, PostSettings(data))
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.json()
}

const registerUser = async (data: UserDto) => {
  const resp = await fetch(`${basePath}user/add`, PostSettings(data))
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.json()
}

const verifyEmail = async (email: string) => {
  const resp = await fetch(`${basePath}user/exists/${email}`, auth)
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.text()
}

const doToken = async (data: { email: string; type: string }) => {
  const resp = await fetch(`${basePath}user/dotoken`, PostSettings(data))

  if (!resp.ok) {
    throw new Error(resp.statusText)
  }

  return resp.text()
}

const resetPass = async (data: {
  token: string | number
  email: string
  password: string | number
  type: string
}) => {
  const resp = await fetch(`${basePath}user/reset/password`, PostSettings(data))
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.text()
}

const fetchCourses = async () => {
  const response = await fetch(`${basePath}course/courses`, auth)
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}
const fetchCourse = async (id: string) => {
  const response = await fetch(`${basePath}course/${id}`, auth)
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}
const addUserCourse = async (data: { id: string; user: string }) => {
  const response = await fetch(`${basePath}reg/add`, PostSettings(data))
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}
const isCourseReg = async (id: string) => {
  const response = await fetch(`${basePath}reg/my/${id}`, auth)
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}
const contactUs = async (data: {
  firstname: string
  lastname: string
  email: string
  message: string
  type: string
  phone?: string
}) => {
  const response = await fetch(
    `${basePath}contact/essl/new`,
    PostSettings(data)
  )
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.text()
}
const getCourseLecture = async (data: {
  id: string
  user: string
  count: number | null
}) => {
  const response = await fetch(`${basePath}course/lecture`, PostSettings(data))
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}
const addReview = async (data: tReview) => {
  const response = await fetch(`${basePath}post/addmeta`, PostSettings(data))
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}
const handlePay = async (obj: CardDto) => {
  const apikey = process.env.NEXT_PUBLIC_stripe_pub || ""
  const stripeInit = loadStripe(apikey)
  const str = await stripeInit
  const resp = await fetch(`${basePath}pay/session`, PostSettings(obj))
  const session = await resp.json()
  if (!session.id) return
  const res = await str?.redirectToCheckout({
    sessionId: session.id,
  })
  if (res?.error) {
    throw new Error(`Stripe error: ${res.error}`)
  }
  return res
}

const submitInterview = async (data: tInterview) => {
  const response = await fetch(
    `${basePath}contact/interview`,
    PostSettings(data)
  )
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}
const fetcher = async (
  url: RequestInfo,
  init?: RequestInit & { token?: string }
) => {
  const headers = new Headers({
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string>),
  })

  if (init?.token) {
    headers.set("Authorization", `Bearer ${init.token}`)
  }

  const res = await fetch(url, { ...init, headers })
  return await res.json()
}
const createPaymentIntent = async (data: TransactionData) => {
  const resp = await fetch(`${basePath}pay/intent`, PostSettings(data))
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.json()
}
const paystacktx = async (data: TransactionData) => {
  const resp = await fetch(`${basePath}pay/paystack`, PostSettings(data))
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.json()
}
export const storeTranx = async (data: TransactionData): Promise<Tranx> => {
  const resp = await fetch(`${basePath}pay/tranx`, PostSettings(data))
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.json()
}
const portalAuth = async (data: {
  email: string
  password: string
  type: string
}) => {
  const resp = await fetch(`${basePath}user/login`, PostSettings(data))
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.json()
}

export {
  createPaymentIntent,
  getUsers,
  loginUser,
  registerUser,
  verifyEmail,
  fetchCourses,
  fetchCourse,
  doToken,
  resetPass,
  addUserCourse,
  contactUs,
  getCourseLecture,
  isCourseReg,
  addReview,
  handlePay,
  submitInterview,
  fetcher,
  paystacktx,
  portalAuth,
}
