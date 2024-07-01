import { create } from 'zustand';
import axios from 'axios';
import { User } from '../types/User';
import { persist, createJSONStorage } from 'zustand/middleware'

const url = "http://localhost:8081/util";


interface UserStoreState {
  user: User | null;
  isLoading: boolean;
  error: any; // Adjust type based on your error handling
  token: string | null;
  setToken: (token: string | null) => void;
  fetchUser: () => Promise<void>;
}

// Define the function to fetch the current user
async function getCurrentUser() {
  try {
    const response = await axios.get(url + "/profile", {
      headers: {
        Authorization: `Bearer ${useUserStore.getState().token}`,
      }
    });
    console.log(response.data);

    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 404) {
      return null;
    }
    throw e; // Re-throw the error for other cases
  }
}

// Create a Zustand store
const useUserStore = create<UserStoreState>()(

  persist((set) => ({
    user: null,
    isLoading: false,
    error: null,
    token: null,
    setToken: (token) => set({ token }),
    fetchUser: async () => {
      set({ isLoading: true, error: null });
      try {
        const user = await getCurrentUser();
        set({ user, isLoading: false });
      } catch (error) {
        set({ error, isLoading: false });
      }
    }
  }), { name: 'userStore' })

);

export default useUserStore;
