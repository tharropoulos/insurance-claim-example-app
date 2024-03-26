import ClaimsTable from "@/components/tables/claim-table";
import { Toaster } from "sonner";

export default function ClaimPage() {
    return (
        <main className="relative flex min-h-screen w-full justify-start lg:container ">
            <div className="flex w-full flex-col  pt-5 lg:pt-4">
                <h1 className="text-4xl font-bold tracking-tighter">Claims</h1>
                <h5 className="text-lg text-slate-400 dark:text-slate-500">
                    Here you can manage all your claims
                </h5>
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
