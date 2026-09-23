"use client"

import Link from "next/link";
import { Card, CardContent } from "@/src/ui/components/atoms/shadcnUI/card";
import BurgerMenu from "@/src/ui/components/molecules/BurgerMenu";
import useActiveSection from "@/src/ui/components/organisms/Header/hooks/useActiveSection";
import useHeaderIsVisible from "@/src/ui/components/organisms/Header/hooks/useHideHeader";
import { motion } from "motion/react";
import { HOME_NAVIGATION_ITEMS } from "@/src/config/navigation";
import { scrollToRepeatedHomeAnchor } from "@/src/lib/scrollToHomeAnchor";

const sectionIds = ["accueil", "a-propos", "mes-experiences", "mes-projets"];

type HeaderProps = {
    navTitle?: string;
    navLink?: string;
}

const Header = (headerProps: HeaderProps) => {
    const activeSection = useActiveSection(sectionIds, 0.25);
    const navTitle = headerProps.navTitle ?? activeSection ?? "Accueil";
    const navLink = headerProps.navLink ?? "/#accueil";

    const useIsVisible = useHeaderIsVisible();

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
                className="w-full border-4 rounded text-foreground bg-main p-1 sm:p-2 md:p-4"
            >
                <CardContent className={"flex justify-between items-center"}>
                    <Link
                        className="mr-2"
                        href={navLink}
                        onClick={(event) => scrollToRepeatedHomeAnchor(event, navLink)}
                    >
                        <h1 className="font-heading text-2xl sm:text-2xl md:text-3xl">{navTitle}</h1>
                    </Link>

                    <div className="flex items-center space-x-8">

                        <div className="flex text-lg invisible w-0 sm:w-auto sm:visible space-x-8">
                            {HOME_NAVIGATION_ITEMS.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={(event) => scrollToRepeatedHomeAnchor(event, item.href)}
                                    className="relative group transition duration-300"
                                >
                                    {item.label}
                                    <span className="absolute left-0 bottom-0 w-0 border-b-2 border-current transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            ))}
                        </div>

                        <BurgerMenu />
                    </div>

                </CardContent>

            </Card>
        </motion.nav>
    )
}

export default Header
