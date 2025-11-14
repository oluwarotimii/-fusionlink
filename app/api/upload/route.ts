import { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return Response.json({ error: 'No image provided' }, { status: 400 });
    }

    // Validate file type
    if (!image.type.startsWith('image/')) {
      return Response.json({ error: 'File is not an image' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (image.size > 5 * 1024 * 1024) {
      return Response.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    // Create a unique filename based on timestamp
    const timestamp = Date.now();
    const fileExtension = path.extname(image.name) || '.jpg';
    const fileName = `${timestamp}_${Math.random().toString(36).substring(2, 9)}${fileExtension}`;

    // Create the public/images directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'images');
    await fs.mkdir(uploadDir, { recursive: true });

    // Create file path
    const filePath = path.join(uploadDir, fileName);

    // Read the file buffer and write to public directory
    const buffer = Buffer.from(await image.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // Return the URL of the uploaded image
    const imageUrl = `/images/${fileName}`;

    return Response.json({
      url: imageUrl,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return Response.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}