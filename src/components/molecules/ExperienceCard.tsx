// components/ExperienceCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {FaBuilding, FaSchool} from "react-icons/fa";
import Title from "@/src/components/atoms/Title";

interface ExperienceCardProps {
    company: string;
    role: string;
    years: string;
    description: string[];
    technologies: string[];
    isCompany: boolean;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ company, role, years, description, technologies, isCompany }) => {
    return (
        <Card className="rounded-base w-full pt-0 bg-background overflow-hidden mx-auto">
            <CardHeader className="p-6 pb-4 border-b-2 border-black bg-background space-y-2">

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                    <CardTitle className="text-3xl font-extrabold text-black leading-tight mb-2 sm:mb-0">
                        <Title textLevel={"h3"} >{role}</Title>
                    </CardTitle>
                    <p className="text-lg font-semibold text-black italic text-right">{years}</p>
                </div>

                <div className="flex items-center gap-3 text-lg font-semibold">
                    <span className="text-xl text-black">
                        {isCompany ? <FaBuilding aria-hidden="true"/> : <FaSchool aria-hidden="true"/>}
                    </span>
                    <p className="font-bold text-black">{company}</p>
                </div>

            </CardHeader>

            <CardContent className="px-6">
                <ul className="list-disc space-y-3 mb-6 px-6 pb-3">
                    {description.map((point, i) => (
                        <li key={i} className="marker:text-xl font-base text-justify">
                            {point}
                        </li>
                    ))}
                </ul>

                <div className="flex flex-wrap gap-3 border-t-2 pt-3">
                    {technologies.map((tech, i) => (
                        <Badge
                            key={i}
                            className="font-bold text-sm shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none cursor-default"
                        >
                            {tech}
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default ExperienceCard;