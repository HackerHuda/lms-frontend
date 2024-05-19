import axios from "axios";

const BASE_URL="https://lmsbackend-pq1yj5yay-shashanks-projects-3027ed5d.vercel.app/api/v1/";

const axiosInstance=axios.create();

axiosInstance.defaults.baseURL=BASE_URL;
axiosInstance.defaults.withCredentials=true;


export default  axiosInstance;