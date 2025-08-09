import { MediaFile, MediaFileSchema } from "../entities/media-file";
import { AppResult } from "../results/app-result";
import { BaseDataService } from "./base-data-service";

export class MediaFileServices extends BaseDataService<MediaFile> {

    override validateEntity(entity: MediaFile): AppResult  {
        const validationResult = MediaFileSchema.safeParse(entity);
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












