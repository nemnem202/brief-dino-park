import { v2 as cloudinary } from "cloudinary";

export class CloudinaryClient {
  private static instance: CloudinaryClient | null = null;

  private constructor() {}

  static getInstance(): CloudinaryClient {
    if (!this.instance) {
      this.instance = new CloudinaryClient();
      this.init_client();
    }

    return this.instance;
  }

  private static init_client() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
    });
  }
}
