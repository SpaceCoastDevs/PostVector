// create a class for a list of scheduled posts
import { IEntity } from "../interfaces/entity";
import { ScheduledPost, ScheduledPostSchema } from "./scheduled-post";
import { z } from "zod";

export const ScheduledPostListSchema = z.object({
    id: z.string().uuid(),
    posts: z.array(ScheduledPostSchema).optional(),
    createdAt: z.date().default(new Date()),
    updatedAt: z.date().nullable().default(null),
    createdBy: z.string(),
    updatedBy: z.string().optional()
});

export class ScheduledPostList implements IEntity {
    posts: ScheduledPost[];

    id: string;
    createdAt: Date;
    updatedAt: Date | undefined;
    createdBy: string;
    updatedBy: string;

    constructor(posts: ScheduledPost[], id: string, createdAt: Date, createdBy: string, updatedAt?: Date, updatedBy?: string) {
        this.posts = posts;
        this.id = id;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
        this.updatedAt = updatedAt;
        this.updatedBy = updatedBy || '';
    }   
}