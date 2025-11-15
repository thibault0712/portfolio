"use client";

import {FaEnvelope, FaGithub, FaLinkedin} from "react-icons/fa";
import {Button} from "@/components/ui/button";

type SocialButtonProps = {
    socialMedia: "Github" | "Linkedin" | "Mail"
    className?: string
    showText?: boolean
}

const SocialButton = ({ socialMedia, className, showText = true }: SocialButtonProps) => {
    let socialIcon;
    let socialText: string;
    let socialLink: string | undefined;

    switch (socialMedia) {
        case "Linkedin":
            socialIcon = <FaLinkedin />;
            socialText = "Linkedin" ;
            socialLink = process.env.NEXT_PUBLIC_CONTACT_LINKEDIN;
            break;

        case "Github":
            socialIcon = <FaGithub />;
            socialText = "Github";
            socialLink = process.env.NEXT_PUBLIC_CONTACT_GITHUB;
            break;

        case "Mail":
            socialIcon = <FaEnvelope />;
            socialText = "Mail";
            socialLink = "mailto:" + process.env.NEXT_PUBLIC_CONTACT_MAIL;
            break;

        default:
            socialIcon = <FaGithub />;
            socialText = "Github";
    }

    return (
        <Button className={className + " cursor-pointer"} aria-label={socialText} onClick={() => {
            window.open(socialLink)
        }}>
            {socialIcon}
            {showText ? socialText : ""}
        </Button>
    )
}

export default SocialButton