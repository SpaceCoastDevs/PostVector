import z from "zod";
import { FileType } from "../enums/file-type";
import { IEntity } from "../interfaces/entity";
import { AppResult } from "../results/app-result";

export const MediaFileSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    type: z.string().min(1),
    size: z.number().int().positive(),
    createdBy: z.string(),
    createdAt: z.date(),
    updatedBy: z.string().optional(),
    updatedAt: z.date().optional()
});

export class MediaFile implements IEntity {

  
  id: string = '';
  filename: string = '';
  url: string = '';
  type: FileType = FileType.IMAGE;
  size: number = 0;
  createdBy: string = '';
  accountId: string = '';
  uploadedAt: Date = new Date();
  cloudStorageId?: string = '';
  createdAt: Date = new Date();
  updatedAt: Date | undefined;
  updatedBy: string = '';
}   