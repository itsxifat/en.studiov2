// app/api/admin/analytics/route.js
import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Visit from "../../../models/visit";

export async function GET() {
  try {
    // ✅ Ensure MongoDB connection before queries
    await dbConnect();

    // Pre-calc time ranges
    const now = Date.now();
    const fiveMinutesAgo = new Date(now - 60 * 1000);
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

    // ✅ Run all queries in parallel for efficiency
    const [
      liveVisitorsDocs,
      topPages,
      topReferrers,
      topSources,
      dailyTraffic,
      totalViews,
      totalUniquesDocs,
      latestVisits,
    ] = await Promise.all([
      // 1️⃣ Live visitors (unique IPs in last 20 seconds)
      Visit.distinct("ip", { timestamp: { $gt: fiveMinutesAgo } }),

      // 2️⃣ Top pages (30 days)
      Visit.aggregate([
        { $match: { timestamp: { $gt: thirtyDaysAgo } } },
        { $group: { _id: "$path", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),

      // 3️⃣ Top referrers
      Visit.aggregate([
        {
          $match: {
            timestamp: { $gt: thirtyDaysAgo },
            referrer: { $ne: null },
          },
        },
        { $group: { _id: "$referrer", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),

      // 4️⃣ Top sources (UTM)
      Visit.aggregate([
        {
          $match: {
            timestamp: { $gt: thirtyDaysAgo },
            source: { $ne: null },
          },
        },
        { $group: { _id: "$source", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),

      // 5️⃣ Daily traffic (graph)
      Visit.aggregate([
        { $match: { timestamp: { $gt: thirtyDaysAgo } } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$timestamp",
                timezone: "Asia/Dhaka",
              },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // 6️⃣ All-time page views
      Visit.countDocuments(),

      // 7️⃣ All-time unique visitors
      Visit.distinct("ip"),

      // 8️⃣ Latest visits (scrollable log)
      Visit.find({
        coordinates: { $ne: null },
      })
        .sort({ timestamp: -1 })
        .limit(50)
        .select("_id ip path timestamp location coordinates")
        .lean(),
    ]);

    // ✅ Prepare response data
    const liveVisitorsCount = liveVisitorsDocs.length;
    const totalUniques = totalUniquesDocs.length;

    const formattedDailyTraffic = dailyTraffic.map((item) => ({
      name: item._id,
      visits: item.count,
    }));

    // ✅ Return all analytics data
    return NextResponse.json({
      success: true,
      data: {
        liveVisitors: liveVisitorsCount,
        topPages,
        topReferrers,
        topSources,
        dailyTraffic: formattedDailyTraffic,
        allTimeViews: totalViews,
        allTimeUniques: totalUniques,
        latestVisits,
      },
    });
  } catch (error) {
    console.error("API_ANALYTICS_GET_ERROR:", error.message);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch analytics." },
      { status: 500 }
    );
  }
}
