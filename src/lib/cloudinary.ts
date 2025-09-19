import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (file: Buffer, fileName: string): Promise<string> => {
  try {
    // Convert buffer to base64
    const fileStr = `data:image/jpeg;base64,${file.toString('base64')}`;
    
    const result = await cloudinary.uploader.upload(fileStr, {
      folder: 'case-studies',
      public_id: `${Date.now()}-${fileName.split('.')[0]}`,
      resource_type: 'image',
    });

    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

// Extract the public ID from a Cloudinary URL
const extractCloudinaryPublicId = (url: string): string | null => {
  try {
    // Cloudinary URL format: https://res.cloudinary.com/cloud_name/image/upload/v123456789/folder/public_id.jpg
    const urlParts = url.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1 || uploadIndex + 2 >= urlParts.length) {
      return null;
    }
    
    // Get everything after 'upload/v123456789/' or 'upload/'
    const pathAfterUpload = urlParts.slice(uploadIndex + 1);
    
    // Remove version if present (starts with 'v' followed by numbers)
    if (pathAfterUpload[0] && /^v\d+$/.test(pathAfterUpload[0])) {
      pathAfterUpload.shift();
    }
    
    // Join the remaining parts and remove file extension
    const publicIdWithExtension = pathAfterUpload.join('/');
    const publicId = publicIdWithExtension.split('.')[0];
    
    return publicId;
  } catch (error) {
    console.error('Error extracting Cloudinary public ID from URL:', error);
    return null;
  }
};

export const deleteFromCloudinary = async (imageUrl: string): Promise<boolean> => {
  try {
    const publicId = extractCloudinaryPublicId(imageUrl);
    
    if (!publicId) {
      console.error('Could not extract public ID from Cloudinary URL:', imageUrl);
      return false;
    }

    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      console.log(`Successfully deleted Cloudinary image: ${publicId}`);
      return true;
    } else {
      console.error('Failed to delete from Cloudinary:', result);
      return false;
    }
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
};

export default cloudinary;