type TitleProps = {
    title: string;
    textLevel: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    className?: string;
}

const SubTitle = (titleProps: TitleProps) => {

    const SubTitleBalise = titleProps.textLevel;

    return (
        <SubTitleBalise className={`${titleProps.className} text-xl md:text-2xl text-gray-700 font-semibold`} >
            {titleProps.title}
        </SubTitleBalise>
    )
}

export default SubTitle;