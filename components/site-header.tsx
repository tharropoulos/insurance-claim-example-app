import Link from "next/link";
import React from "react";

export function SiteHeader() {
    return (
        <header className="sticky top-0 flex h-14 w-full items-center bg-background px-4 lg:container">
            <Link className="flex items-center justify-center" href="#">
                <MountainIcon className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
            </Link>
            <nav className="ml-auto flex gap-4 sm:gap-6">
                <Link className="text-sm font-medium underline-offset-4 hover:underline" href="#">
                    Features
                </Link>
                <Link className="text-sm font-medium underline-offset-4 hover:underline" href="#">
                    Pricing
                </Link>
                <Link className="text-sm font-medium underline-offset-4 hover:underline" href="#">
                    About
                </Link>
                <Link className="text-sm font-medium underline-offset-4 hover:underline" href="#">
                    Contact
                </Link>
            </nav>
        </header>
    );
}

function MountainIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
        </svg>
    );
}
