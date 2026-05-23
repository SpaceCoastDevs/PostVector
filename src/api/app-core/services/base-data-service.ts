import { App } from "firebase-admin/app";
import { IEntity } from "../interfaces/entity";
import { IRepository } from "../interfaces/repository";
import { StoreEntityCommand } from "../requests/store-entity-command";
import { GetRecordResult, AppResult } from "../results/app-result";
import z from "zod";

export class BaseDataService<T extends IEntity> {
    constructor(private commandRepository: IRepository<T>) {
        // Initialization logic if needed
    }

    async deleteRecord(id: string): Promise<boolean> {
        if (!id) {
            return false;
        }

        if (!z.string().uuid().safeParse(id).success) {
            return false;
        }

        return this.commandRepository.delete(id);
    }

    async getRecordById(id: string): Promise<GetRecordResult<T>> {
        if (!id) {
            return new GetRecordResult<T>(false, "Invalid ID", null, ["ID cannot be empty"]);
        }

        if (!z.string().uuid().safeParse(id).success) {
            return new GetRecordResult<T>(false, "Invalid ID format", null, ["ID must be a valid UUID"]);
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

    // This needs to be overridden in derived classes
    // to provide specific validation logic for the entity type
    // Default implementation returns a successful AppResult
    validateEntity(entity: T): AppResult { 
        return new AppResult(true, "Validation successful"); 
    }   

    async storeRecord(command: StoreEntityCommand<T>): Promise<AppResult> {

        const validateResult = this.validateEntity(command.entity);
        if (validateResult.success === false) {
            return AppResult.fail(validateResult.errors);
        }

        const exists = await this.commandRepository.recordExists(command.entity.id);
        if (exists) {
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
