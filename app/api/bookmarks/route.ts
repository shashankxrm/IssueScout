import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { authOptions } from "@/lib/auth-options";

interface Bookmark {
  userId: string;
  issueId: number;
  issueData: any;
  createdAt: Date;
  updatedAt: Date;
}

// Create unique index for userId and issueId combination
async function ensureIndexes() {
  try {
    const client = await clientPromise;
    const db = client.db();
    await db.collection("bookmarks").createIndex(
      { userId: 1, issueId: 1 },
      { unique: true }
    );
    // Add index for sorting by createdAt
    await db.collection("bookmarks").createIndex(
      { createdAt: -1 }
    );
    console.log("Bookmarks indexes created successfully");
  } catch (error) {
    console.error("Error creating bookmarks indexes:", error);
  }
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
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
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

    const body = await request.json();
    console.log("Received bookmark request body:", body);

    const { issue } = body;
    if (!issue) {
      return NextResponse.json(
        { error: "Issue data is required" },
        { status: 400 }
      );
    }

    if (!issue.id) {
      return NextResponse.json(
        { error: "Issue ID is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const now = new Date();

    try {
      // First check if the bookmark already exists
      const existingBookmark = await db.collection("bookmarks").findOne({
        userId: session.user.id,
        issueId: issue.id
      });
      
      let result;
      
      if (existingBookmark) {
        // Update existing bookmark
        result = await db.collection("bookmarks").findOneAndUpdate(
          { userId: session.user.id, issueId: issue.id },
          { 
            $set: {
              issueData: issue,
              updatedAt: now
            }
          },
          { returnDocument: "after" }
        );
        
        console.log("Updated existing bookmark");
      } else {
        // Create new bookmark
        const newBookmark: Bookmark = {
          userId: session.user.id,
          issueId: issue.id,
          issueData: issue,
          createdAt: now,
          updatedAt: now
        };
        
        const insertResult = await db.collection("bookmarks").insertOne(newBookmark);
        result = { 
          ...newBookmark,
          _id: insertResult.insertedId
        };
        
        console.log("Created new bookmark with createdAt:", now);
      }

      return NextResponse.json(result);
    } catch (dbError) {
      console.error("Database error creating bookmark:", dbError);
      return NextResponse.json(
        { error: "Database error", details: dbError instanceof Error ? dbError.message : "Unknown database error" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in bookmarks POST route:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
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
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
} 