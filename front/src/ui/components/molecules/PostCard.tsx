"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Card, CardContent } from "@/src/ui/components/atoms/shadcnUI/card";
import { Button } from "@/src/ui/components/atoms/shadcnUI/button";
import Title from "@/src/ui/components/atoms/custom/Title";
import { Badge } from "@/src/ui/components/atoms/shadcnUI/badge";
import { FaBook, FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { type WordPressMediaItem } from "@/src/models/WordPressPost";
import { isWordPressVideoMedia } from "@/src/lib/wordpress";

type WordPressPostCardProps = {
    badgeLabel: string;
    description: string;
    href: string;
    media: WordPressMediaItem | null;
    title: string;
    githubUrl?: string | null;
    demoUrl?: string | null;
};

const PostCard = ({
    badgeLabel,
    description,
    href,
    media,
    title,
    githubUrl,
    demoUrl,
}: WordPressPostCardProps) => {
    const mediaUrl = media?.mediaItemUrl || media?.sourceUrl || null;
    const [isMediaHovered, setIsMediaHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            transition={{
                duration: 0.4,
                scale: { type: "spring", visualDuration: 0.4, bounce: 0.2 },
            }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }} >


            <Card
                className={`pt-6 h-full hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none cursor-pointer`}
                onMouseLeave={() => {
                    setIsMediaHovered(false);
                }}
                onClick={() => window.location.assign(href)}
            >
                <CardContent className="flex grow flex-col space-y-4 px-6">
                    <div
                        className="w-full"
                        onMouseEnter={() => {
                            setIsMediaHovered(true);
                        }}
                        onMouseLeave={() => setIsMediaHovered(false)}
                    >
                        {mediaUrl ? (
                            isWordPressVideoMedia(media) ? (
                                <video
                                    className={"rounded-base w-full h-54 object-cover shadow-shadow border-2 border-black hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    preload="metadata"
                                >
                                    <source src={mediaUrl} type={media?.mimeType || undefined} />
                                </video>
                            ) : (
                                <Image
                                    unoptimized={true}
                                    width={1200}
                                    height={800}
                                    className={"rounded-base w-full h-54 object-cover shadow-shadow border-2 border-black hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"}
                                    src={mediaUrl}
                                    alt={media?.altText || title}
                                />
                            )
                        ) : (
                            <div className={`flex h-54 w-full items-center justify-center rounded-base border-2 border-black bg-secondary-background shadow-shadow transition-transform duration-300 ${isMediaHovered ? "-translate-x-boxShadowX -translate-y-boxShadowY" : ""}`}>
                                <Badge>{badgeLabel}</Badge>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <Title textLevel="h3" className="text-xl font-heading">
                            {title}
                        </Title>
                        <Badge
                            variant={'neutral'}
                            className="shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none cursor-default">{badgeLabel}</Badge>
                    </div>

                    <p className="grow text-sm font-base text-justify">{description}</p>

                    <div className={`mt-auto grid min-h-24 grid-cols-1 gap-4 ${githubUrl || demoUrl ? "md:grid-cols-2" : ""}`}>
                        <Link className="w-full" href={href}>
                            <Button className="w-full cursor-pointer bg-purple-400">
                                <FaBook /> Lire
                            </Button>
                        </Link>

                        {githubUrl && (
                            <Button onClick={() => window.open(githubUrl)} className="cursor-pointer bg-blue-400">
                                <FaGithub /> Code
                            </Button>
                        )}

                        {demoUrl && (
                            <Button onClick={() => window.open(demoUrl)} className="cursor-pointer bg-yellow-400">
                                <FaExternalLinkAlt /> Demo
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default PostCard;