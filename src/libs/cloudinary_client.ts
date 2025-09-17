import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";

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
    const config = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    };
    // console.log("[CLOUDINARY CONFIG] : ", config);
    cloudinary.config(config);
  }

  async upload_img(
    buffer: Buffer
  ): Promise<UploadApiResponse | UploadApiErrorResponse | string | any> {
    try {
      const result = await new Promise<UploadApiResponse | UploadApiErrorResponse | string>(
        (resolve) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "uploads",
              transformation: [{ width: 300, height: 300, crop: "fill" }],
            },
            (error, result) => {
              if (error) return resolve(error);
              if (!result) return resolve("Unexpected error, no result");
              resolve(result);
            }
          );

          streamifier.createReadStream(buffer).pipe(uploadStream);
        }
      );
      return result;
    } catch (err) {
      return err;
    }
  }
}
