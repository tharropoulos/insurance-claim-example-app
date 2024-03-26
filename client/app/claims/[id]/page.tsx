import ClaimDetails from "@/components/claim";
import { Toaster } from "sonner";
import { BackLink } from "@/components/back-link";

export default function Page({ params }: { params: { id: number } }) {
    return (
        <main className="relative flex min-h-screen w-full justify-center lg:container ">
            <BackLink href="/claims" />
            <div className="flex w-1/3  flex-col pt-5 lg:pt-4">
                <h1 className="text-4xl font-bold tracking-tighter">Claim</h1>
                <ClaimDetails id={params.id} />
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
