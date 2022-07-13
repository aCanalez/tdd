const users = [
    { id: 1, username: "user1", email: "user1@mail.com", image: null, password: "password" },
    { id: 2, username: "user2", email: "user2@mail.com", image: null },
    { id: 3, username: "user3", email: "user3@mail.com", image: null },
    { id: 4, username: "user1", email: "user1@mail.com", image: null },
    { id: 5, username: "user2", email: "user2@mail.com", image: null },
    { id: 6, username: "user3", email: "user3@mail.com", image: null },
    { id: 7, username: "user3", email: "user3@mail.com", image: null },
  ];

  
const getPage = (page, size) => {
  let start = page * size;
  let end = start + size;
  let totalPages = Math.ceil(users.length / size);

  return {
    content: users.slice(start, end),
    page,
    size,
    totalPages,
  };
};

console.log(getPage(1, 4));