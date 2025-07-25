export interface IEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date | undefined;
    createdBy: string;
    updatedBy: string;
}