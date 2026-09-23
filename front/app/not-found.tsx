import Link from "next/link";
import { ArrowLeft, Home, TriangleAlert } from "lucide-react";
import { Card, CardContent } from "@/src/ui/components/atoms/shadcnUI/card";
import { Button } from "@/src/ui/components/atoms/shadcnUI/button";

export default function NotFound() {
    return (
        <main className="flex h-screen items-center justify-center bg-[linear-gradient(to_right,#8080804D_1px,transparent_1px),linear-gradient(to_bottom,#80808090_1px,transparent_1px)] bg-size-[60px_60px] px-4 py-24 sm:px-8">
            <Card className="w-full max-w-2xl border-4 bg-main p-1 sm:p-2 md:p-4">
                <CardContent className="flex flex-col items-center gap-8 px-4 py-8 text-center sm:gap-10 sm:px-6 sm:py-10">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-border bg-secondary-background shadow-shadow">
                        <TriangleAlert aria-hidden="true" className="h-10 w-10" />
                    </div>

                    <div className="max-w-xl space-y-8">
                        <h1 className="text-4xl leading-tight sm:text-4xl">Page introuvable</h1>
                        <p className="mx-auto leading-7 text-foreground/80 text-xl">
                            Cette page n’existe pas ou n’est plus disponible.
                        </p>
                    </div>

                    <Button asChild variant="neutral" className="min-h-12 px-5 font-bold text-xl">
                        <Link href="/">
                            <Home aria-hidden="true" className="h-5 w-5" />
                            Retour à l’accueil
                            <ArrowLeft aria-hidden="true" className="h-5 w-5 rotate-180" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
}