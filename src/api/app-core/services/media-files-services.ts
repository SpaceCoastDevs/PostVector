import { MediaFile } from "../entities/media-file";
import { IRepository } from "../interfaces/repository";
import { StoreEntityCommand } from "../requests/store-entity-command";
import { AppResult, GetRecordResult } from "../results/app-result";
import { z } from "zod";    

const MediaFileSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    type: z.string().min(1),
    size: z.number().int().positive(),
    createdBy: z.string(),
    createdAt: z.date(),
    updatedBy: z.string().optional(),
    updatedAt: z.date().optional()
});

export class MediaFileServices {

    constructor(private commandRepository: IRepository<MediaFile>) {}

    async deleteRecord(id: string): Promise<boolean> {
        if (!id) {
            return false;
        }

        if (!z.string().uuid().safeParse(id).success) {
            return false;        
        }
        
        return this.commandRepository.delete(id);
    }

    async getRecordById(id: string): Promise<GetRecordResult<MediaFile>> {
        if (!id) {
            return new GetRecordResult<MediaFile>(false, "Invalid ID", null, ["ID cannot be empty"]);
        }

        if (!z.string().uuid().safeParse(id).success) {
            return new GetRecordResult<MediaFile>(false, "Invalid ID format", null, ["ID must be a valid UUID"]);
        }

        return this.commandRepository.getRecordById(id);
    }

    async recordExists(id: string): Promise<boolean> {
        if (!id) {
            return false;
        }

        if (!z.string().uuid().safeParse(id).success) {
            return false;        
        }

        return this.commandRepository.recordExists(id);
    }

    async storeRecord(command: StoreEntityCommand<MediaFile>): Promise<AppResult> {
        const validationResult = MediaFileSchema.safeParse(command.entity);
        if (!validationResult.success) 
        {
            const errors = validationResult.error.errors.map(err => err.message);
            return AppResult.fail(errors);
        }

        const exists = await this.commandRepository.recordExists(command.entity.id);
        if (exists) 
        {
            command.entity.updatedBy = command.userId;
            command.entity.updatedAt = new Date();
            return this.commandRepository.update(command.entity);
        }
        else 
        {
            command.entity.createdBy = command.userId;
            command.entity.createdAt = new Date();
            return this.commandRepository.create(command.entity);
        }
    }




}
