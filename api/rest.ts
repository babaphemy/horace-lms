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
export {
  getUsers,
  loginUser,
  registerUser,
  verifyEmail,
  fetchCourses,
  fetchCourse,
  doToken,
  resetPass,
};
