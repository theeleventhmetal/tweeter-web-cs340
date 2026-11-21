// AI-assisted: see AI-ATTRIBUTION.md
import {
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { ImageDao } from "../interface/ImageDao";

const BUCKET = process.env.IMAGES_BUCKET_NAME ?? "";
const REGION = process.env.AWS_REGION ?? "us-east-1";

const CONTENT_TYPES_BY_EXTENSION: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
};

export class S3ImageDao implements ImageDao {
  private readonly client = new S3Client({ region: REGION });

  public async uploadImage(
    fileName: string,
    imageBase64Encoded: string
  ): Promise<string> {
    const decodedImageBuffer = Buffer.from(imageBase64Encoded, "base64");
    const extension = fileName.split(".").pop()?.toLowerCase() ?? "";

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: `image/${fileName}`,
      Body: decodedImageBuffer,
      ContentType:
        CONTENT_TYPES_BY_EXTENSION[extension] ?? "application/octet-stream",
      ACL: ObjectCannedACL.public_read,
    });

    try {
      await this.client.send(command);
      return `https://${BUCKET}.s3.${REGION}.amazonaws.com/image/${fileName}`;
    } catch (error) {
      throw new Error("S3 put image failed with: " + error);
    }
  }
}
