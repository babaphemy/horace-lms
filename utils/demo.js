const posts = [
  {
    id: '641e6d256d0f06147348a8c9',
    user: 'Femi diggs',
    message: 'This is my DSA review',
    type: 'REVIEW',
    course: '6285aed1097cff07b6a35dd5',
    createdOn: '2023-03-25T03:40:21.959',
    modifiedOn: '2023-03-25T03:40:21.959',
    like: 1,
    share: 0,
    rating: 5,
  },
  {
    id: '641f03366d0f06147348a8d3',
    user: 'User Anon',
    message:
      'this is a great course and i would recommend for anyone willing to learn DSA',
    type: 'REVIEW',
    course: '6285aed1097cff07b6a35dd5',
    createdOn: '2023-03-25T14:20:38.976',
    modifiedOn: '2023-03-25T14:20:38.978',
    like: 2,
    share: 0,
    rating: 5,
  },
  {
    id: '641f03966d0f06147348a8d5',
    user: 'User Anon',
    message:
      'this is a great course and i would recommend for anyone willing to learn DSA',
    type: 'REVIEW',
    course: '6285aed1097cff07b6a35dd5',
    createdOn: '2023-03-25T14:22:14.66',
    modifiedOn: '2023-03-25T14:22:14.662',
    like: 0,
    share: 0,
    rating: 5,
  },
  {
    id: '641f03e86d0f06147348a8d7',
    user: 'User Anon',
    message:
      'this is a great course and i would recommend for anyone willing to learn DSA',
    type: 'REVIEW',
    course: '6285aed1097cff07b6a35dd5',
    createdOn: '2023-03-25T14:23:36.85',
    modifiedOn: '2023-03-25T14:23:36.852',
    like: 4,
    share: 0,
    rating: 5,
  },
];
const likes = posts.reduce((acc, post) => {
  acc += post.like;
  return acc;
}, 0);
console.log(likes);
