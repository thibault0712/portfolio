"use client"

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/src/ui/components/atoms/shadcnUI/sheet";
import { FaBars } from "react-icons/fa";
import { Button } from "@/src/ui/components/atoms/shadcnUI/button";
import Link from "next/link";
import { HOME_NAVIGATION_ITEMS } from "@/src/config/navigation";
import { scrollToRepeatedHomeAnchor } from "@/src/lib/scrollToHomeAnchor";


const BurgerMenu = () => {

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className="visible sm:hidden text-2xl" aria-label="Ouvrir le menu">
                    <FaBars className={"sm:max-w-0"} />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className={"text-2xl"}>Menu</SheetTitle>
                </SheetHeader>
                <div className="grid flex-1 auto-rows-min gap-2 px-4">
                    {HOME_NAVIGATION_ITEMS.map((item) => (
                        <SheetClose asChild key={item.href}>
                            <Link
                                className={"text-center sm:text-left border-4 border-transparent hover:border-black hover:bg-main px-4 py-1 transition-all duration-200"}
                                href={item.href}
                                onClick={(event) => scrollToRepeatedHomeAnchor(event, item.href)}
                            >
                                {item.label}
                            </Link>
                        </SheetClose>
                    ))}
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant="neutral">Fermer</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default BurgerMenu;
