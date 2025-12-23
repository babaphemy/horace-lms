import {
  CardDto,
  CourseComplete,
  CourseCreate,
  CourseResponse,
  LessonDto,
  orgDto,
  tInterview,
  TopicDto,
  TransactionData,
  Tranx,
  tReview,
  tUser,
  Uploader,
  UserDto,
  OrganizationMember,
  CorporateAuthRequest,
  TUserScore,
  TAddQuizScore,
  TQuizScores,
  CourseDTOResponse,
  CourseProgressResponse,
  LessonProgressRequest,
} from "@/types/types"
import { loadStripe } from "@stripe/stripe-js"
import {
  basePath,
  cookieAuth,
  DeleteSettings,
  horacePath,
  PostSettings,
  PutSettings,
} from "./setting"
import {
  LessonProgress,
  VideoProgress,
} from "@/components/classroom/VideoPlayerWithProgress"
import { TQuiz } from "@/schema/quizSchema"
import { getSession } from "next-auth/react"

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const session = await getSession()
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(session?.accessToken && {
        Authorization: `Bearer ${session.accessToken}`,
      }),
      ...options.headers,
    },
  })
}
const getUsers = async (signal: AbortSignal) => {
  const resp = await fetch(`${basePath}user/users`, { signal })
  return resp.json()
}
const getAllUsers = async (): Promise<tUser[]> => {
  const resp = await fetch(`${basePath}user/users`)
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.json()
}
const getUserById = async (id: string): Promise<tUser> => {
  const resp = await fetchWithAuth(`${basePath}user/${id}`)
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.json()
}
const doEdit = async (data: tUser) => {
  const resp = await fetch(`${basePath}user/edit`, PutSettings(data))
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.json()
}
const loginUser = async (data: {
  email: string
  password: string | number
  type?: string
}) => {
  const resp = await fetchWithAuth(`${basePath}user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.json()
}

const createOrg = async (data: orgDto) => {
  const resp = await fetchWithAuth(`${basePath}org/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.json()
}

const updateOrg = async (data: { data: orgDto; id: string }) => {
  const resp = await fetchWithAuth(`${basePath}org/update/${data.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data.data),
  })
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.json()
}

const registerUser = async (data: UserDto) => {
  data.organizationId = "NA"
  const resp = await fetchWithAuth(`${basePath}user/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.json()
}

const verifyEmail = async (email: string) => {
  const resp = await fetchWithAuth(`${basePath}user/exists/${email}`)
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.text()
}

const doToken = async (data: {
  email: string
  type: string
  organizationId: string
}) => {
  const resp = await fetchWithAuth(`${basePath}user/dotoken`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

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
  organizationId: string
}) => {
  const resp = await fetchWithAuth(`${basePath}user/reset/password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.text()
}
const resetOwnPass = async (data: {
  token: string
  email: string
  password: string
}) => {
  const resp = await fetchWithAuth(`${basePath}user/reset/ownpassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.text()
}
const addCourseDetail = async (course: CourseCreate): Promise<CourseCreate> => {
  const resp = await fetchWithAuth(`${basePath}course/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(course),
  })
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.json()
}
const addSubjectComplete = async (
  subject: CourseComplete
): Promise<CourseResponse> => {
  const resp = await fetchWithAuth(`${basePath}course/addcomplete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subject),
  })
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.json()
}
export const fetchOrgCourses = async (
  orgid: string,
  page: number = 0,
  size: number = 10
) => {
  const response = await fetchWithAuth(
    `${basePath}course/org-courses?page=${page}&size=${size}&orgId=${orgid}`
  )
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}

export const featuredCourses = async () => {
  const resp = await fetchWithAuth(`${basePath}course/featured`)
  if (!resp.ok) {
    return { error: resp.status }
  }
  return resp.json()
}

const fetchCourses = async (
  userId?: string,
  page: number = 0,
  size: number = 10
): Promise<CourseDTOResponse> => {
  let url = `${basePath}course/courses?page=${page}&size=${size}`

  if (userId) {
    url += `&userId=${userId}`
  }

  const response = await fetchWithAuth(url)

  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}
const fetchCourse = async (id: string, userid?: string) => {
  const response = await fetchWithAuth(
    userid
      ? `${basePath}course/summary/${id}?userId=${userid}`
      : `${basePath}course/${id}`
  )
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}
const fetchLMS = async (id: string) => {
  const response = await fetchWithAuth(`${basePath}course/lms/${id}`)
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}
const myRegisteredCourses = async (userId: string) => {
  const response = await fetchWithAuth(
    `${basePath}course/courses/my-registered/${userId}`
  )
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}
const myNotes = async (userId: string, lessonId: string) => {
  const response = await fetchWithAuth(
    `${basePath}course/${userId}/${lessonId}`
  )
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}
const addNote = async (data: {
  userId: string
  lessonId: string
  notes: string
}) => {
  const response = await fetch(`${basePath}course/user/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}

const lessonMaterials = async (lessonId: string) => {
  const response = await fetchWithAuth(
    `${basePath}course/materials/${lessonId}`
  )
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}

const addQuiz = async (data: TQuiz) => {
  const response = await fetchWithAuth(`${basePath}course/quiz/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`

    try {
      const errorData = await response.text()
      const errorJson = JSON.parse(errorData)
      if (
        errorJson.message &&
        errorJson.message.includes("E11000 duplicate key error")
      ) {
        if (errorJson.message.includes("lessonId")) {
          errorMessage =
            "A quiz already exists for this lesson. Please select a different lesson or delete the existing quiz first."
        } else {
          errorMessage =
            "A quiz with these details already exists. Please modify your quiz details."
        }
      } else if (errorJson.message) {
        errorMessage = errorJson.message
      }
    } catch {}

    throw new Error(errorMessage)
  }

  return response.json()
}

const addScore = async (data: TAddQuizScore) => {
  const response = await fetchWithAuth(`${basePath}course/quiz/score`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to submit quiz score")
  }
  return response.json()
}
export const editQuiz = async ({ id, data }: { id: string; data: TQuiz }) => {
  const response = await fetch(
    `${basePath}course/quiz/edit/${id}`,
    PutSettings(data)
  )
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}

const lessonQuiz = async (lessonId: string) => {
  const response = await fetchWithAuth(`${basePath}course/quiz/${lessonId}`)
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}
export const getQuizById = async (id: string) => {
  const response = await fetchWithAuth(`${basePath}course/quiz/id/${id}`)
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}
const allCourseQuiz = async (courseId: string) => {
  const response = await fetchWithAuth(
    `${basePath}course/quiz/bycourse/${courseId}`
  )
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}
const isRegistered = async (userId: string, courseId: string) => {
  const response = await fetchWithAuth(
    `${basePath}reg/isreg/${userId}/${courseId}`
  )
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}
const coursesByAuthor = async (id: string) => {
  const response = await fetchWithAuth(`${basePath}course/byauthor/${id}`)
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}
const addUserCourse = async (cid: string) => {
  const response = await fetch(
    `${basePath}reg/add/${cid}`,
    await PostSettings({ id: cid })
  )
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}
const isCourseReg = async (id: string) => {
  const response = await fetchWithAuth(`${basePath}reg/my/${id}`)
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}
const recentCourses = async (
  page: number = 0,
  size: number = 10,
  organizationId?: string
) => {
  const response = await fetchWithAuth(
    `${basePath}course/recent/${`${organizationId}`}?page=${page}&limit=${size}`
  )
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}
// const coursesByDate = async (
//   startDate: string,
//   endDate: string,
//   organizationId?: string
// ) => {
//   const response = await fetch(
//     `${basePath}course/range/${startDate}/${endDate}${organizationId ? `?orgId=${organizationId}` : ""}`,
//     auth
//   )
//   if (!response.ok) {
//     return { error: response.status }
//   }
//   return response.json()
// }
const dashboardStat = async (userId: string) => {
  const response = await fetchWithAuth(`${basePath}user/dashboard/${userId}`)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}

const userQuizScores = async (userId: string): Promise<TUserScore[]> => {
  const response = await fetchWithAuth(
    `${basePath}course/quiz/scores?userId=${userId}`
  )
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}

const registeredStudents = async (cid: string): Promise<tUser[]> => {
  const response = await fetchWithAuth(`${basePath}course/students/${cid}`)
  if (!response.ok) {
    throw new Error(response.statusText)
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
  const response = await fetch(`${basePath}contact/essl/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.text()
}
const addTopic = async (data: TopicDto): Promise<TopicDto> => {
  const response = await fetchWithAuth(`${basePath}course/module`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}
const getCourseLecture = async (data: {
  id: string
  user: string
  count: number | null
}) => {
  const response = await fetchWithAuth(`${basePath}course/lecture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}
const addLecture = async (data: LessonDto): Promise<LessonDto> => {
  const response = await fetchWithAuth(`${basePath}course/module/lesson`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}

const deleteTopic = async (id: string): Promise<void> => {
  const response = await fetchWithAuth(
    `${basePath}course/module/${id}`,
    DeleteSettings({ id })
  )
  if (!response.ok) {
    throw new Error(response.statusText)
  }
}
const deleteLecture = async (id: string): Promise<void> => {
  const response = await fetchWithAuth(
    `${basePath}course/module/lesson/${id}`,
    DeleteSettings({ id })
  )
  if (!response.ok) {
    throw new Error(response.statusText)
  }
}
const addReview = async (data: tReview) => {
  const response = await fetch(`${basePath}post/addmeta`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}
const addThumbnail = async (data: CourseCreate) => {
  const response = await fetch(`${basePath}course/thumbnail`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}
const handlePay = async (obj: CardDto) => {
  const apikey = process.env.NEXT_PUBLIC_stripe_pub || ""
  const stripeInit = loadStripe(apikey)
  const str = await stripeInit
  const resp = await fetch(`${basePath}pay/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  })
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
  const response = await fetch(`${basePath}contact/interview`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
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
  const resp = await fetch(`${basePath}pay/intent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.json()
}
const paystacktx = async (data: TransactionData) => {
  const resp = await fetch(`${basePath}pay/paystack`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.json()
}
const getAllNavigationItems = async () => {
  const resp = await fetch(`${basePath}rbac/menu`)

  if (!resp.ok) {
    throw new Error(resp.statusText)
  }

  return resp.json()
}
const getSideNavItems = async (role: string, active: boolean) => {
  const resp = await fetch(
    `${basePath}rbac/menu/?active=${active}&role=${role}`
  )

  if (!resp.ok) {
    throw new Error(resp.statusText)
  }

  return resp.json()
}
export const storeTranx = async (data: TransactionData): Promise<Tranx> => {
  const resp = await fetch(`${basePath}pay/tranx`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
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
  const resp = await fetch(`${basePath}user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.json()
}
const login2 = async (data: { email: string; password: string }) => {
  const resp = await fetch(`${basePath}user/login2`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.json()
}
const uploadVideoToS3 = async (videoBinary: Blob): Promise<string> => {
  const formData = new FormData()

  formData.append("video", videoBinary)

  const headers = {
    method: "POST",
    body: formData,
  }
  const resp = await fetch(`${horacePath}info/s3/video`, headers)
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.json()
}

const uploadImageToS3 = async (imageBinary: Blob): Promise<string> => {
  const formData = new FormData()

  formData.append("image", imageBinary)

  const headers = {
    method: "PUT",
    body: formData,
  }
  const resp = await fetch(`${horacePath}info/s3/upload`, headers)
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.json()
}
const updateDp = async (data: tUser) => {
  const resp = await fetch(`${basePath}user/upload-photo`, PutSettings(data))
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.json()
}
const getPresignedUrl = async (uploader: Uploader) => {
  const resp = await fetchWithAuth(`${horacePath}info/s3/presigned`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(uploader),
  })
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.json()
}

const uploadPresignedUrl = async (
  file: File,
  presignedUrl: string
): Promise<string> => {
  const response = await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  })
  if (!response.ok) {
    throw new Error(`Failed to upload file: ${response.statusText}`)
  }
  return presignedUrl.split("?")[0] // Return the URL without query parameters
}
const deleteObject = async (key: string): Promise<void> => {
  const response = await fetch(`${horacePath}info/s3object?key=${key}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key }),
  })
  if (!response.ok) {
    throw new Error(`Failed to delete object: ${response.statusText}`)
  }
}
const manageDraft = async (obj: {
  id: string
  draft: boolean
  courseName: string
  user: string
}) => {
  const resp = await fetch(`${basePath}course/publish`, PutSettings(obj))
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.json()
}

const setCourseAsFeatured = async (cid: string) => {
  const resp = await fetch(`${basePath}course/featured/${cid}`, PutSettings({}))
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.json()
}

const userOrganization = async (userId: string) => {
  const response = await fetchWithAuth(`${basePath}user/org/${userId}`)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}

const getUserInfo = async (userId: string): Promise<tUser> => {
  const response = await fetchWithAuth(`${basePath}user/${userId}`)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}

const getTeamMembers = async (orgId: string, page: number) => {
  const response = await fetchWithAuth(
    `${basePath}user/org-users/${orgId}?page=${page}&size=10`
  )
  if (!response.ok) {
    throw new Error(
      `Failed to fetch team members for orgId ${orgId} at endpoint ${basePath}user/org-users/${orgId}?page=${page}&size=10: ${response.statusText}`
    )
  }
  return response.json()
}
const addUserToOrganization = async (email: string, orgId: string) => {
  const response = await fetch(
    `${basePath}org/${orgId}`,
    PutSettings({ id: orgId, email })
  )
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}

const activities = async (userId: string) => {
  const response = await fetchWithAuth(`${basePath}activity/user/${userId}`)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}
const events = async (userId: string) => {
  const response = await fetchWithAuth(`${basePath}event/user/${userId}`)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}

const fetchOrganizationMembers = async (
  orgId: string
): Promise<OrganizationMember[]> => {
  const response = await fetchWithAuth(`${basePath}user/org-users/${orgId}`)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  const data = await response.json()

  if (!Array.isArray(data.content)) {
    throw new Error("Expected an array in data.content but got:", data)
    return []
  }

  return data.content
}

const fetchUserOrganization = async (userId: string): Promise<orgDto> => {
  const response = await fetchWithAuth(`${basePath}user/org/${userId}`)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}
const saveMyProgress = async (data: VideoProgress) => {
  const response = await fetchWithAuth(`${horacePath}stream/progress`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}
const saveLessonProgress = async (data: LessonProgress) => {
  const response = await fetchWithAuth(`${horacePath}stream/lesson-progress`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}
const getLessonProgress = async (lessonId: string, userId: string) => {
  const response = await fetchWithAuth(
    `${horacePath}stream/progress/${lessonId}/${userId}`
  )
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}
const getUserProgress = async (userId: string) => {
  const response = await fetchWithAuth(
    `${horacePath}stream/progress/user/${userId}`
  )
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}
const courseGrantAccess = async (dto: CorporateAuthRequest) => {
  const response = await fetchWithAuth(
    `${basePath}course/org/authenticate-user`,
    {
      method: "POST",
      body: JSON.stringify(dto),
    }
  )
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}
const courseAccessToken = async () => {
  const response = await fetch(`${basePath}course/user/token-info`, cookieAuth)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}

const getUserQuizScores = async (userId: string): Promise<TQuizScores[]> => {
  const response = await fetchWithAuth(
    `${basePath}course/quiz/scores?userId=${userId}`
  )
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}

export const updateLessonProgress = async (request: LessonProgressRequest) => {
  const response = await fetchWithAuth(`${basePath}progress/lesson`, {
    method: "POST",
    body: JSON.stringify(request),
  })
  if (!response.ok) throw new Error("Failed to update lesson progress")
  return response.json()
}

export const getCourseProgress = async (
  courseId: string
): Promise<CourseProgressResponse | null> => {
  const response = await fetchWithAuth(`${basePath}progress/course/${courseId}`)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to fetch course progress: ${error}`)
  }

  return response.json()
}

export const getAllStudentProgress = async (): Promise<
  CourseProgressResponse[]
> => {
  const response = await fetch(`${basePath}progress/student`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to fetch student progress: ${error}`)
  }

  return response.json()
}

export const markLessonComplete = async (
  lessonId: string,
  topicId: string,
  courseId: string
): Promise<LessonProgress> => {
  const response = await fetchWithAuth(
    `${basePath}progress/mark-complete/lesson/${lessonId}?topicId=${topicId}&courseId=${courseId}`,
    {
      method: "POST",
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to mark lesson complete: ${error}`)
  }

  return response.json()
}
export const getLessonProgressB = async (
  userId: string,
  courseId: string
): Promise<CourseProgressResponse | null> => {
  return getCourseProgress(courseId)
}

export const getCourseProgressForStudent = async (
  courseId: string,
  studentId: string
): Promise<CourseProgressResponse | null> => {
  try {
    const response = await fetchWithAuth(
      `${basePath}progress/course/${courseId}/student/${studentId}`,
      {
        method: "GET",
      }
    )

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      throw new Error("Failed to fetch student course progress")
    }

    return response.json()
  } catch {
    return null
  }
}

export {
  getUserQuizScores,
  courseGrantAccess,
  courseAccessToken,
  saveMyProgress,
  saveLessonProgress,
  getLessonProgress,
  getUserProgress,
  addCourseDetail,
  addThumbnail,
  myNotes,
  addNote,
  lessonMaterials,
  addTopic,
  addLecture,
  activities,
  addUserToOrganization,
  addReview,
  addSubjectComplete,
  addUserCourse,
  contactUs,
  coursesByAuthor,
  createOrg,
  createPaymentIntent,
  dashboardStat,
  doEdit,
  doToken,
  deleteLecture,
  deleteTopic,
  deleteObject,
  events,
  fetchCourse,
  fetchCourses,
  fetcher,
  fetchLMS,
  getPresignedUrl,
  getAllNavigationItems,
  getAllUsers,
  getCourseLecture,
  getSideNavItems,
  getUserById,
  getUsers,
  handlePay,
  isCourseReg,
  isRegistered,
  login2,
  loginUser,
  registeredStudents,
  manageDraft,
  myRegisteredCourses,
  paystacktx,
  portalAuth,
  recentCourses,
  registerUser,
  resetOwnPass,
  resetPass,
  setCourseAsFeatured,
  submitInterview,
  updateDp,
  uploadImageToS3,
  uploadVideoToS3,
  uploadPresignedUrl,
  userOrganization,
  verifyEmail,
  getTeamMembers,
  fetchOrganizationMembers,
  fetchUserOrganization,
  updateOrg,
  addQuiz,
  lessonQuiz,
  allCourseQuiz,
  userQuizScores,
  addScore,
  getUserInfo,
}
