const BASE_URL = "http://localhost/alebrijes/api";

export async function getUsers() {
  const res = await fetch(`${BASE_URL}/users.php`);
  return res.json();
}