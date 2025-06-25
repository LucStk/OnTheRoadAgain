export const alice = {
  email: 'alice@example.com',
  username: 'alice',
  password: 'alicepassword',
};

export const bob = {
  email: 'bob@example.com',
  username: 'bob',
  password: 'bobpassword',
};

export function generateRandomUser() {
  const id = Math.random().toString(36).substring(2, 10)
  return {
    username: `user_${id}`,
    email: `test_${id}@example.com`,
    password: 'StrongPassword123!',
  }
}