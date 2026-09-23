import Footer from "@/src/ui/components/organisms/Footer";
import Script from "next/script";
import "@/src/assets/styles/globals.css";
import React from "react";
import type { Metadata } from "next";
import {
    SITE_DESCRIPTION,
    SITE_IMAGE,
    SITE_NAME,
    SITE_SOCIAL_LINKS,
    SITE_TITLE,
    SITE_URL,
} from "@/src/config/site";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: SITE_TITLE,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        url: "/",
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
        siteName: SITE_NAME,
        images: [
            {
                url: SITE_IMAGE,
                width: 800,
                height: 800,
                alt: "Photo de Thibault Falézan",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
        images: [SITE_IMAGE],
    },
    icons: {
        icon: "/icon.png",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: SITE_NAME,
        jobTitle: "Étudiant en informatique",
        url: SITE_URL,
        image: SITE_IMAGE,
        sameAs: SITE_SOCIAL_LINKS,
    };

    return (
        <html lang="fr">
            <body>
                <Script
                    id="person-jsonld"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <Script
                    async
                    src="https://www.googletagmanager.com/gtag/js?id=G-ZNSY0F65R6"
                />
                <Script
                    id="google-analytics"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-ZNSY0F65R6');
                    `,
                    }}
                />
                {children}
                <Footer />
            </body>
        </html>
    );
}
