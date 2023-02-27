const basePath = 'https://horacelearning.com/api/v1/';
// const basePath = 'http://localhost:5071/api/v1/';

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
