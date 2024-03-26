"use client";
import ClaimsTable from "@/components/tables/claim-table";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import { useRouter } from "next/navigation";

export default function ClaimPage() {
    const router = useRouter();
    return (
        <main className="relative flex min-h-screen w-full justify-start lg:container ">
            <div className="flex w-full flex-col  pt-5 lg:pt-4">
                <div className="flex w-full justify-between">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tighter">Claims</h1>
                        <h5 className="text-lg text-slate-400 dark:text-slate-500">
                            Here you can manage all your claims
                        </h5>
                    </div>
                    <Button variant={"default"} onClick={() => router.push("/claims/create")}>
                        Create Claim
                    </Button>
                </div>
                <ClaimsTable />
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
