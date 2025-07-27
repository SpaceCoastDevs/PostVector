
import { ActionItem, ActionItemSchema } from "../entities/action-item";
import { AppResult } from "../results/app-result";
import { BaseDataService } from "./base-data-service";

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
}