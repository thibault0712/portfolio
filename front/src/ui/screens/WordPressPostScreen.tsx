import Header from "@/src/ui/components/organisms/Header/Header";
import { type WordPressPost } from "@/src/models/WordPressPost";
import WordPressPostContentSection from "@/src/ui/components/organisms/WordPressPostContentSection";

type WordPressPostScreenProps = {
    navLink: string;
    navTitle: string;
    post: WordPressPost;
};

export default function WordPressPostScreen({ navLink, navTitle, post }: WordPressPostScreenProps) {
    return (
        <>
            <Header navTitle={navTitle} navLink={navLink} />
            <WordPressPostContentSection post={post} />
        </>
    );
}