import { useEffect, useState } from 'react';
import { getUsers } from '../api/rest';

const useAuth = () => {
	const [users, setUsers] = useState<any>([]);
	const [loading, setLoading] = useState<boolean>(false);
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

	return [users, loading];
};

export default useAuth;
