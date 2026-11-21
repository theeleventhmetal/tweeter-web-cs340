// AI-assisted: see AI-ATTRIBUTION.md

export interface ImageDao {
  uploadImage(fileName: string, imageBase64Encoded: string): Promise<string>;
}
