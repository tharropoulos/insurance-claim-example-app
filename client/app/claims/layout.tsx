import { SiteHeader } from "@/components/site-header";

interface MarketingLayoutProps {
    children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
    return (
        <>
            <SiteHeader />
            {children}
        </>
    );
}
