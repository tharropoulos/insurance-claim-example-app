"use client";

import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import useAuth from "@/hooks/use-auth";
import axiosInstance from "@/lib/axios";
import { cn } from "@/lib/utils";
import { createClaimDTO, createClaimSchema } from "@/lib/validations/claim";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, UpdateIcon } from "@radix-ui/react-icons";
import { AxiosResponse } from "axios";
import { format } from "date-fns";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { motion } from "framer-motion";
import { AuthButton } from "../auth-button";
import { Button } from "../ui/button";

type Inputs = z.infer<typeof createClaimSchema> & Record<string, unknown>;

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

interface ClaimCreateSuccessResponse {
    claim_id: number;
    message: string;
    token: string;
}

export function CreateClaimForm({ className, ...props }: UserAuthFormProps) {
    const form = useForm<Inputs>({
        resolver: zodResolver(createClaimSchema),
    });

    const [authenticating, isAuthenticated] = useAuth();
    const [isPending, startTransition] = React.useTransition();
    async function onSubmit(data: Inputs) {
        startTransition(async () => {
            try {
                const images = Array.from(data.images).reduce(
                    (acc: { [key: number]: File }, file, index) => {
                        acc[index] = file;
                        return acc;
                    },
                    {},
                );

                await axiosInstance
                    .post<
                        ClaimCreateSuccessResponse,
                        AxiosResponse<ClaimCreateSuccessResponse>,
                        z.infer<typeof createClaimDTO>
                    >(
                        "/api/claims",
                        {
                            ...data,
                            images,
                        },
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        },
                    )
                    .then((response) => {
                        toast.success(response.data.message);
                    })
                    .catch(() => {
                        toast.error("Something went wrong");
                    });
            } catch (err) {
                toast.error("Something went wrong");
            }
        });
    }

    if (authenticating) {
        return (
            <form className="mx-2 mt-4 flex w-full flex-col items-start gap-4">
                <div className="flex w-full flex-col gap-3">
                    <Skeleton className={cn("h-4 w-24", className)} />
                    <Skeleton className={cn("h-8 w-full", className)} />
                </div>
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
    if (!isAuthenticated) {
        return (
            <div className="mt-4 flex w-full flex-col items-center justify-center gap-5 text-center">
                <h2 className="text-xl">You&apos;re not authenticated</h2>
                <h1 className="text-5xl">:(</h1>
                <AuthButton />
            </div>
        );
    }
    return (
        <div className={cn("mt-4 flex flex-col gap-6 text-center", className)} {...props}>
            <Form {...form}>
                <form
                    className=" flex w-full flex-col items-start gap-4"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormField
                        control={form.control}
                        name="policy_number"
                        render={({ field }) => (
                            <FormItem className="w-full text-start">
                                <FormLabel htmlFor="policy_number">Policy Number</FormLabel>
                                <FormControl>
                                    <Input
                                        id="policy_number"
                                        placeholder="pol-123456"
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
                        name="date_of_accident"
                        render={({ field }) => (
                            <FormItem className="flex w-full flex-col text-start">
                                <FormLabel>Date of Accident</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground",
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="accident_type"
                        render={({ field }) => (
                            <FormItem className="w-full text-start">
                                <FormLabel htmlFor="accident_type">Accident Type</FormLabel>
                                <FormControl>
                                    <Input
                                        id="accident_type"
                                        placeholder="Property damage"
                                        className="bg-background"
                                        autoCapitalize="none"
                                        autoCorrect="off"
                                        disabled={isPending}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                <FormDescription>
                                    The type of accident (e.g. car accident, property damage)
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="w-full text-start">
                                <FormLabel htmlFor="description">Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Describe the accident in detail"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="damage_details"
                        render={({ field }) => (
                            <FormItem className="w-full text-start">
                                <FormLabel htmlFor="damage_details">Damage Details</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Describe the damage suffered"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="injuries_reported"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        className={cn("dark:border-slate-700", className)}
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormLabel>Where there any injuries?</FormLabel>
                                <FormDescription></FormDescription>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem className="w-full text-start">
                                <FormLabel htmlFor="images">Policy Number</FormLabel>
                                <FormControl>
                                    <Input
                                        id="images"
                                        type="file"
                                        onChange={(e) =>
                                            field.onChange([...(e.target.files ?? [])] as File[])
                                        }
                                        className="bg-background"
                                        multiple
                                        disabled={isPending}
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
                            "relative mt-2 inline-flex w-full items-center justify-center overflow-hidden rounded-md  text-sm font-medium shadow-sm disabled:pointer-events-none",
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
                            Submit
                        </motion.span>
                        <span className="sr-only">Sign Up</span>
                    </Button>
                </form>
            </Form>
        </div>
    );
}
export default CreateClaimForm;
