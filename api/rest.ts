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
export { getUsers, loginUser, fetchCourses, fetchCourse };
