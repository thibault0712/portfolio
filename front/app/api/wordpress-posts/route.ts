import { NextRequest, NextResponse } from "next/server";
import { fetchWordPressFilteredPosts } from "@/src/api/fetch/fetchWordPressPosts";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const categoryId = searchParams.get("categoryId")
            ? Number(searchParams.get("categoryId"))
            : undefined;

        if (!categoryId || isNaN(categoryId)) {
            return NextResponse.json(
                { error: "Paramètre categoryId manquant ou invalide." },
                { status: 400 }
            );
        }

        const first = searchParams.get("first")
            ? Number(searchParams.get("first"))
            : 25;
        const after = searchParams.get("after") || undefined;
        const search = searchParams.get("search") || undefined;
        const categorySlug = searchParams.get("categorySlug") || undefined;
        const tagSlug = searchParams.get("tagSlug") || undefined;
        const authorSlug = searchParams.get("authorSlug") || undefined;
        const dateFrom = searchParams.get("dateFrom") || undefined;
        const dateTo = searchParams.get("dateTo") || undefined;
        const sortBy = (searchParams.get("sortBy") as
            | "date-desc"
            | "date-asc"
            | "title-asc"
            | "title-desc") || "date-desc";

        const result = await fetchWordPressFilteredPosts({
            categoryId,
            first,
            after,
            search,
            categorySlug,
            tagSlug,
            authorSlug,
            dateFrom,
            dateTo,
            sortBy,
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Erreur API wordpress-posts:", error);
        return NextResponse.json(
            { error: "Impossible de récupérer les articles depuis WordPress." },
            { status: 500 }
        );
    }
}
