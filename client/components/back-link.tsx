import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { VariantProps } from "class-variance-authority";
import Link from "next/link";

// Assuming buttonVariants is exported from this file

export interface BackLinkProps
    extends React.LinkHTMLAttributes<HTMLAnchorElement>,
        VariantProps<typeof buttonVariants> {
    href: string;
}

const BackLink: React.FC<BackLinkProps> = ({ className, href, ...props }) => {
    return (
        <Link
            href={href}
            {...props}
            className={cn(
                buttonVariants({ variant: "ghost" }),
                "absolute left-4 top-4 z-50 lg:left-8 lg:top-8",
                className,
            )}
        >
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Back
        </Link>
    );
};

export { BackLink };
