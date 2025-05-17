import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import clientPromise from "@/lib/mongodb";
import { authOptions } from "@/lib/auth-options";

// Create index for userId and createdAt
async function ensureIndexes() {
  const client = await clientPromise;
  const db = client.db();
  await db.collection("recentlyViewed").createIndex(
    { userId: 1, createdAt: -1 }
  );
}

// Call ensureIndexes when the API route is first loaded
ensureIndexes().catch(console.error);

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    const recentlyViewed = await db
      .collection("recentlyViewed")
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json(recentlyViewed);
  } catch (error) {
    console.error("Error fetching recently viewed issues:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { issue } = await request.json();
    if (!issue) {
      return NextResponse.json(
        { error: "Issue data is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const now = new Date();
    const recentlyViewed = {
      userId: session.user.id,
      issueId: issue.id,
      issueData: issue,
      createdAt: now,
    };

    // Update existing record or insert new one
    await db.collection("recentlyViewed").updateOne(
      { userId: session.user.id, issueId: issue.id },
      { $set: recentlyViewed },
      { upsert: true }
    );

    // Keep only the 10 most recent views
    const views = await db
      .collection("recentlyViewed")
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .skip(10)
      .toArray();

    if (views.length > 0) {
      await db.collection("recentlyViewed").deleteMany({
        _id: { $in: views.map(view => view._id) }
      });
    }

    return NextResponse.json(recentlyViewed);
  } catch (error) {
    console.error("Error creating recently viewed issue:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 