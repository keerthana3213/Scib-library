export interface ImageData {
	fieldname: string;
	originalname: string;
	lastmodified?: number;
	mimetype: string;
	size: number;
	base64: string | null;
}

export type ImagesData = ImageData[];

export interface ImageFiles {
	id: string;
}

export const ALLOWED_FILE_TYPES = 'image/*';
