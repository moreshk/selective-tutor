import { NextRequest, NextResponse } from 'next/server';
import { BlobServiceClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

  if (!AZURE_STORAGE_CONNECTION_STRING || !containerName) {
    return NextResponse.json({ error: "Azure Storage configuration is not set" }, { status: 500 });
  }

  const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  const containerClient = blobServiceClient.getContainerClient(containerName);

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const uniqueId = uuidv4();
    const blobName = `${uniqueId}-${file.name}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: {
        blobContentType: file.type,
      },
    });

    const blobUrl = blockBlobClient.url;
    return NextResponse.json({ filePath: blobUrl });
  } catch (error) {
    console.error('Error uploading to Azure Blob Storage:', error);
    return NextResponse.json({ error: "Error uploading to Azure Blob Storage" }, { status: 500 });
  }
}