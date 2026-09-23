"use client";

import Link from "next/link";
import { ArrowLeft, RotateCcw, TriangleAlert } from "lucide-react";
import { Card, CardContent } from "@/src/ui/components/atoms/shadcnUI/card";
import { Button } from "@/src/ui/components/atoms/shadcnUI/button";

type GlobalErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
    const status = getErrorStatus(error.message);
    const errorContent = getErrorContent(status);

    return (
        <main className="flex h-screen items-center justify-center bg-[linear-gradient(to_right,#8080804D_1px,transparent_1px),linear-gradient(to_bottom,#80808090_1px,transparent_1px)] bg-size-[60px_60px] px-4 py-24 sm:px-8">
            <Card className="w-full max-w-2xl border-4 bg-main p-1 sm:p-2 md:p-4">
                <CardContent className="flex flex-col items-center gap-8 px-4 py-8 text-center sm:gap-10 sm:px-6 sm:py-10">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-border bg-secondary-background shadow-shadow">
                        <TriangleAlert aria-hidden="true" className="h-10 w-10" />
                    </div>

                    <div className="max-w-2xl space-y-8">
                        <h1 className="text-4xl leading-tight sm:text-4xl">{errorContent.title}</h1>
                        <p className="mx-auto max-w-md leading-7 text-foreground/80 text-xl">
                            {errorContent.description}
                        </p>
                    </div>

                    <div className="flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
                        <Button
                            type="button"
                            onClick={reset}
                            variant="neutral"
                            className="min-h-12 px-5 text-xl font-bold cursor-pointer"
                        >
                            <RotateCcw aria-hidden="true" className="h-5 w-5" />
                            Réessayer
                        </Button>
                        <Button asChild variant="neutral" className="min-h-12 px-5 font-bold text-xl">
                            <Link
                                href="/"
                            >
                                <ArrowLeft aria-hidden="true" className="h-5 w-5" />
                                Retour à l&apos;accueil
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}

function getErrorStatus(message: string) {
    // Parsed due to error 5xx which cannot be shared with the front...
    const status = message.match(/^\[APP_STATUS:(\d{3})/)?.[1];

    return status ? Number(status) : undefined;
}

function getErrorContent(status?: number) {

    if (status === 400) {
        return {
            title: "La demande n’a pas abouti",
            description: "Vérifiez l’adresse et réessayez.",
        };
    }

    if (status === 401 || status === 403) {
        return {
            title: "Cette page n’est pas accessible",
            description: "Vous n’avez pas accès à cette page.",
        };
    }

    if (status === 408 || status === 504) {
        return {
            title: "La réponse tarde à arriver",
            description: "Réessayez dans quelques instants.",
        };
    }

    if (status === 429) {
        return {
            title: "Un petit moment, s’il vous plaît",
            description: "Réessayez un peu plus tard.",
        };
    }

    if (status !== undefined && status >= 500 && status < 600) {
        return {
            title: "Le service fait une pause",
            description: "Réessayez dans quelques instants.",
        };
    }

    return {
        title: "Impossible d'afficher la page",
        description: "Vérifiez votre connexion et réessayez.",
    };
}
