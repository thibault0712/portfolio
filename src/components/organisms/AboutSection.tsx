"use client"

import AboutCard from "@/src/components/molecules/AboutCard";
import { motion } from "motion/react";


const AboutSection = () => {
    return (
        <section
            id="a-propos"
            className="flex flex-col items-center justify-center px-4 py-4 md:py-24 lg:px-12 xl:px-48 space-y-32 w-full"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                style={{ opacity: 1 }}
                transition={{
                    duration: 0.4,
                    scale: { type: "spring", visualDuration: 0.4, bounce: 0.2 },
                }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
            >

                <AboutCard />

            </motion.div>

        </section>
    )
}

export default AboutSection;