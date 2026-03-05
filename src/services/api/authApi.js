import { MOCK_USERS, MOCK_DELAY } from "../mock/mockData";

export const loginUser = ({ email, password, role }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS[email.toLowerCase()];
      if (!user)                      return reject(new Error("Email not registered"));
      if (user.password !== password) return reject(new Error("Wrong password"));
      if (user.role !== role)         return reject(new Error("Wrong role selected for this account"));
      resolve({
        token: user.token,
        user: { email, name: user.name, role, id: user.id },
      });
    }, MOCK_DELAY);
  });
};

// ============================================================
// REAL API - Uncomment when backend is ready
// ============================================================
// import axios from "axios";
// export const loginUser = async ({ email, password, role }) => {
//   const res = await axios.post("/api/auth/login", { email, password, role });
//   return res.data;
//   // Expected: { token: string, user: { email, name, role, id } }
// };