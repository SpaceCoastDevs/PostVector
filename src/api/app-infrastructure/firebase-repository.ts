import { Firestore } from "firebase-admin/firestore";
import { IRepository } from "../app-core/interfaces/repository";
import { IEntity } from "../app-core/interfaces/entity";
import { AppResult, GetRecordResult } from "../app-core/results/app-result";
import { StoreEntityCommand } from "../app-core/requests/store-entity-command";

export interface FirebaseRepositoryConfig {
    firestore: Firestore;
    collectionName: string;
}

export class FirebaseRepository<T extends IEntity> implements IRepository<T> {
    private db: Firestore;
    private collectionName: string;

    constructor(config: FirebaseRepositoryConfig) {
        this.db = config.firestore;
        this.collectionName = config.collectionName;
    }

    async create(item: T): Promise<AppResult> {
        try {
            // Validate the entity before creating
            const validationResult = this.validate(item);
            if (!validationResult.success) {
                return validationResult;
            }

            // Set timestamps
            const now = new Date();
            const entityToCreate = {
                ...item,
                createdAt: now,
                updatedAt: undefined
            };

            // Add to Firestore
            await this.db.collection(this.collectionName).doc(item.id).set(entityToCreate);

            return AppResult.ok(`Entity created successfully with ID: ${item.id}`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return AppResult.fail([`Failed to create entity: ${errorMessage}`]);
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            if (!id || id.trim() === '') {
                return false;
            }

            await this.db.collection(this.collectionName).doc(id).delete();
            return true;
        } catch (error) {
            console.error(`Failed to delete entity with ID ${id}:`, error);
            return false;
        }
    }

    async getRecordById(id: string): Promise<GetRecordResult<T>> {
        try {
            if (!id || id.trim() === '') {
                return new GetRecordResult<T>(false, 'Invalid ID provided', null, ['ID cannot be empty']);
            }

            const doc = await this.db.collection(this.collectionName).doc(id).get();
            
            if (!doc.exists) {
                return new GetRecordResult<T>(false, `Entity with ID ${id} not found`, null);
            }

            const data = doc.data();
            if (!data) {
                return new GetRecordResult<T>(false, `No data found for entity with ID ${id}`, null);
            }

            // Convert Firestore timestamps back to Date objects
            const entity = {
                ...data,
                createdAt: data['createdAt']?.toDate() || new Date(),
                updatedAt: data['updatedAt']?.toDate() || undefined
            } as T;

            return new GetRecordResult<T>(true, `Entity retrieved successfully`, entity);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return new GetRecordResult<T>(false, `Failed to retrieve entity: ${errorMessage}`, null, [errorMessage]);
        }
    }

    async recordExists(id: string): Promise<boolean> {
        try {
            if (!id || id.trim() === '') {
                return false;
            }

            const doc = await this.db.collection(this.collectionName).doc(id).get();
            return doc.exists;
        } catch (error) {
            console.error(`Failed to check if record exists with ID ${id}:`, error);
            return false;
        }
    }

    async update(item: T): Promise<AppResult> {
        try {
            // Validate the entity before updating
            const validationResult = this.validate(item);
            if (!validationResult.success) {
                return validationResult;
            }

            // Check if the record exists
            const exists = await this.recordExists(item.id);
            if (!exists) {
                return AppResult.fail([`Entity with ID ${item.id} does not exist`]);
            }

            // Set updated timestamp
            const entityToUpdate = {
                ...item,
                updatedAt: new Date()
            };

            // Update in Firestore
            await this.db.collection(this.collectionName).doc(item.id).set(entityToUpdate);

            return AppResult.ok(`Entity updated successfully with ID: ${item.id}`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return AppResult.fail([`Failed to update entity: ${errorMessage}`]);
        }
    }

    validate(entity: T): AppResult {
        const errors: string[] = [];

        // Check required fields from IEntity
        if (!entity.id || entity.id.trim() === '') {
            errors.push('Entity ID is required');
        }

        if (!entity.createdBy || entity.createdBy.trim() === '') {
            errors.push('CreatedBy is required');
        }
        
        if (!entity.createdAt) {
            errors.push('CreatedAt is required');
        }
        if (errors.length > 0) {
            return new AppResult(false, "Validation failed", errors);
        }

        return new AppResult(true, 'Entity is valid');
    }

    // Helper method to get all records (useful for listing/querying)
    async getAllRecords(): Promise<GetRecordResult<T[]>> {
        try {
            const snapshot = await this.db.collection(this.collectionName).get();
            
            if (snapshot.empty) {
                return new GetRecordResult<T[]>(true, 'No records found', []);
            }

            const records: T[] = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                const entity = {
                    ...data,
                    createdAt: data['createdAt']?.toDate() || new Date(),
                    updatedAt: data['updatedAt']?.toDate() || undefined
                } as T;
                records.push(entity);
            });

            return new GetRecordResult<T[]>(true, `Retrieved ${records.length} records`, records);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return new GetRecordResult<T[]>(false, `Failed to retrieve records: ${errorMessage}`, null, [errorMessage]);
        }
    }

    // Helper method to query records with conditions
    async queryRecords(field: string, operator: FirebaseFirestore.WhereFilterOp, value: any): Promise<GetRecordResult<T[]>> {
        try {
            const snapshot = await this.db.collection(this.collectionName)
                .where(field, operator, value)
                .get();
            
            if (snapshot.empty) {
                return new GetRecordResult<T[]>(true, 'No records found matching the query', []);
            }

            const records: T[] = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                const entity = {
                    ...data,
                    createdAt: data['createdAt']?.toDate() || new Date(),
                    updatedAt: data['updatedAt']?.toDate() || undefined
                } as T;
                records.push(entity);
            });

            return new GetRecordResult<T[]>(true, `Retrieved ${records.length} records`, records);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return new GetRecordResult<T[]>(false, `Failed to query records: ${errorMessage}`, null, [errorMessage]);
        }
    }
}
