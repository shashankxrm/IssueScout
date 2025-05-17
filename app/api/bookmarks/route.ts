import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { authOptions } from "@/lib/auth-options";

// Create unique index for userId and issueId combination
async function ensureIndexes() {
  const client = await clientPromise;
  const db = client.db();
  await db.collection("bookmarks").createIndex(
    { userId: 1, issueId: 1 },
    { unique: true }
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
    const bookmarks = await db
      .collection("bookmarks")
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .toArray();

    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
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

    const bookmark = {
      userId: session.user.id,
      issueId: issue.id,
      issueData: issue,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Use updateOne with upsert to handle duplicates
    await db.collection("bookmarks").updateOne(
      { userId: session.user.id, issueId: issue.id },
      { $set: bookmark },
      { upsert: true }
    );

    return NextResponse.json(bookmark);
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { issueId } = await request.json();
    if (!issueId) {
      return NextResponse.json(
        { error: "Issue ID is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    await db.collection("bookmarks").deleteOne({
      userId: session.user.id,
      issueId: issueId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 