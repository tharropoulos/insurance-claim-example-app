import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

function useAuth(): [boolean, boolean] {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axiosInstance.get("/api/auth/whoami");
                // If the request succeeds, the user is authenticated
                if (response.status === 200) {
                    console.log(response);
                    setIsAuthenticated(true);
                } else {
                    throw new Error("Not authenticated");
                }
            } catch (error) {
                // If the request fails, the user is not authenticated
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    return [loading, isAuthenticated];
}

export default useAuth;
