// lib/azureBlob.js
import {
    BlobServiceClient,
    generateBlobSASQueryParameters,
    BlobSASPermissions,
    SASProtocol,
  } from "@azure/storage-blob";
  
  const blobService = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING
  );
  
  export async function getSignedBlobUrl(rawUrl, expiresMinutes = 5) {
    const { containerName, blobName } = parseBlobUrl(rawUrl); // write a tiny parser
  
    const sas = generateBlobSASQueryParameters(
      {
        containerName,
        blobName,
        expiresOn: new Date(Date.now() + expiresMinutes * 60 * 1000),
        permissions: BlobSASPermissions.parse("r"),
        protocol: SASProtocol.Https,
      },
      blobService.credential
    ).toString();
  
    return `${rawUrl}?${sas}`;
  }
  