import AWS from 'aws-sdk';

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

export const uploadToS3 = async (file: Buffer, fileName: string, contentType: string): Promise<string> => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: `case-studies/${Date.now()}-${fileName}`,
    Body: file,
    ContentType: contentType,
  };

  try {
    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload image to S3');
  }
};

// Extract the S3 key from a full S3 URL
const extractS3KeyFromUrl = (url: string): string | null => {
  try {
    // Handle different S3 URL formats:
    // https://bucket-name.s3.region.amazonaws.com/path/to/file
    // https://s3.region.amazonaws.com/bucket-name/path/to/file
    const urlObj = new URL(url);
    
    if (urlObj.hostname.includes('.s3.')) {
      // Format: https://bucket-name.s3.region.amazonaws.com/path/to/file
      return urlObj.pathname.substring(1); // Remove leading slash
    } else if (urlObj.hostname.includes('s3.')) {
      // Format: https://s3.region.amazonaws.com/bucket-name/path/to/file
      const pathParts = urlObj.pathname.split('/');
      return pathParts.slice(2).join('/'); // Remove empty string and bucket name
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting S3 key from URL:', error);
    return null;
  }
};

export const deleteFromS3 = async (imageUrl: string): Promise<boolean> => {
  try {
    const key = extractS3KeyFromUrl(imageUrl);
    
    if (!key) {
      console.error('Could not extract S3 key from URL:', imageUrl);
      return false;
    }

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    };

    await s3.deleteObject(params).promise();
    console.log(`Successfully deleted S3 object: ${key}`);
    return true;
  } catch (error) {
    console.error('Error deleting from S3:', error);
    return false;
  }
};

// Delete multiple images from S3
export const deleteMultipleFromS3 = async (imageUrls: string[]): Promise<{ success: number; failed: number }> => {
  const results = await Promise.allSettled(
    imageUrls.map(url => deleteFromS3(url))
  );

  const success = results.filter(result => result.status === 'fulfilled' && result.value === true).length;
  const failed = results.length - success;

  return { success, failed };
};

export default s3;