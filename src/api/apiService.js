import BACKEND_URL from "./backendConfig";

const BASE_URL = "http://localhost:8080/api/api.php";
import { initialMockUsers } from "./mockData";
export async function getUsers() {
  const res = await fetch(`${BACKEND_URL}/api.php?action=list_users`);
  return res.json();
}
