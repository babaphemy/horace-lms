import { useState } from "react"

const useAuth = () => {
  const [users] = useState<any>([])
  const [loading] = useState<boolean>(false)
  // useEffect(() => {
  // 	setLoading(true);
  // 	let contr = new AbortController();
  // 	async function aUsers() {
  // 		const all = await getUsers(contr.signal);
  // 		setUsers(all);
  // 		setLoading(false);
  // 	}
  // 	aUsers();
  // 	return () => {
  // 		contr.abort();
  // 	};
  // }, []);

  return [users, loading]
}

export default useAuth
