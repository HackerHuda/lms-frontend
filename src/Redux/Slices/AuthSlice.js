import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosinstance.js";


const storedData = localStorage.getItem("data");
console.log("Stored Data:", storedData);

let parsedData = {};
try {
  parsedData = storedData ? JSON.parse(storedData) : {};
} catch (error) {
  console.error("Error parsing stored data:", error);
}
console.log("Parsed Data:", parsedData);


const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true" || false,
  role: localStorage.getItem("role") || "",
  data: parsedData,
  signData: null,
};

export const createAccount = createAsyncThunk("/auth/signup", async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("user/register", data);
      toast.promise(res, {
        loading: "Wait! Creating your account",
        success: (data) => data?.data?.message,
        error: "Failed to create account",
      });
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create account");
      return rejectWithValue(error.response.data);
    }
  });
  
  export const login = createAsyncThunk("/auth/login", async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("user/login", data);
      toast.promise(res, {
        loading: "Wait! Authentication in progress",
        success: (data) => data?.data?.message,
        error: "Failed to log in",
      });
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to log in");
      return rejectWithValue(error.response.data);
    }
  });
  
  export const logout = createAsyncThunk("/auth/logout", async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("user/logout");
      toast.promise(res, {
        loading: "Wait! Logout in progress",
        success: (data) => data?.data?.message,
      });
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to log out");
      return rejectWithValue(error.response.data);
    }
  });
  
  export const updateProfile = createAsyncThunk("/user/update/profile", async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`user/update/${data[0]}`, data[1]);
      toast.promise(response, {
        loading: "Wait! Updating your account",
        success: (data) => data?.data?.message,
        error: "Failed to update your account",
      });
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update your account");
      return rejectWithValue(error.response.data);
    }
  });
  
  export const getUserData = createAsyncThunk("/user/details", async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("user/me");
      return response.data;
    } catch (error) {
      toast.error(error?.message || "Failed to fetch user data");
      return rejectWithValue(error.response.data);
    }
  });
  
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(login.fulfilled, (state, action) => {
          const userData = action?.payload?.user;
          if (userData) {
            localStorage.setItem("data", JSON.stringify(userData));
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("role", userData.role);
            state.isLoggedIn = true;
            state.data = userData;
            state.role = userData.role;
          }
        })
        .addCase(logout.fulfilled, (state) => {
          localStorage.clear();
          state.data = {};
          state.isLoggedIn = false;
          state.role = "";
        })
        .addCase(getUserData.fulfilled, (state, action) => {
          const userData = action?.payload?.user;
          if (userData) {
            localStorage.setItem("data", JSON.stringify(userData));
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("role", userData.role);
            state.isLoggedIn = true;
            state.data = userData;
            state.role = userData.role;
          }
        });
    },
  });
  
  

export default authSlice.reducer;
