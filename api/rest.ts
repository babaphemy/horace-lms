import { basePath } from "./setting";
const getUsers = async (signal: AbortSignal) => {
  const resp = await fetch(`${basePath}user/users`, { signal });
  return resp.json();
};
export { getUsers };
