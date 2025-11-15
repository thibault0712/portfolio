import Image from "next/image";

type ImageCardProps = {
    imageLink: string;
    projectTitle: string;
}

const ImageCard = (imageCardProps: ImageCardProps) => {
    return (
        <div className="w-full relative overflow-hidden rounded-base shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none cursor-default">
            <Image width={250} height={200} className={"w-full rounded-xl max-h-50 sm:max-h-96 object-cover "} src={imageCardProps.imageLink} alt={imageCardProps.projectTitle}></Image>

            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">

                <div className="p-4 sm:p-8 text-center max-w-4xl rounded-xl">

                    <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-none drop-shadow-lg">
                        {imageCardProps.projectTitle}
                    </h1>

                    <div className=" w-24 h-1 bg-main mx-auto mt-6 rounded-full"> </div>

                </div>

            </div>
        </div>
    )
}

export default ImageCard;