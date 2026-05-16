import axios from "axios";

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

axios.defaults.baseURL = apiUrl;
axios.defaults.withCredentials = true; // Include cookies in requests

export default axios;
