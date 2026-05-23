import { z } from "zod";
import { IEntity } from "../interfaces/entity";

export const ActionItemSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    owner: z.string().min(1, "Owner is required"),
    priority: z.number().int().min(1).max(5, "Priority must be between 1 and 5"),
    createdBy: z.string().min(1, "CreatedBy is required"),
    createdAt: z.date(),
    updatedBy: z.string().min(1, "UpdatedBy is required").optional(),
    updatedAt: z.date().optional()
});

export type ActionItemData = z.infer<typeof ActionItemSchema>;

export class ActionItem implements IEntity {
    id: string;
    name: string;
    description: string;
    owner: string;
    priority: number;
    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date | undefined;

    constructor(
        id: string,
        name: string,
        description: string,
        owner: string,
        priority: number,
        createdBy: string,
        updatedBy?: string,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.owner = owner;
        this.priority = priority;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy || '';
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt;
    }

    /**
     * Creates an ActionItem from validated data
     */
    static fromData(data: ActionItemData): ActionItem {
        return new ActionItem(
            data.id,
            data.name,
            data.description,
            data.owner,
            data.priority,
            data.createdBy,
            data.updatedBy,
            data.createdAt,
            data.updatedAt
        );
    }    /**
     * Validates the action item data using the Zod schema
     */
    static validate(data: unknown): { success: true; data: ActionItemData } | { success: false; errors: string[] } {
        try {
            const validatedData = ActionItemSchema.parse(data);
            return { success: true, data: validatedData };
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
                return { success: false, errors };
            }
            return { success: false, errors: ['Unknown validation error'] };
        }
    }

    /**
     * Converts the action item to a plain object for serialization
     */
    toObject(): ActionItemData {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            owner: this.owner,
            priority: this.priority,
            createdBy: this.createdBy,
            createdAt: this.createdAt,
            updatedBy: this.updatedBy,
            updatedAt: this.updatedAt
        };
    }

    /**
     * Creates a new action item with updated fields
     */
    update(updates: Partial<Pick<ActionItem, 'name' | 'description' | 'owner' | 'priority'>>, updatedBy: string): ActionItem {
        return new ActionItem(
            this.id,
            updates.name ?? this.name,
            updates.description ?? this.description,
            updates.owner ?? this.owner,
            updates.priority ?? this.priority,
            this.createdBy,
            updatedBy,
            this.createdAt,
            new Date()
        );
    }

    /**
     * Gets a human-readable priority description
     */
    getPriorityDescription(): string {
        switch (this.priority) {
            case 1: return 'Very Low';
            case 2: return 'Low';
            case 3: return 'Medium';
            case 4: return 'High';
            case 5: return 'Very High';
            default: return 'Unknown';
        }
    }
}
