"use client";

import useAuth from "@/hooks/use-auth";
import axiosInstance from "@/lib/axios";
import { getClaimDTO } from "@/lib/validations/claim";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";
import * as React from "react";
import { z } from "zod";
import { AuthButton } from "./auth-button";
import { useRouter } from "next/navigation";

interface ClaimResponse {
    claim: z.infer<typeof getClaimDTO>;
    images: string[];
}
export function ClaimDetails({ id }: { id: number }) {
    const router = useRouter();
    const [isAuthenticating, isAuthenticated] = useAuth();
    const [loadingData, setLoadingData] = React.useState(true);

    const [initialData, setInitialData] = React.useState<ClaimResponse>();

    React.useEffect(() => {
        axiosInstance
            .get<ClaimResponse>(`/api/claims/${id}`)
            .then((res) => {
                setInitialData({ claim: res.data.claim, images: res.data.images });
                setLoadingData(false);
            })
            .catch(() => {
                setLoadingData(false);
                router.push("/claims");
            });
    }, [id, router]);

    if (isAuthenticating || loadingData) {
        return (
            <div className="mt-5 flex w-full flex-col gap-3">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-5 " />
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-5 " />
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-5 " />
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-5 " />
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-5 " />
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-5 " />
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-5 " />
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-5 " />
                <div className="flex w-full flex-col gap-3">
                    <Skeleton className="h-24 " />
                    <Skeleton className="h-24 " />
                </div>
            </div>
        );
    }
    if (!isAuthenticated) {
        return (
            <div className="mt-4 flex w-full flex-col justify-center gap-5 ">
                <h2 className="text-xl">You&apos;re not authenticated</h2>
                <h1 className="text-5xl">:(</h1>
                <AuthButton className="w-1/3" />
            </div>
        );
    }

    return (
        initialData && (
            <div className="mt-5 flex w-full flex-col gap-3">
                <h1 className="text-2xl font-bold">Claim Policy</h1>
                <h2 className="text-lg">{initialData?.claim.policy_number}</h2>
                <h1 className="text-2xl font-bold">Accident Type</h1>
                <h2 className="text-lg">{initialData.claim.accident_type}</h2>
                <h1 className="text-2xl font-bold">Date of Accident</h1>
                <h2 className="text-lg">
                    {new Date(initialData?.claim.date_of_accident).toLocaleDateString()}
                </h2>
                <h1 className="text-2xl font-bold">Description</h1>
                <h2 className="text-lg">{initialData.claim.description}</h2>
                <h1 className="text-2xl font-bold">Damage Details</h1>
                <h2 className="text-lg">{initialData.claim.damage_details}</h2>
                <h1 className="text-2xl font-bold">Injuries Reported</h1>
                <h2 className="text-lg">
                    {initialData.claim.injuries_reported === true ? "Yes" : "No"}
                </h2>
                <h1 className="text-2xl font-bold">Images</h1>
                <div className="flex  flex-col gap-3">
                    {initialData.images.map((url, index) => (
                        <Image
                            src={url}
                            width="0"
                            height="0"
                            key={index}
                            sizes="100vw"
                            className="h-auto w-full rounded-lg"
                            alt={`Image ${index}`}
                        />
                    ))}
                </div>
            </div>
        )

        // <div>
        //     {initialData?.images.map((url, index) => (
        //         <img key={index} src={url} alt={`Image ${index}`} />
        //     ))}
        // </div>
    );
}

export default ClaimDetails;
