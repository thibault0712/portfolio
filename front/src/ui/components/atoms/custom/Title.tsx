import {JSX} from "react";

type TitleProps = {
    children: React.ReactNode;
    textLevel: keyof JSX.IntrinsicElements;
    className?: string;
};

const Title = ({ children, textLevel = "h2", className }: TitleProps) => {

    const TitleBalise = textLevel;

    return (
        <TitleBalise className={`${className || ""} font-extrabold`}>
            {children}
        </TitleBalise>
    );
};

export default Title;
