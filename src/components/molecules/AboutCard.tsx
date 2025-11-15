import {Card, CardContent} from "@/components/ui/card";
import Image from "next/image";
import Title from "@/src/components/atoms/Title";
import SocialButton from "@/src/components/atoms/SocialButton";


const AboutCard = () => {


    return (
        <Card className="w-full">
            <CardContent className={"flex w-full md:space-x-8"}>
                <Image width={250} height={350} className={"rounded-base border-2 invisible max-w-0 md:max-w-full md:visible border-black shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"} src="/img/profilePicture.png" alt="Thibault Falézan"/>
                <div className="space-y-8">
                    <Title textLevel={"h2"} className="text-4xl font-heading">À propos de moi</Title>
                    <p className={"font-base text-justify"}>
                        Je m’appelle Thibault Falezan, je suis actuellement en deuxième année de BUT Informatique à l’IUT de Vannes et en alternance chez BJ75 à Redon.
                        <br/>
                        <br/>
                        Passionné par l’informatique depuis plusieurs années, j’aime autant concevoir des projets techniques que comprendre le fonctionnement en profondeur des systèmes que j’utilise. Mon alternance me permet de développer mes compétences en développement front-end et back-end.
                        <br/>
                        <br/>
                        Entre deux parties de badminton, j’aime concevoir des circuits électroniques ou encore jardiner.
                    </p>
                    <div className={"flex flex-wrap gap-4"}>
                        <SocialButton socialMedia={"Mail"}/>
                        <SocialButton socialMedia={"Github"}/>
                        <SocialButton socialMedia={"Linkedin"}/>
                    </div>
                </div>

            </CardContent>
        </Card>
    )
}

export default AboutCard;