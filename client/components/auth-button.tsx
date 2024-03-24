"use client";
import * as React from "react";
import useAuth from "@/hooks/use-auth";
import { Button, ButtonProps } from "./ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { UpdateIcon } from "@radix-ui/react-icons";

const AuthButton: React.FC<ButtonProps> = ({ className, ...props }) => {
    const [authenticating, isAuthenticated] = useAuth();
    const router = useRouter();

    async function handleLogout() {
        try {
            localStorage.removeItem("jwt");
            localStorage.removeItem("refresh_token");
            router.push("/login");
        } catch (error) {
            console.error(error);
        }
    }

    async function handleLogin() {
        try {
            router.push("/login");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Button
            {...props}
            onClick={isAuthenticated ? handleLogout : handleLogin}
            disabled={authenticating}
            variant="default"
            className={cn("px-5 py-5 ", className)}
            type="submit"
        >
            {authenticating ? (
                <UpdateIcon className="h-4 animate-spin" />
            ) : isAuthenticated ? (
                "Logout"
            ) : (
                "Login"
            )}
        </Button>
    );
};

export { AuthButton };
