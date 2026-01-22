import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse multipart form data
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Find the boundary from content-type header
    const contentType = req.headers['content-type'];
    const boundaryMatch = contentType.match(/boundary=(.+)/);
    if (!boundaryMatch) {
      return res.status(400).json({ error: 'Invalid content type' });
    }
    const boundary = boundaryMatch[1];

    // Parse the multipart data
    const parts = parseMultipart(buffer, boundary);
    const imagePart = parts.find(p => p.name === 'image');

    if (!imagePart) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(imagePart.contentType)) {
      return res.status(400).json({ error: 'Invalid file type. Only JPG and PNG are allowed.' });
    }

    // Validate file size (10MB)
    if (imagePart.data.length > 10 * 1024 * 1024) {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = imagePart.contentType === 'image/png' ? 'png' : 'jpg';
    const filename = `works/${timestamp}.${extension}`;

    // Upload to Vercel Blob
    const blob = await put(filename, imagePart.data, {
      access: 'public',
      contentType: imagePart.contentType,
    });

    return res.status(200).json({
      url: blob.url,
      filename: filename,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Failed to upload image' });
  }
}

// Simple multipart parser
function parseMultipart(buffer, boundary) {
  const parts = [];
  const boundaryBuffer = Buffer.from(`--${boundary}`);
  const endBoundary = Buffer.from(`--${boundary}--`);

  let start = buffer.indexOf(boundaryBuffer) + boundaryBuffer.length + 2; // +2 for \r\n

  while (start < buffer.length) {
    const nextBoundary = buffer.indexOf(boundaryBuffer, start);
    if (nextBoundary === -1) break;

    const partData = buffer.slice(start, nextBoundary - 2); // -2 for \r\n before boundary
    const headerEnd = partData.indexOf('\r\n\r\n');

    if (headerEnd !== -1) {
      const headerStr = partData.slice(0, headerEnd).toString();
      const body = partData.slice(headerEnd + 4);

      // Parse headers
      const nameMatch = headerStr.match(/name="([^"]+)"/);
      const filenameMatch = headerStr.match(/filename="([^"]+)"/);
      const contentTypeMatch = headerStr.match(/Content-Type:\s*([^\r\n]+)/i);

      if (nameMatch) {
        parts.push({
          name: nameMatch[1],
          filename: filenameMatch ? filenameMatch[1] : null,
          contentType: contentTypeMatch ? contentTypeMatch[1] : 'text/plain',
          data: body,
        });
      }
    }

    start = nextBoundary + boundaryBuffer.length + 2;

    // Check for end boundary
    if (buffer.slice(nextBoundary, nextBoundary + endBoundary.length).equals(endBoundary)) {
      break;
    }
  }

  return parts;
}
