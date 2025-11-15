import type { Metadata } from "next";
import "@/src/assets/styles/globals.css";
import Footer from "@/src/components/organisms/Footer";
import Script from "next/script";

export const metadata: Metadata = {
    title: "Falézan Thibault",
    description: "Portfolio de Thibault Falézan, étudiant en informatique à l’IUT de Vannes et alternant chez BJ75 BIC. Découvrez ses projets web, plugins, expériences et compétences techniques."
};

export function HeadSchema() {
    return (
        <Script id="person-schema" type="application/ld+json">
            {`
      {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Thibault Falézan",
        "jobTitle": "Étudiant en informatique",
        "url": "https://thibaultfalezan.com",
        "sameAs": [
          "https://github.com/Thibault0712",
          "https://www.linkedin.com/in/thibaultfalezan"
        ],
        "image": "https://thibaultfalezan.com/img/profilePicture.png",
        "alumniOf": {
          "@type": "CollegeOrUniversity",
          "name": "IUT de Vannes"
        },
        "worksFor": {
          "@type": "Organization",
          "name": "BIC - BJ75",
        },
        "hasOccupation": [
          {
            "@type": "Occupation",
            "name": "Alternance en développement logiciel",
            "description": "Développement de projets front-end et back-end, intégration Kotlin / Spring Boot et ReactJS",
            "startDate": "2025-10-20"
          },
          {
            "@type": "Occupation",
            "name": "Étudiant en informatique",
            "description": "Réalisation de projets web et applications Java, apprentissage des bonnes pratiques et travail collaboratif",
            "startDate": "2024-09-01"
          }
        ],
        "knowsAbout": ["ReactJS", "TypeScript", "Kotlin", "Spring Boot", "Java", "Arduino", "SQL", "Docker", "Git"],
        "mainEntityOfPage": "https://thibaultfalezan.com"
      }
      `}
        </Script>
    );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
          <title>Falézan Thibault</title>
            <HeadSchema />
      </head>
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}
