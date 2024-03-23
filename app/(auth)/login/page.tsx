import LoginForm from "@/components/forms/login-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Toaster } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Login() {
    return (
        <div className=" flex h-screen w-screen items-center justify-center ">
            <Link
                href="/"
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "absolute left-4 top-4 z-50 lg:left-8 lg:top-8",
                )}
            >
                <ChevronLeftIcon className="mr-2 h-4 w-4" />
                Back
            </Link>
            <div className="z-30 flex h-full w-full flex-col justify-center lg:bg-[radial-gradient(#374151,transparent_2px)] lg:[background-size:48px_48px] lg:[mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] ">
                <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-bold tracking-tight">Insurance Claims</h1>
                        <div className="flex items-center justify-center gap-3">
                            <p className="text-sm text-muted-foreground">Welcome back!</p>
                        </div>
                    </div>
                    <LoginForm />
                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link
                            href="/register"
                            className="hover:text-brand underline underline-offset-4"
                        >
                            Register
                        </Link>
                    </p>
                </div>
            </div>{" "}
            <div className="absolute top-0 z-[1] h-full w-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(31,41,55,0.8),rgba(255,255,255,0))]"></div>
            <Toaster
                position="bottom-left"
                toastOptions={{
                    style: {
                        background: "hsl(var(--background))",
                        placeSelf: "flex-start",
                        color: "hsl(var(--foreground))",
                        border: "1px solid hsl(var(--border))",
                    },
                }}
            />
        </div>
    );
}
