"use client"

import {Card, CardContent} from "@/components/ui/card";
import Image from "next/image";
import Title from "@/src/components/atoms/Title";
import {Button} from "@/components/ui/button";
import {FaBook, FaExternalLinkAlt, FaGithub} from "react-icons/fa";
import Link from "next/link";
import { motion } from "motion/react";


type CardProps = {
    title: string;
    description: string;
    imageLink: string;
    tags: string[];
    codeLink: string | null;
    demoLink: string | null;
    projectId: string;
}

const ProjectCard = (cardProps: CardProps) => {

    return (
        <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    transition={{
                        duration: 0.4,
                        scale: { type: "spring", visualDuration: 0.4, bounce: 0.2 },
                    }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }} >

            <Card className="pt-6 h-full hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none cursor-pointer" onClick={() => window.open("/personalProjects/" + cardProps.projectId)}>
                <CardContent className={"space-y-4 px-6 flex flex-col grow"}>

                    <Image width={250} height={200} className={"rounded-base w-full h-54 object-cover shadow-shadow border-2 border-black hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"} src={cardProps.imageLink} alt={`Screenshot du projet ${cardProps.title}`}></Image>

                    <Title textLevel={"h3"} className="text-xl font-heading">{cardProps.title}</Title>

                    <p className={"font-base text-justify text-sm flex-grow"}>
                        {cardProps.description}
                    </p>

                    {
                        /**
                         *                 <div className={"flex flex-wrap gap-2"}>
                         *
                         *                     {
                         *                         cardProps.tags.map(((tag, key) => (
                         *                                 <Badge key={key}>{tag}</Badge>
                         *                         )))
                         *                     }
                         *
                         *                 </div>
                         */
                    }

                    <div className={"grid grid-cols-1 md:grid-cols-2 gap-4 min-h-24"}>
                        <Link className={"w-full"} href={"/personalProjects/" + cardProps.projectId} >
                            <Button className={"cursor-pointer bg-purple-400 w-full"} > <FaBook/> Explication</Button>
                        </Link>

                        { cardProps.codeLink && (
                            <Button onClick={() => window.open(cardProps.codeLink!)} className={"cursor-pointer bg-blue-400"} > <FaGithub/> Code</Button>
                        ) }


                        { cardProps.demoLink && (
                            <Button onClick={() => window.open(cardProps.demoLink!)} className={"cursor-pointer bg-yellow-400"} > <FaExternalLinkAlt/> Demo</Button>
                        ) }
                    </div>

                </CardContent>
            </Card>
        </motion.div>

    )
}

export default ProjectCard;