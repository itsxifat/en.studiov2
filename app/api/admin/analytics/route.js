import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Visit from '../../../models/visit';

export async function GET() {
  await dbConnect();
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      liveVisitorsDocs,
      topPages,
      topReferrers,
      dailyTraffic,
      totalViews,
      totalUniquesDocs,
      latestVisits // ✨ Fetch latest visits
    ] = await Promise.all([
      // 1. "Live" Visitors (Unique raw IPs in last 5 mins)
      Visit.distinct('ip', { timestamp: { $gt: fiveMinutesAgo } }).exec(),

      // 2. Top Pages (last 30 days)
      Visit.aggregate([
        { $match: { timestamp: { $gt: thirtyDaysAgo } } },
        { $group: { _id: '$path', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]).exec(),

      // 3. Top Referrers (last 30 days)
      Visit.aggregate([
        { $match: { timestamp: { $gt: thirtyDaysAgo }, referrer: { $ne: null } } },
        { $group: { _id: '$referrer', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]).exec(),
      
      // 4. Daily Traffic Graph (last 30 days)
      Visit.aggregate([
        { $match: { timestamp: { $gt: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp", timezone: "Asia/Dhaka" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]).exec(),

      // 5. All-Time Page Views
      Visit.countDocuments().exec(),
      
      // 6. All-Time Unique Visitors (by raw IP)
      Visit.distinct('ip').exec(),
      
      // 7. Get the 10 most recent visits to show IPs
      Visit.find({})
        .sort({ timestamp: -1 })
        .limit(10)
        .select('ip path timestamp') // Select only the data we need
        .lean()
        .exec()
    ]);
    
    const liveVisitorsCount = liveVisitorsDocs.length;
    const totalUniques = totalUniquesDocs.length;

    const formattedDailyTraffic = dailyTraffic.map(item => ({
      name: item._id,
      visits: item.count
    }));

    return NextResponse.json({ 
      success: true, 
      data: {
        liveVisitors: liveVisitorsCount,
        topPages,
        topReferrers,
        dailyTraffic: formattedDailyTraffic,
        allTimeViews: totalViews,
        allTimeUniques: totalUniques,
        latestVisits: latestVisits // ✨ Send new data to frontend
      } 
    });

  } catch (error) {
    console.error("API_ANALYTICS_GET_ERROR:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch analytics.' }, { status: 500 });
  }
}