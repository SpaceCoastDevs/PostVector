import { FileType } from "../enums/file-type";
import { IEntity } from "../interfaces/entity";

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