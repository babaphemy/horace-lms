import { auth, basePath, PostSettings } from './setting';
const getUsers = async (signal: AbortSignal) => {
  const resp = await fetch(`${basePath}user/users`, { signal });
  return resp.json();
};
const loginUser = async (data: {
  email: string;
  password: string | number;
  type?: string;
}) => {
  const resp = await fetch(`${basePath}user/login`, PostSettings(data));
  if (!resp.ok) {
    throw new Error(resp.statusText);
  }
  return resp.json();
};

const registerUser = async (data: any) => {
  const resp = await fetch(`${basePath}user/add`, PostSettings(data));
  if (!resp.ok) {
    throw new Error(resp.statusText);
  }
  return resp.json();
};

const verifyEmail = async (email: string) => {
  const resp = await fetch(`${basePath}user/exists/${email}`, auth);
  if (!resp.ok) {
    throw new Error(resp.statusText);
  }
  return resp.text();
};

const doToken = async (data: { email: string; type: string }) => {
  const resp = await fetch(`${basePath}user/dotoken`, PostSettings(data));

  if (!resp.ok) {
    throw new Error(resp.statusText);
  }

  return resp.text();
};

const resetPass = async (data: {
  token: string | number;
  email: string;
  password: string | number;
}) => {
  const resp = await fetch(
    `${basePath}user/reset/password`,
    PostSettings(data)
  );
  if (!resp.ok) {
    throw new Error(resp.statusText);
  }
  return resp.text();
};

const fetchCourses = async () => {
  const response = await fetch(`${basePath}course/courses`, auth);
  if (!response.ok) {
    return { error: response.status };
  }
  return response.json();
};
const fetchCourse = async (id: string) => {
  const response = await fetch(`${basePath}course/${id}`, auth);
  if (!response.ok) {
    return { error: response.status };
  }
  return response.json();
};
const addUserCourse = async (data: { id: string; user: string }) => {
  const response = await fetch(`${basePath}reg/add`, PostSettings(data));
  if (!response.ok) {
    return { error: response.status };
  }
  return response.json();
};
const isCourseReg = async (id: string) => {
  const response = await fetch(`${basePath}reg/my/${id}`, auth);
  if (!response.ok) {
    return { error: response.status };
  }
  return response.json();
};
const contactUs = async (data: {
  firstname: string;
  lastname: string;
  email: string;
  message: string;
  type: string;
  phone?: string;
}) => {
  const response = await fetch(
    `${basePath}contact/essl/new`,
    PostSettings(data)
  );
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.text();
};
const getCourseLecture = async (data: {
  id: string;
  user: string;
  count: number | null;
}) => {
  const response = await fetch(`${basePath}course/lecture`, PostSettings(data));
  if (!response.ok) {
    return { error: response.status };
  }
  return response.json();
};
const addReview = async (data: any) => {
  const response = await fetch(`${basePath}post/addmeta`, PostSettings(data));
  if (!response.ok) {
    return { error: response.status };
  }
  return response.json();
};

export {
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
};
