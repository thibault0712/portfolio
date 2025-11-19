import Footer from "@/src/components/organisms/Footer";
import Script from "next/script";
import "@/src/assets/styles/globals.css";
import React from "react";

export const metadata = {
    title: "Portfolio - Falézan Thibault",
    description:
        "Portfolio de Thibault Falézan, étudiant en informatique à l’IUT de Vannes et alternant chez BJ75 BIC. Découvrez ses projets web, plugins, expériences et compétences techniques.",

    // Favicon
    icons: {
        icon: "/icon.png",
    },

    // Open Graph
    openGraph: {
        title: "Falézan Thibault",
        description:
            "Portfolio de Thibault Falézan, étudiant en informatique à l’IUT de Vannes et alternant chez BJ75 BIC. Découvrez ses projets web, plugins, expériences et compétences techniques.",
        url: "https://portfolio.thibaultfalezan.com",
        type: "website",
        images: [
            {
                url: "https://portfolio.thibaultfalezan.com/img/profilePicture.webp",
                width: 800,
                height: 800,
                alt: "Photo de Thibault Falézan",
            },
        ],
    },

    // Twitter Card
    twitter: {
        card: "summary_large_image",
        title: "Falézan Thibault",
        description:
            "Portfolio de Thibault Falézan, étudiant en informatique à l’IUT de Vannes et alternant chez BJ75 BIC. Découvrez ses projets web, plugins, expériences et compétences techniques.",
        images: ["https://portfolio.thibaultfalezan.com/img/profilePicture.webp"],
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
        name: "Thibault Falézan",
        jobTitle: "Étudiant en informatique",
        url: "https://portfolio.thibaultfalezan.com",
        image: "https://portfolio.thibaultfalezan.com/img/profilePicture.webp",
        sameAs: [
            "https://github.com/Thibault0712",
            "https://www.linkedin.com/in/thibaultfalezan",
        ],
    };

    return (
        <html lang="fr">
        <head>
            <title>Portfolio - Falézan Thibault</title>

            {/* JSON-LD Schema (Schéma de données structurées) */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Google Analytics - Utilise next/script pour une gestion optimisée */}
            <Script
                async
                src="https://www.googletagmanager.com/gtag/js?id=G-ZNSY0F65R6"
            ></Script>
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
        </head>
        <body>
        {children}
        <Footer />
        </body>
        </html>
    );
}