import { Badge } from "@/src/ui/components/atoms/shadcnUI/badge";

type TagsProps = {
    tags: string[],
    showTagsText: boolean
}

const TagsList = (tagsProps: TagsProps) => {
    return (
        <div>
            <div className={"flex flex-wrap gap-2 items-center"}>

                {
                    tagsProps.showTagsText && <p className={"font-bold"}>Tags : </p>
                }

                {
                    tagsProps.tags.map(((tag, key) => (
                        <Badge
                            className="font-bold text-sm shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none cursor-default"
                            key={key}>
                            {tag}
                        </Badge>
                    )))
                }
            </div>
        </div>
    )
}

export default TagsList