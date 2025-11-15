"use client"

import Title from "@/src/components/atoms/Title";
import SubTitle from "@/src/components/atoms/Subtitle";
import { Button } from "@/components/ui/button"
import ProfileImageCard from "@/src/components/atoms/ProfileImageCard";
import Link from "next/link";
import { motion } from "motion/react";

const HeroHeader = () => {
    return (
        <header id={"accueil"} className="flex flex-wrap min-h-screen items-center justify-center bg-custom-background px-8 lg:px-12 2xl:px-48 gap-12 lg:gap-32 pb-12 mb:pb-0 pt-28 border-b-4 border-black">

            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ opacity: 1 }}
                transition={{
                    duration: 0.4,
                    scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
                }}
                className={"space-y-6"}>
                <div className={"space-y-2"}>
                    <Title textLevel={"h1"} className="text-4xl lg:text-5xl"> Salut, </Title>
                    <Title textLevel={"h1"} className="text-4xl lg:text-5xl">
                        je suis <span className={"relative px-2 sm:mr-2 mr-0 md:[&amp;_svg]:size-[45px] sm:[&amp;_svg]:size-7 bg-main/50 rounded-base border-2 border-border/40 dark:border-border/70"}>Thibault</span> !
                    </Title>
                </div>

                <SubTitle textLevel={"h2"} title={"Etudiant en informatique"}/>

                <div className={"gap-5 flex flex-wrap"}>
                    <Button onClick={() => {window.open("mailto:" + process.env.NEXT_CONTACT_MAIL)}} className="cursor-pointer text-base" >Me contacter</Button>
                    <Link href="#a-propos">
                        <Button className="cursor-pointer text-base">A propos de moi</Button>
                    </Link>
                </div>
            </motion.div>

            <ProfileImageCard/>

        </header>
    )
}

export default HeroHeader;