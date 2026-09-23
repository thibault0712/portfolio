import Image from "next/image";
import {WordPressMediaItem} from "@/src/models/WordPressPost";
import {getWordPressMediaUrl} from "@/src/lib/wordpress";

type IllustrationMediaCardProps = {
    wordpressMediaItem: WordPressMediaItem;
    projectTitle: string;
}

const IllustrationMediaCard = (illustrationMediaCardProps: IllustrationMediaCardProps) => {

    const wordpressMediaItem = illustrationMediaCardProps.wordpressMediaItem;
    const presentationUrl = getWordPressMediaUrl(wordpressMediaItem);

    return (
        <div className="w-full relative overflow-hidden rounded-base shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none cursor-default">

            {presentationUrl && wordpressMediaItem?.mediaType === "file" && wordpressMediaItem.mimeType?.startsWith("video/") ? (
                <video className="w-full rounded-xl max-h-50 sm:max-h-96 object-cover "
                       autoPlay
                       muted
                       loop
                       playsInline poster="">
                    <source src={presentationUrl} type={wordpressMediaItem.mimeType || undefined} />
                </video>
                ) : presentationUrl ? (
                <Image unoptimized={true} width={250} height={200} className={"w-full rounded-xl max-h-50 sm:max-h-96 object-cover "} src={presentationUrl} alt={illustrationMediaCardProps.projectTitle}></Image>
            ) : null}

            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">

                <div className="p-4 sm:p-8 text-center max-w-4xl rounded-xl">

                    <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-none drop-shadow-lg">
                        {illustrationMediaCardProps.projectTitle}
                    </h1>

                    <div className=" w-24 h-1 bg-main mx-auto mt-6 rounded-full"> </div>

                </div>

            </div>
        </div>
    )
}

export default IllustrationMediaCard;