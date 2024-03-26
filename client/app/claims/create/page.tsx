import CreateClaimForm from "@/components/forms/create-claim-form";
import { Toaster } from "sonner";

export default async function CreateClaimPage() {
    return (
        <main className="flex min-h-screen w-full justify-center">
            <div className="flex w-[500px] flex-col  p-5 lg:p-10 lg:pt-4">
                <h1 className="text-4xl font-bold tracking-tighter">Submit a claim</h1>
                <h5 className="text-lg text-slate-400 dark:text-slate-500">
                    Please provide some details
                </h5>
                <CreateClaimForm />
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
        </main>
    );
}
