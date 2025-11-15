"use client"

import React from 'react';
import ExperienceCard from "@/src/components/molecules/ExperienceCard";
import TitleCard from "@/src/components/molecules/TitleCard";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel";
import { motion } from "motion/react";

interface ExperienceEntry {
    company: string;
    role: string;
    years: string;
    description: string[];
    technologies: string[]
    isCompany: boolean;
}

const experiences: ExperienceEntry[] = [
    {
        company: "BIC - BJ75",
        role: "Alternance en développement logiciel",
        years: "2025 - Présent",
        description: [
            "Participation au développement d'une application interne destinée à améliorer la productivité et la gestion des processus métiers.",
            "Mise en place de fonctionnalités backend en Kotlin avec Spring Boot et intégration avec le frontend en ReactJS.",
            "Collaboration avec les équipes métier pour comprendre les besoins et proposer des solutions adaptées."
        ],
        technologies: ["ReactJS", "TypeScript", "Kotlin", "Springboot"],
        isCompany: true
    },
    {
        company: "IUT Vannes",
        role: "BUT informatique",
        years: "2024 - Présent",
        description: [
            "Réalisation de projets concrets en équipe, allant du développement web à la conception d’applications Java et bases de données.",
            "Apprentissage des bonnes pratiques de conception logicielle, de versionnement et de travail collaboratif (Git, Docker).",
            "Découverte et utilisation de technologies variées pour le développement backend et frontend.",
        ],
        technologies: ["SQL", "Java", "Ubuntu", "Javascript", "php"],
        isCompany: false
    },
    {
        company: "Lycée la croix rouge la salle",
        role: "Bac STI2D section Européene - mention très bien",
        years: "2021 - 2024",
        description: [
            "Participation à deux éditions des Olympiades des Sciences de l’Ingénieur avec un projet de remorque électrique pour vélo.",
            "Développement de prototypes à l’aide de microcontrôleurs Arduino."
        ],
        technologies: ["Arduino"],
        isCompany: false
    },
];


const ExperienceSection = () => {
    return (
        <section id={"mes-experiences"} className="flex flex-col items-center justify-center gap-8 md:gap-14 w-full px-4 py-10 md:pb-20 lg:px-12 xl:px-48">

            <div className={"w-full text-center"}>
                <TitleCard>Mes expériences</TitleCard>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                style={{ opacity: 1 }}
                transition={{
                    duration: 0.4,
                    scale: { type: "spring", visualDuration: 0.4, bounce: 0.2 },
                }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                className="w-full max-w-6xl sm:px-16 flex-col items-center gap-4 flex">
                <Carousel aria-label="Mes expériences professionnelles et éducatives" className="w-full mx-auto">
                    <CarouselContent className={"mx-auto"}>
                        {experiences.map((exp, index) => (
                            <CarouselItem className={"p-[10px]"} key={index}>
                                <ExperienceCard  key={index} {...exp} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious
                        className={"rounded-xl -left-2 sm:-left-12 top-[calc(50%-10px)] disabled:opacity-0 sm:disabled:opacity-50"}
                    />
                    <CarouselNext
                        className={"rounded-xl -right-2 sm:-right-12 top-[calc(50%-10px)] disabled:opacity-0 sm:disabled:opacity-50"}
                    />
                </Carousel>
            </motion.div>

        </section>
    );
};

export default ExperienceSection;