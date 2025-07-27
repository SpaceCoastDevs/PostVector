import { ScheduledPostList, ScheduledPostListSchema } from "../entities/scheduled-post-list";
import { AppResult } from "../results/app-result";
import { BaseDataService } from "./base-data-service";

export class ScheduledPostsService extends BaseDataService<ScheduledPostList> {

    override validateEntity(entity: ScheduledPostList): AppResult  {
        const validationResult = ScheduledPostListSchema.safeParse(entity);
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


    









