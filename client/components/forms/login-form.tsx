"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
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

type Inputs = z.infer<typeof userAuthSchema>;

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

interface LoginSuccessResponse {
    message: string;
    access_token: string;
    refresh_token: string;
}

interface LoginErrorResponse {
    error: string;
}

export function LoginForm({ className, ...props }: UserAuthFormProps) {
    const router = useRouter();
    const form = useForm<Inputs>({
        resolver: zodResolver(userAuthSchema),
    });

    const [isPending, startTransition] = React.useTransition();
    async function onSubmit(data: Inputs) {
        startTransition(async () => {
            try {
                await axiosInstance
                    .post<LoginSuccessResponse, AxiosResponse<LoginSuccessResponse>, Inputs>(
                        "api/auth/login",
                        {
                            password: data.password,
                            email: data.email,
                        },
                    )
                    .then((response) => {
                        toast.success(response.data.message);
                        localStorage.setItem("jwt", response.data.access_token);
                        localStorage.setItem("refreshToken", response.data.refresh_token);
                        router.push("/claims");
                    })
                    .catch((error: AxiosError<LoginErrorResponse>) => {
                        toast.error(error.response?.data.error);
                        console.log(error);
                    });
            } catch (err) {
                console.log(err);
                toast.error("Something went wrong");
            }
        });
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
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <FormControl>
                                    <Input
                                        id="email"
                                        placeholder="johncarmack@example.com"
                                        className="bg-background"
                                        autoCapitalize="none"
                                        autoCorrect="off"
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
                            Login
                        </motion.span>
                        <span className="sr-only">Login</span>
                    </Button>
                </form>
            </Form>
        </div>
    );
}
export default LoginForm;
