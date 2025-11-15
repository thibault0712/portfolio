"use client"

import {Card, CardContent} from "@/components/ui/card";
import Title from "@/src/components/atoms/Title";
import { motion } from "motion/react";


type CardTitleProps = {
    children: React.ReactNode;
}

const TitleCard = (cardTitleProps: CardTitleProps) => {

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            style={{ opacity: 1 }}
            transition={{
                duration: 0.4,
                scale: { type: "spring", visualDuration: 0.4, bounce: 0.2 },
            }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
        >
            <Card className={"w-full bg-secondary-background"}>
                <CardContent>
                    <Title textLevel={"h2"} className={"text-center text-3xl md:text-4xl"}> {cardTitleProps.children}  </Title>
                </CardContent>
            </Card>
        </motion.div>

        )

}

export default TitleCard;