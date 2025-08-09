
import { z } from "zod";

export const ScheduledPostSchema = z.object({
    id: z.string().uuid(),
    title: z.string().min(1),
    body: z.string().min(1),
    mediaList: z.array(z.string().uuid()),          
    accountId: z.string().uuid(),
    status: z.string().min(1),
    hashtags: z.array(z.string().min(1)),
    targetPlatforms: z.array(z.string().min(1)),
    scheduledTime: z.date()
});

export class ScheduledPost 
{
    id: string;
    title: string;
    body: string;
    mediaList: string[];
    accountId: string;
    status: string;
    hashtags: string[];
    targetPlatforms: string[];
    scheduledTime: Date;

    constructor(id: string, title: string, body: string, mediaList: string[], accountId: string, status: string, hashtags: string[], targetPlatforms: string[], scheduledTime: Date) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.mediaList = mediaList;
        this.accountId = accountId;
        this.status = status;
        this.hashtags = hashtags;
        this.targetPlatforms = targetPlatforms;
        this.scheduledTime = scheduledTime;
    }
}