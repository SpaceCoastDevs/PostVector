import { MediaFile } from "../entities/media-file";
import { IRepository } from "../interfaces/repository";
import { StoreEntityCommand } from "../requests/store-entity-command";
import { AppResult } from "../results/app-result";

export class MediaFileServices {

    constructor(private commandRepository: IRepository<MediaFile>) {}

    async deleteRecord(id: string): Promise<boolean> {
        return this.commandRepository.delete(id);
    }

    async getRecordById(id: string): Promise<MediaFile | null> {
        return this.commandRepository.getById(id);
    }

    async recordExists(id: string): Promise<boolean> {
        return this.commandRepository.recordExists(id);
    }

    async storeRecord(command: StoreEntityCommand<MediaFile>): Promise<AppResult> {
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
