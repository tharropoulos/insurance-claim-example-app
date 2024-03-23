"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { userAuthSchema } from "@/lib/validations/user";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { UpdateIcon, EnvelopeClosedIcon } from "@radix-ui/react-icons";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordInput } from "../password-input";
import { useRouter } from "next/navigation";
import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "@/lib/axios";
import useAuth from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

type Inputs = z.infer<typeof userAuthSchema>;

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

interface RegisterSuccessResponse {
    message: string;
    access_token: string;
    refresh_token: string;
}

interface SignUpErrorResponse {
    error: string;
}

export function SignUpForm({ className, ...props }: UserAuthFormProps) {
    const router = useRouter();
    const form = useForm<Inputs>({
        resolver: zodResolver(userAuthSchema),
    });

    const [authenticating, isAuthenticated] = useAuth();
    const [isPending, startTransition] = React.useTransition();
    async function onSubmit(data: Inputs) {
        startTransition(async () => {
            try {
                const response = await axiosInstance
                    .post<RegisterSuccessResponse, AxiosResponse<RegisterSuccessResponse>, Inputs>(
                        "api/auth/register",
                        {
                            password: data.password,
                            email: data.email,
                        },
                    )
                    .then((response) => {
                        toast.success(response.data.message);
                        localStorage.setItem("jwt", response.data.access_token);
                        localStorage.setItem("refresh_token", response.data.refresh_token);
                        router.push("/");
                    })
                    .catch((error: AxiosError<SignUpErrorResponse>) => {
                        toast.error(error.response?.data.error);
                        console.log(error);
                    });
            } catch (err) {
                console.log(err);
                toast.error("Something went wrong");
            }
        });
    }

    if (authenticating) {
        return (
            <form className="mx-2 flex w-full flex-col items-start gap-4">
                <div className="flex w-full flex-col gap-3">
                    <Skeleton className={cn("h-4 w-24", className)} />
                    <Skeleton className={cn("h-8 w-full", className)} />
                </div>
                <div className="flex w-full flex-col gap-3">
                    <Skeleton className={cn("h-4 w-24", className)} />
                    <Skeleton className={cn("h-8 w-full", className)} />
                </div>
                <Skeleton className={cn("mt-4 h-8 w-full", className)} />
            </form>
        );
    }
    if (isAuthenticated) {
        return (
            <div className="flex w-full items-center justify-center text-center">
                <h2 className="text-xl">You're already authenticated</h2>
            </div>
        );
    }
    return (
        <div className={cn("flex flex-col gap-6 text-center", className)} {...props}>
            <Form {...form}>
                <form
                    className="mx=2 flex w-full flex-col items-start gap-4"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="w-full text-start">
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-background"
                                        id="email"
                                        placeholder="johncarmack@gmail.com"
                                        autoCorrect="off"
                                        autoCapitalize="none"
                                        disabled={isPending}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="w-full text-start">
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <PasswordInput
                                        className="bg-background"
                                        id="password"
                                        placeholder="**********"
                                        autoCorrect="off"
                                        autoCapitalize="none"
                                        disabled={isPending}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <motion.div
                        initial={{ scale: 0.9, rotate: 180, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0.9, rotate: -180, opacity: 0 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                    ></motion.div>
                    <Button
                        className={cn(
                            "relative mt-4 inline-flex w-full items-center justify-center overflow-hidden rounded-md  text-sm font-medium shadow-sm disabled:pointer-events-none",
                            className,
                        )}
                        disabled={isPending}
                    >
                        <motion.span
                            initial={false}
                            animate={{ y: isPending ? "0%" : "-100%" }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <UpdateIcon className="h-4 animate-spin" />
                        </motion.span>
                        <motion.span
                            className="flex items-center justify-center gap-2 px-3 py-2.5"
                            initial={false}
                            animate={{ y: isPending ? "100%" : "0%" }}
                        >
                            <EnvelopeClosedIcon className="h-4" />
                            Sign Up
                        </motion.span>
                        <span className="sr-only">Sign Up</span>
                    </Button>
                </form>
            </Form>
        </div>
    );
}
export default SignUpForm;
