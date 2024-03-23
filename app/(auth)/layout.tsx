interface AuthLayoutProps {
    children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-background font-sans antialiased">
            <main className="flex flex-grow">{children}</main>
        </div>
    );
}
