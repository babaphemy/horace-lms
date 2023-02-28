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
  return resp.json();
};

const registerUser = async (data: any) => {
  const resp = await fetch(`${basePath}user/add`, PostSettings(data));
  return resp.json();
};

const verifyEmail = async (email: string) => {
  const resp = await fetch(`${basePath}user/exists/${email}`, auth);
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
};
