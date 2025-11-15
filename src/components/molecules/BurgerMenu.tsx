"use client"

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import {FaBars} from "react-icons/fa";
import {Button} from "@/components/ui/button";
import Link from "next/link";


const BurgerMenu = () => {

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className="visible sm:hidden text-2xl" ><FaBars className={"sm:max-w-0"} /></Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className={"text-2xl"}>Menu</SheetTitle>
                </SheetHeader>
                <div className="grid flex-1 auto-rows-min gap-2 px-4">
                    <SheetClose asChild>
                        <Link className={"text-center sm:text-left border-4 border-transparent hover:border-black hover:bg-main px-4 py-1 transition-all duration-200"} href="/#accueil"> Accueil </Link>
                    </SheetClose>
                    <SheetClose asChild>
                        <Link className={"text-center sm:text-left border-4 border-transparent hover:border-black hover:bg-main px-4 py-1 transition-all duration-200"} href="/#a-propos"> À propos </Link>
                    </SheetClose>
                    <SheetClose asChild>
                        <Link className={"text-center sm:text-left border-4 border-transparent hover:border-black hover:bg-main px-4 py-1 transition-all duration-200"} href="/#mes-experiences"> Mes expériences </Link>
                    </SheetClose>
                    <SheetClose asChild>
                        <Link className={"text-center sm:text-left border-4 border-transparent hover:border-black hover:bg-main px-4 py-1 transition-all duration-200"} href="/#mes-projets"> Mes projets </Link>
                    </SheetClose>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant="neutral">Femer</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default BurgerMenu;