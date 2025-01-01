import { useRouter } from "next/router";
import { useEffect } from "react";

const useAuth = (): void => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/");
            return;
        }

        const isTokenExpired = (token: string): boolean => {
            try {
                const { exp } = JSON.parse(atob(token.split(".")[1]));
                return Date.now() >= exp * 1000;
            } catch (err) {
                console.error(err);
                return true;
            }
        };

        if (isTokenExpired(token)) {
            localStorage.removeItem("token");
            router.push("/");
        }
    }, [router]);
};

export default useAuth;
