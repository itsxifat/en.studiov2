import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import PortfolioItem from '../../../models/portfolioItem';
import PhotoProject from '../../../models/photoProject';
import Testimonial from '../../../models/testimonial';
import Service from '../../../models/service';
import Category from '../../../models/Category';
import BtsItem from '../../../models/btsItem';
import Photo from '../../../models/photo';
import PricingPackage from '../../../models/pricingPackage';

// This is a secure route, protected by your middleware.js
export async function GET() {
  await dbConnect();
  try {
    // Run all count queries in parallel
    const [
      videoCount,
      photoProjectCount,
      testimonialCount,
      serviceCount,
      categoryCount,
      btsCount,
      photoCount,
      packageCount
    ] = await Promise.all([
      PortfolioItem.countDocuments(),
      PhotoProject.countDocuments(),
      Testimonial.countDocuments(),
      Service.countDocuments(),
      Category.countDocuments({ name: { $ne: 'All' } }),
      BtsItem.countDocuments(),
      Photo.countDocuments(),
      PricingPackage.countDocuments()
    ]);

    const stats = {
      videos: videoCount,
      photoProjects: photoProjectCount,
      photos: photoCount,
      btsItems: btsCount,
      services: serviceCount,
      packages: packageCount,
      testimonials: testimonialCount,
      categories: categoryCount,
    };

    return NextResponse.json({ success: true, data: stats });

  } catch (error) {
    console.error("API_DASHBOARD_STATS_ERROR:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch dashboard stats.' }, { status: 500 });
  }
}