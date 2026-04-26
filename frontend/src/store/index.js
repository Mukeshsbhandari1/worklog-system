import { create } from 'zustand';
export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    setUser: (user) => set({ user, isAuthenticated: true }),
    setToken: (token) => set({ token }),
    logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    load: () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
            set({
                token,
                user: JSON.parse(user),
                isAuthenticated: true,
            });
        }
    },
}));
export const useUIStore = create((set) => ({
    sidebarOpen: true,
    darkMode: false,
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    toggleDarkMode: () => {
        set((state) => {
            const newMode = !state.darkMode;
            if (newMode) {
                document.documentElement.classList.add('dark');
            }
            else {
                document.documentElement.classList.remove('dark');
            }
            localStorage.setItem('darkMode', newMode.toString());
            return { darkMode: newMode };
        });
    },
}));
