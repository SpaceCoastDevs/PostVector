import { ActionItem, ActionItemSchema } from '../entities/action-item';

describe('ActionItem', () => {
    const sampleData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Action Item',
        description: 'This is a test action item',
        owner: 'test.user@example.com',
        priority: 3,
        createdBy: 'admin@example.com',
        createdAt: new Date('2025-01-01T00:00:00Z'),
        updatedBy: 'admin@example.com',
        updatedAt: undefined
    };

    const sampleDataWithoutUpdatedBy = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Action Item',
        description: 'This is a test action item',
        owner: 'test.user@example.com',
        priority: 3,
        createdBy: 'admin@example.com',
        createdAt: new Date('2025-01-01T00:00:00Z'),
        updatedAt: undefined
    };

    describe('Schema Validation', () => {
        it('should validate valid action item data with updatedBy', () => {
            const result = ActionItem.validate(sampleData);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(sampleData);
            }
        });

        it('should validate valid action item data without updatedBy', () => {
            const result = ActionItem.validate(sampleDataWithoutUpdatedBy);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.updatedBy).toBeUndefined();
            }
        });

        it('should reject invalid priority', () => {
            const invalidData = { ...sampleData, priority: 0 };
            const result = ActionItem.validate(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.errors).toContain('priority: Number must be greater than or equal to 1');
            }
        });

        it('should reject priority greater than 5', () => {
            const invalidData = { ...sampleData, priority: 6 };
            const result = ActionItem.validate(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.errors).toContain('priority: Priority must be between 1 and 5');
            }
        });

        it('should reject empty name', () => {
            const invalidData = { ...sampleData, name: '' };
            const result = ActionItem.validate(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.errors).toContain('name: Name is required');
            }
        });

        it('should reject empty description', () => {
            const invalidData = { ...sampleData, description: '' };
            const result = ActionItem.validate(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.errors).toContain('description: Description is required');
            }
        });

        it('should reject empty owner', () => {
            const invalidData = { ...sampleData, owner: '' };
            const result = ActionItem.validate(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.errors).toContain('owner: Owner is required');
            }
        });
    });

    describe('ActionItem Class', () => {
        it('should create an action item from valid data with updatedBy', () => {
            const validation = ActionItem.validate(sampleData);
            expect(validation.success).toBe(true);
            
            if (validation.success) {
                const actionItem = ActionItem.fromData(validation.data);
                expect(actionItem.id).toBe(sampleData.id);
                expect(actionItem.name).toBe(sampleData.name);
                expect(actionItem.description).toBe(sampleData.description);
                expect(actionItem.owner).toBe(sampleData.owner);
                expect(actionItem.priority).toBe(sampleData.priority);
                expect(actionItem.createdBy).toBe(sampleData.createdBy);
                expect(actionItem.updatedBy).toBe(sampleData.updatedBy);
            }
        });

        it('should create an action item from valid data without updatedBy', () => {
            const validation = ActionItem.validate(sampleDataWithoutUpdatedBy);
            expect(validation.success).toBe(true);
            
            if (validation.success) {
                const actionItem = ActionItem.fromData(validation.data);
                expect(actionItem.id).toBe(sampleDataWithoutUpdatedBy.id);
                expect(actionItem.name).toBe(sampleDataWithoutUpdatedBy.name);
                expect(actionItem.updatedBy).toBe(''); // Should default to empty string
            }
        });

        it('should convert to object correctly', () => {
            const validation = ActionItem.validate(sampleData);
            if (validation.success) {
                const actionItem = ActionItem.fromData(validation.data);
                const obj = actionItem.toObject();
                expect(obj).toEqual(sampleData);
            }
        });

        it('should update action item correctly', () => {
            const validation = ActionItem.validate(sampleData);
            if (validation.success) {
                const actionItem = ActionItem.fromData(validation.data);
                const updatedItem = actionItem.update(
                    { 
                        name: 'Updated Name',
                        priority: 5 
                    },
                    'updater@example.com'
                );

                expect(updatedItem.name).toBe('Updated Name');
                expect(updatedItem.priority).toBe(5);
                expect(updatedItem.description).toBe(sampleData.description); // unchanged
                expect(updatedItem.owner).toBe(sampleData.owner); // unchanged
                expect(updatedItem.updatedBy).toBe('updater@example.com');
                expect(updatedItem.updatedAt).toBeInstanceOf(Date);
                expect(updatedItem.id).toBe(actionItem.id); // unchanged
                expect(updatedItem.createdBy).toBe(actionItem.createdBy); // unchanged
                expect(updatedItem.createdAt).toBe(actionItem.createdAt); // unchanged
            }
        });

        it('should return correct priority descriptions', () => {
            const testCases = [
                { priority: 1, expected: 'Very Low' },
                { priority: 2, expected: 'Low' },
                { priority: 3, expected: 'Medium' },
                { priority: 4, expected: 'High' },
                { priority: 5, expected: 'Very High' },
                { priority: 99, expected: 'Unknown' }
            ];

            testCases.forEach(({ priority, expected }) => {
                const data = { ...sampleData, priority };
                const validation = ActionItem.validate(data);
                
                // Only test valid priorities for validation
                if (priority >= 1 && priority <= 5) {
                    expect(validation.success).toBe(true);
                    if (validation.success) {
                        const actionItem = ActionItem.fromData(validation.data);
                        expect(actionItem.getPriorityDescription()).toBe(expected);
                    }
                } else {
                    // For invalid priority, create manually to test description
                    const actionItem = new ActionItem(
                        data.id, data.name, data.description, data.owner, 
                        priority, data.createdBy, data.updatedBy, data.createdAt
                    );
                    expect(actionItem.getPriorityDescription()).toBe(expected);
                }
            });
        });

        it('should handle constructor with optional updatedBy', () => {
            const actionItem = new ActionItem(
                'test-id',
                'Test Name',
                'Test Description',
                'test@example.com',
                3,
                'creator@example.com'
            );

            expect(actionItem.updatedBy).toBe('');
            expect(actionItem.createdAt).toBeInstanceOf(Date);
            expect(actionItem.updatedAt).toBeUndefined();
        });
    });
});
