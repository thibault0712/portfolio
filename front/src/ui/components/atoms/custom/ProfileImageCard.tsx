import { motion } from "motion/react";
import Image from "next/image";

const ProfileImageCard = () => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ opacity: 1 }}
            transition={{
                duration: 0.4,
                scale: { type: "spring", visualDuration: 0.4, bounce: 0.2 },
            }}>
            <div className="relative inline-block transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none border-2 rounded-base border-black shadow-shadow">
                <Image
                    width={350}
                    height={450}
                    className="w-full h-auto"
                    src="/img/profilePicture.webp"
                    alt="Illustration Thibault Falézan"
                    priority
                    fetchPriority="high"
                />
            </div>
        </motion.div>
    )
}

export default ProfileImageCard;