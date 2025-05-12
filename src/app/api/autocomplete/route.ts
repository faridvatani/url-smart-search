import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) return NextResponse.json({ suggestions: [] });

  try {
    const res = (await prisma.$runCommandRaw({
      aggregate: "recipes",
      pipeline: [
        {
          $search: {
            index: "default",
            autocomplete: {
              query,
              path: "title",
            },
          },
        },
        {
          $limit: 5,
        },
        {
          $project: {
            id: 1,
            title: 1,
          },
        },
      ],
      cursor: {},
    })) as { cursor?: { firstBatch?: { id: number; title: string }[] } };

    const suggestions = res?.cursor?.firstBatch || [];
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Error fetching autocomplete suggestions:", error);
    return NextResponse.json({ suggestions: [] }, { status: 500 });
  }
}
