
import { ActionItem, ActionItemSchema } from "../entities/action-item";
import { AppResult, GetRecordResult } from "../results/app-result";
import { BaseDataService } from "./base-data-service";
import { StoreEntityCommand } from "../requests/store-entity-command";
import { v4 as uuidv4 } from 'uuid';

export class ActionItemServices extends BaseDataService<ActionItem> {

    override validateEntity(entity: ActionItem): AppResult  {
        const validationResult = ActionItemSchema.safeParse(entity);
        if (!validationResult.success) 
        {
            const errors = validationResult.error.errors.map(err => err.message);
            return AppResult.fail(errors) as AppResult;
        } 
        else 
        {
            return new AppResult(true, "Validation successful");
        }
    }

    async storeActionItem(command: StoreEntityCommand<ActionItem>): Promise<{ result: AppResult; actionItem?: ActionItem }> {
        try {
            // Validate the action item entity
            const validationResult = this.validateEntity(command.entity);
            if (!validationResult.success) {
                return { result: validationResult };
            }

            // Use the base service to store the record (handles create/update logic)
            const result = await this.storeRecord(command);

            return { result, actionItem: result.success ? command.entity : undefined };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return { 
                result: new AppResult(false, 'Failed to store action item', [errorMessage])
            };
        }
    }
}