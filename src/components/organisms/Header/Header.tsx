"use client"

import Link from "next/link";
import {Card, CardContent} from "@/components/ui/card";
import BurgerMenu from "@/src/components/molecules/BurgerMenu";
import useActiveSection from "@/src/hoooks/useActiveSection";
import useHeaderIsVisible from "@/src/hoooks/useHideHeader";
import { motion } from "motion/react";

type HeaderProps = {
    navTitle?: string;
    navLink?: string;
}

const Header = (headerProps: HeaderProps) => {

    let navTitle: string;
    let navLink: string;

    if (headerProps.navTitle) {
        navTitle = headerProps.navTitle;
        navLink = headerProps.navLink ?? "/#Accueil";
    } else {
        const sectionIds = ['accueil', 'a-propos', "mes-experiences", 'mes-projets'];
        // eslint-disable-next-line react-hooks/rules-of-hooks
        navTitle = useActiveSection(sectionIds, 0.25) ?? "Accueil";
        navLink = "/#accueil";
    }


    const useIsVisible = useHeaderIsVisible()

    return (
        <motion.nav
            initial={{ opacity: 0, scale: 0, y: -100 }}
            animate={{
                opacity: 1,
                scale: 1,
                y: useIsVisible ? 0 : -120
            }}
            transition={{
                duration: 0.4,
                scale: { type: "spring", bounce: 0.5 },
            }}
            className="flex justify-center items-center fixed top-0 left-0 z-50 w-full p-2 lg:px-12 xl:px-48"
        >
            <Card
                className="w-full border-4 rounded text-foregronud bg-main p-1 sm:p-2 md:p-4"
            >
                <CardContent className={"flex justify-between items-center"}>
                    <Link className="mr-2" href={navLink} passHref>
                        <h1 className="font-heading text-2xl sm:text-2xl md:text-3xl">{navTitle}</h1>
                    </Link>

                    <div className="flex items-center space-x-8">

                        <div className="flex text-lg invisible w-0 sm:w-auto sm:visible space-x-8">
                            <Link href="#accueil" className="relative group transition duration-300">
                                Accueil
                                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-current transition-all duration-300 group-hover:w-full"></span>
                            </Link>

                            <Link href="#a-propos" className="relative group transition duration-300">
                                À propos
                                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-current transition-all duration-300 group-hover:w-full"></span>
                            </Link>

                            <Link href="#mes-experiences" className="relative group transition duration-300">
                                Mes expériences
                                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-current transition-all duration-300 group-hover:w-full"></span>
                            </Link>

                            <Link href="#mes-projets" className="relative group transition duration-300">
                                Mes projets
                                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-current transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </div>

                        <BurgerMenu/>
                    </div>

                </CardContent>

            </Card>
        </motion.nav>
    )
}

export default Header