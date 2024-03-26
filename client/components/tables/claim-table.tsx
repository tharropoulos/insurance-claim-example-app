"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { AuthButton } from "../auth-button";
import useAuth from "@/hooks/use-auth";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import * as React from "react";
import { z } from "zod";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";
import { getClaimDTO } from "@/lib/validations/claim";

interface ClaimResponse {
    claims: z.infer<typeof getClaimDTO>[];
    pages: number;
    total: number;
    current_page: number;
}
export function ClaimsTable() {
    const router = useRouter();
    const [isAuthenticating, isAuthenticated] = useAuth();
    const [loadingData, setLoadingData] = React.useState(true);

    const [initialData, setInitialData] = React.useState<ClaimResponse>();

    React.useEffect(() => {
        axiosInstance
            .get<ClaimResponse>("/api/claims", {
                params: {
                    page: 1,
                    per_page: 1000,
                },
            })
            .then((response) => {
                console.log(response.data); // log the response data
                // const parse = z.array(getManyClaimDTO).safeParse(response.data.claims);
                // if (!parse.success) {
                //     console.log(parse.error);
                //     return toast.error("Error fetching claims");
                // }
                setInitialData(response.data);
                setLoadingData(false);
            })
            .catch((error) => {
                setLoadingData(false);
                console.log(error);
                toast.error("something went wrong");
            });
    }, []);
    React.useEffect(() => {
        console.log("USE EFFECT", initialData); // log initialData whenever it updates
    }, [initialData]);

    if (isAuthenticating || loadingData) {
        return (
            <div className="flex w-full flex-col gap-3">
                <Skeleton className="h-5 " />
                <Skeleton className="h-5 " />
                <Skeleton className="h-5 " />
                <Skeleton className="h-5 " />
                <Skeleton className="h-5 " />
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
        <Table className="w-full ">
            <TableCaption>A list of your recent claims.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Policy Number</TableHead>
                    <TableHead>Accident Type</TableHead>
                    <TableHead>Damage Details</TableHead>
                    <TableHead>Injuries Reported</TableHead>
                    <TableHead>Date of Accident</TableHead>
                    <TableHead>Number of Images</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {initialData &&
                    initialData.claims.map((claim) => (
                        <TableRow
                            key={claim.id}
                            className="cursor-pointer"
                            onClick={() => router.push(`/claims/${claim.id}`)}
                        >
                            <TableCell>{claim.policy_number}</TableCell>
                            <TableCell>{claim.accident_type}</TableCell>
                            <TableCell>{claim.damage_details}</TableCell>
                            <TableCell>
                                {new Date(claim.date_of_accident).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                <Checkbox
                                    className="pointer-events-none"
                                    disabled
                                    checked={claim.injuries_reported}
                                />
                            </TableCell>
                            <TableCell>{claim.images.length}</TableCell>
                        </TableRow>
                    ))}
            </TableBody>
        </Table>
    );
}

export default ClaimsTable;
