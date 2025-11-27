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
} from "@/types/types"
import { loadStripe } from "@stripe/stripe-js"
import {
  auth,
  basePath,
  cookieAuth,
  DeleteSettings,
  horacePath,
  mixedAuth,
  PostSettings,
  PutSettings,
} from "./setting"
import {
  LessonProgress,
  VideoProgress,
} from "@/components/classroom/VideoPlayerWithProgress"
import { TQuiz } from "@/schema/quizSchema"
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
  const resp = await fetch(`${basePath}user/${id}`, auth)
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
  const resp = await fetch(`${basePath}user/login`, PostSettings(data))
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.json()
}

const createOrg = async (data: orgDto) => {
  const resp = await fetch(`${basePath}org/add`, PostSettings(data))
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.json()
}

const updateOrg = async (data: { data: orgDto; id: string }) => {
  const resp = await fetch(
    `${basePath}org/update/${data.id}`,
    PutSettings(data.data)
  )
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.json()
}

const registerUser = async (data: UserDto) => {
  data.organizationId = "NA"
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

const doToken = async (data: {
  email: string
  type: string
  organizationId: string
}) => {
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
  organizationId: string
}) => {
  const resp = await fetch(`${basePath}user/reset/password`, PostSettings(data))
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
  const resp = await fetch(
    `${basePath}user/reset/ownpassword`,
    PostSettings(data)
  )
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.text()
}
const addCourseDetail = async (course: CourseCreate): Promise<CourseCreate> => {
  const resp = await fetch(`${basePath}course/add`, PostSettings(course))
  if (!resp.ok) {
    throw new Error(resp.statusText)
  }
  return resp.json()
}
const addSubjectComplete = async (
  subject: CourseComplete
): Promise<CourseResponse> => {
  const resp = await fetch(
    `${basePath}course/addcomplete`,
    PostSettings(subject)
  )
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
  const response = await fetch(
    `${basePath}course/org-courses?page=${page}&size=${size}&orgId=${orgid}`,
    auth
  )
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}

const fetchCourses = async (
  userId?: string,
  page: number = 0,
  size: number = 10
) => {
  let url = `${basePath}course/courses?page=${page}&size=${size}`

  if (userId) {
    url += `&userId=${userId}`
  }

  const response = await fetch(url, auth)

  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}
const fetchCourse = async (id: string, userid?: string) => {
  const response = await fetch(
    userid
      ? `${basePath}course/summary/${id}?userId=${userid}`
      : `${basePath}course/${id}`,
    auth
  )
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}
const fetchLMS = async (id: string) => {
  const response = await fetch(`${basePath}course/lms/${id}`, auth)
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}
const myRegisteredCourses = async (userId: string) => {
  const response = await fetch(
    `${basePath}course/courses/my-registered/${userId}`,
    auth
  )
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}
const myNotes = async (userId: string, lessonId: string) => {
  const response = await fetch(`${basePath}course/${userId}/${lessonId}`, auth)
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
  const response = await fetch(
    `${basePath}course/user/notes`,
    PostSettings(data)
  )
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}

const lessonMaterials = async (lessonId: string) => {
  const response = await fetch(`${basePath}course/materials/${lessonId}`, auth)
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}

const addQuiz = async (data: TQuiz) => {
  const response = await fetch(`${basePath}course/quiz/add`, PostSettings(data))

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
  const response = await fetch(
    `${basePath}course/quiz/score`,
    PostSettings(data)
  )

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
  const response = await fetch(`${basePath}course/quiz/${lessonId}`, auth)
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}
export const getQuizById = async (id: string) => {
  const response = await fetch(`${basePath}course/quiz/id/${id}`, auth)
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}
const allCourseQuiz = async (courseId: string) => {
  const response = await fetch(
    `${basePath}course/quiz/bycourse/${courseId}`,
    auth
  )
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}
const isRegistered = async (userId: string, courseId: string) => {
  const response = await fetch(
    `${basePath}reg/isreg/${userId}/${courseId}`,
    auth
  )
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}
const coursesByAuthor = async (id: string) => {
  const response = await fetch(`${basePath}course/byauthor/${id}`, auth)
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
const recentCourses = async (
  page: number = 0,
  size: number = 10,
  organizationId?: string
) => {
  const response = await fetch(
    `${basePath}course/recent/${`${organizationId}`}?page=${page}&limit=${size}`,
    auth
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
  const response = await fetch(`${basePath}user/dashboard/${userId}`, auth)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}

const userQuizScores = async (userId: string): Promise<TUserScore[]> => {
  const response = await fetch(
    `${basePath}course/quiz/scores?userId=${userId}`,
    auth
  )
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}

const registeredStudents = async (cid: string): Promise<tUser[]> => {
  const response = await fetch(`${basePath}course/students/${cid}`, auth)
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
  const response = await fetch(
    `${basePath}contact/essl/new`,
    PostSettings(data)
  )
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.text()
}
const addTopic = async (data: TopicDto): Promise<TopicDto> => {
  const response = await fetch(`${basePath}course/module`, PostSettings(data))
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
  const response = await fetch(`${basePath}course/lecture`, PostSettings(data))
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}
const addLecture = async (data: LessonDto): Promise<LessonDto> => {
  const response = await fetch(
    `${basePath}course/module/lesson`,
    PostSettings(data)
  )
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}

const deleteTopic = async (id: string): Promise<void> => {
  const response = await fetch(
    `${basePath}course/module/${id}`,
    DeleteSettings({ id })
  )
  if (!response.ok) {
    throw new Error(response.statusText)
  }
}
const deleteLecture = async (id: string): Promise<void> => {
  const response = await fetch(
    `${basePath}course/module/lesson/${id}`,
    DeleteSettings({ id })
  )
  if (!response.ok) {
    throw new Error(response.statusText)
  }
}
const addReview = async (data: tReview) => {
  const response = await fetch(`${basePath}post/addmeta`, PostSettings(data))
  if (!response.ok) {
    return { error: response.status }
  }
  return response.json()
}
const addThumbnail = async (data: CourseCreate) => {
  const response = await fetch(`${basePath}course/thumbnail`, PutSettings(data))
  if (!response.ok) {
    throw new Error(response.statusText)
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
const login2 = async (data: { email: string; password: string }) => {
  const resp = await fetch(`${basePath}user/login2`, PostSettings(data))
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
  const resp = await fetch(
    `${horacePath}info/s3/presigned`,
    PostSettings(uploader)
  )
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

const userOrganization = async (userId: string) => {
  const response = await fetch(`${basePath}user/org/${userId}`, auth)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}

const getUserInfo = async (userId: string): Promise<tUser> => {
  const response = await fetch(`${basePath}user/${userId}`, auth)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}

const getTeamMembers = async (orgId: string, page: number) => {
  const response = await fetch(
    `${basePath}user/org-users/${orgId}?page=${page}&size=10`,
    auth
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
  const response = await fetch(`${basePath}activity/user/${userId}`, auth)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}
const events = async (userId: string) => {
  const response = await fetch(`${basePath}event/user/${userId}`, auth)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}

const fetchOrganizationMembers = async (
  orgId: string
): Promise<OrganizationMember[]> => {
  const response = await fetch(`${basePath}user/org-users/${orgId}`, auth)
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
  const response = await fetch(`${basePath}user/org/${userId}`, auth)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}
const saveMyProgress = async (data: VideoProgress) => {
  const response = await fetch(
    `${horacePath}stream/progress`,
    PostSettings(data)
  )
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}
const saveLessonProgress = async (data: LessonProgress) => {
  const response = await fetch(
    `${horacePath}stream/lesson-progress`,
    PostSettings(data)
  )
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}
const getLessonProgress = async (lessonId: string, userId: string) => {
  const response = await fetch(
    `${horacePath}stream/progress/${lessonId}/${userId}`,
    auth
  )
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}
const getUserProgress = async (userId: string) => {
  const response = await fetch(
    `${horacePath}stream/progress/user/${userId}`,
    auth
  )
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}
const courseGrantAccess = async (dto: CorporateAuthRequest) => {
  const response = await fetch(`${basePath}course/org/authenticate-user`, {
    method: "POST",
    headers: {
      ...mixedAuth.headers,
    },
    body: JSON.stringify(dto),
    credentials: "include",
  })
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
  const response = await fetch(
    `${basePath}course/quiz/scores?userId=${userId}`,
    auth
  )
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
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
