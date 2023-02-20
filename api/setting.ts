const basePath = 'http://147.182.236.146:8080/campus/api/v1/';

const authKey = process.env.NEXT_PUBLIC_APIKEY;
export const auth = {
	headers: { Authorization: `Basic ${authKey}` },
};
export const PostSettings = (obj: any) => {
	return {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Basic ${authKey}`,
		},
		body: JSON.stringify(obj),
	};
};
export const DeleteSettings = (obj: any) => {
	return {
		method: 'DELETE',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Basic ${authKey}`,
		},
		body: JSON.stringify(obj),
	};
};
export const PutSettings = (obj: any) => {
	return {
		method: 'PUT',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Basic ${authKey}`,
		},
		body: JSON.stringify(obj),
	};
};

export { basePath };
