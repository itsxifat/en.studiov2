import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import BtsItem from '../../../models/btsItem';
import { v2 as cloudinary } from 'cloudinary';
import { streamToBuffer } from '../../../lib/streamToBuffer';

cloudinary.config({ /* ... credentials ... */ });

// GET all BTS items for a specific project
export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json({ success: false, error: 'Project ID is required.' }, { status: 400 });
  }

  try {
    const btsItems = await BtsItem.find({ projectId }).sort({ displayOrder: 'asc' });
    return NextResponse.json({ success: true, data: btsItems });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch BTS items.' }, { status: 500 });
  }
}

// POST a new BTS item
export async function POST(request) {
  await dbConnect();
  try {
    const formData = await request.formData();
    const projectId = formData.get('projectId');
    const type = formData.get('type');
    const description = formData.get('description') || '';
    const displayOrder = formData.get('displayOrder') || 0;
    const file = formData.get('file'); // For 'image' type
    const videoUrl = formData.get('videoUrl'); // For 'video' type

    if (!projectId || !type) {
      return NextResponse.json({ success: false, error: 'Project ID and Type are required.' }, { status: 400 });
    }

    let btsItemData = {
      projectId,
      type,
      description,
      displayOrder
    };

    if (type === 'image') {
      if (!file) {
        return NextResponse.json({ success: false, error: 'An image file is required.' }, { status: 400 });
      }
      // Upload image to Cloudinary
      const buffer = await streamToBuffer(file.stream());
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'bts_images' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      if (!uploadResult) throw new Error('Cloudinary upload failed.');
      
      btsItemData.url = uploadResult.secure_url;
      btsItemData.cloudinaryPublicId = uploadResult.public_id;

    } else if (type === 'video') {
      if (!videoUrl) {
        return NextResponse.json({ success: false, error: 'A YouTube URL or ID is required.' }, { status: 400 });
      }
      // Extract YouTube ID from URL
      const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = videoUrl.match(regex);
      const youtubeId = match ? match[1] : videoUrl; // Assume it's an ID if no match
      
      btsItemData.url = youtubeId;
    }

    // Create the BTS item in the database
    const btsItem = await BtsItem.create(btsItemData);
    return NextResponse.json({ success: true, data: btsItem }, { status: 201 });

  } catch (error) {
    console.error('API_ADMIN_BTS_POST_ERROR:', error);
    return NextResponse.json({ success: false, error: 'Failed to create BTS item.' }, { status: 500 });
  }
}