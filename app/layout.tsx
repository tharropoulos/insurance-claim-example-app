import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

type RootLayoutProps = {
    children: React.ReactNode;
};

export const metadata = {
    title: "Insurance Claims",
    description: "Made with Next.js and TypeScript.",
};

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <>
            <html lang="en" suppressHydrationWarning>
                <head />
                <body
                    className={cn(
                        "min-h-screen bg-background font-sans antialiased",
                        GeistSans.variable,
                    )}
                >
                    <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
                        {children}
                    </ThemeProvider>
                </body>
            </html>
        </>
    );
}
