import Title from "@/src/components/atoms/Title";
import {FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className={"w-full bg-background border-t-4 border-black px-4 lg:px-12 xl:px-48 pt-8 pb-4"}>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-8">
                <div className="space-y-2">
                    <Title textLevel={"h3"} className={"text-xl text-center sm:text-left"}> LIENS RAPIDES </Title>
                    <div className="flex flex-col">
                        <Link className={"text-center sm:text-left border-4 border-transparent hover:border-black hover:bg-main px-4 py-1 transition-all duration-200"} href="/#Accueil"> Accueil </Link>
                        <Link className={"text-center sm:text-left border-4 border-transparent hover:border-black hover:bg-main px-4 py-1 transition-all duration-200"} href="/#a-propos"> À propos </Link>
                        <Link className={"text-center sm:text-left border-4 border-transparent hover:border-black hover:bg-main px-4 py-1 transition-all duration-200"} href="/#mes-experiences"> Mes expériences </Link>
                        <Link className={"text-center sm:text-left border-4 border-transparent hover:border-black hover:bg-main px-4 py-1 transition-all duration-200"} href="/#mes-projets"> Mes projets </Link>
                    </div>

                </div>

                <div className={"space-y-2"}>
                    <Title textLevel={"h3"} className={"text-xl text-center sm:text-left"}> ME CONTACTER </Title>
                    <div className={"flex gap-x-5 justify-center items-center sm:justify-start py-1"}>
                        <Link target="_blank" aria-label="Email" rel="noopener noreferrer" href={"mailto:" + process.env.NEXT_CONTACT_MAIL}> <FaEnvelope size={25} /> </Link>
                        <Link target="_blank" aria-label="Github" rel="noopener noreferrer" href={process.env.NEXT_PUBLIC_CONTACT_GITHUB ?? ""}> <FaGithub size={25} /> </Link>
                        <Link target="_blank" aria-label="Linkedin" rel="noopener noreferrer" href={process.env.NEXT_PUBLIC_CONTACT_LINKEDIN ?? ""}> <FaLinkedin size={25} /> </Link>
                    </div>
                </div>
            </div>

            <div className="border-t-4 border-black pt-8">
                <p className="font-heading text-lg text-center sm:text-left">
                    © 2025 Thibault
                </p>
            </div>

        </footer>
    )
}

export default Footer;