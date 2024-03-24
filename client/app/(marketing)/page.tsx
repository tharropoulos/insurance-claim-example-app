import { AuthButton } from "@/components/auth-button";

export default async function IndexPage() {
    return (
        <main className="flex min-h-screen flex-col items-center  gap-5 p-10 lg:p-24">
            <section className="md:py-18 flex w-full flex-col items-center  justify-center space-y-2 py-8 text-center md:py-24 lg:py-20">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                        File your claim with ease
                    </h1>
                    <p className="max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Submit your claim and get back to normal life. Our process is fast, secure,
                        and hassle-free.
                    </p>
                </div>
                <div className="mx-auto w-full max-w-sm space-y-2">
                    <AuthButton className="text-lg" />
                </div>
            </section>
            <section className="md:py-18 w-full py-8 lg:py-20">
                <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
                    <div className="space-y-3">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                            How it works
                        </h2>
                        <p className="mx-auto max-w-[600px]  text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Our simple three-step process makes it easy to file your claim.
                        </p>
                    </div>
                    <div className="mx-auto grid max-w-sm items-center gap-4 lg:gap-6">
                        <div className="flex items-center space-x-4">
                            <div className="flex aspect-square w-[30px] items-center justify-center  rounded-full border border-gray-200 bg-gray-950 text-gray-50 dark:border-gray-800 dark:bg-gray-50 dark:text-gray-950">
                                1
                            </div>
                            <div className="grid  gap-1 text-start">
                                <h3 className="font-semibold">Enter Information</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Fill out the form with your details
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex aspect-square w-[30px] items-center justify-center  rounded-full border border-gray-200 bg-gray-950 text-gray-50 dark:border-gray-800 dark:bg-gray-50 dark:text-gray-950">
                                2
                            </div>
                            <div className="grid  gap-1 text-start">
                                <h3 className="font-semibold">Upload Documents</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Attach any necessary files
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex aspect-square w-[30px] items-center justify-center  rounded-full border border-gray-200 bg-gray-950 text-gray-50 dark:border-gray-800 dark:bg-gray-50 dark:text-gray-950">
                                3
                            </div>
                            <div className="grid  gap-1 text-start">
                                <h3 className="font-semibold">Submit Claim</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Review and send your claim
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
