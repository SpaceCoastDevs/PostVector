import { ActionItemServices } from '../action-item-services';
import { ActionItem } from '../../entities/action-item';
import { StoreEntityCommand } from '../../requests/store-entity-command';
import { FirebaseRepository } from '../../../app-infrastructure/firebase-repository';
import { AppResult, GetRecordResult } from '../../results/app-result';
import { v4 as uuidv4 } from 'uuid';

// Mock the FirebaseRepository
jest.mock('../../../app-infrastructure/firebase-repository');
const MockedFirebaseRepository = FirebaseRepository as jest.MockedClass<typeof FirebaseRepository>;

describe('ActionItemServices', () => {
    let actionItemService: ActionItemServices;
    let mockRepository: jest.Mocked<FirebaseRepository<ActionItem>>;

    beforeEach(() => {
        // Create a mock repository
        mockRepository = new MockedFirebaseRepository<ActionItem>({} as any) as jest.Mocked<FirebaseRepository<ActionItem>>;
        
        // Mock the repository methods
        mockRepository.create = jest.fn();
        mockRepository.update = jest.fn();
        mockRepository.getRecordById = jest.fn();
        mockRepository.delete = jest.fn();
        mockRepository.recordExists = jest.fn();
        mockRepository.validate = jest.fn();

        // Create the service with the mocked repository
        actionItemService = new ActionItemServices(mockRepository);
    });

    describe('storeActionItem', () => {
        it('should store a new action item successfully with valid StoreEntityCommand', async () => {
            // Arrange
            const actionItem = new ActionItem(
                uuidv4(),
                'Test Action Item',
                'This is a test action item',
                'test-owner',
                3,
                'test-user',
                undefined,
                new Date(),
                undefined
            );

            const command = new StoreEntityCommand(actionItem, 'test-user');
            
            mockRepository.recordExists.mockResolvedValue(false); // New record
            mockRepository.create.mockResolvedValue(new AppResult(true, 'Record created successfully'));

            // Act
            const result = await actionItemService.storeActionItem(command);

            // Assert
            expect(result.result.success).toBe(true);
            expect(result.actionItem).toBeDefined();
            expect(result.actionItem?.id).toBe(actionItem.id);
            expect(result.actionItem?.name).toBe('Test Action Item');
            expect(mockRepository.recordExists).toHaveBeenCalledWith(actionItem.id);
            expect(mockRepository.create).toHaveBeenCalled();
            expect(mockRepository.update).not.toHaveBeenCalled();
        });

        it('should update an existing action item successfully', async () => {
            // Arrange
            const actionItem = new ActionItem(
                uuidv4(),
                'Updated Action Item',
                'This is an updated action item',
                'test-owner',
                4,
                'original-user',
                undefined,
                new Date(),
                undefined
            );

            const command = new StoreEntityCommand(actionItem, 'updating-user');
            
            mockRepository.recordExists.mockResolvedValue(true); // Existing record
            mockRepository.update.mockResolvedValue(AppResult.ok('Record updated successfully') as AppResult);

            // Act
            const result = await actionItemService.storeActionItem(command);

            // Assert
            expect(result.result.success).toBe(true);
            expect(result.actionItem).toBeDefined();
            expect(result.actionItem?.id).toBe(actionItem.id);
            expect(result.actionItem?.name).toBe('Updated Action Item');
            expect(mockRepository.recordExists).toHaveBeenCalledWith(actionItem.id);
            expect(mockRepository.update).toHaveBeenCalled();
            expect(mockRepository.create).not.toHaveBeenCalled();
        });

        it('should fail validation with invalid action item data', async () => {
            // Arrange
            const invalidActionItem = new ActionItem(
                '', // Invalid empty id
                '', // Invalid empty name
                '', // Invalid empty description
                '', // Invalid empty owner
                10, // Invalid priority (should be 1-5)
                '', // Invalid empty createdBy
                undefined,
                new Date(),
                undefined
            );

            const command = new StoreEntityCommand(invalidActionItem, 'test-user');

            // Act
            const result = await actionItemService.storeActionItem(command);

            // Assert
            expect(result.result.success).toBe(false);
            expect(result.result.errors).toBeDefined();
            expect(result.result.errors!.length).toBeGreaterThan(0);
            expect(result.actionItem).toBeUndefined();
            expect(mockRepository.recordExists).not.toHaveBeenCalled();
            expect(mockRepository.create).not.toHaveBeenCalled();
            expect(mockRepository.update).not.toHaveBeenCalled();
        });

        it('should handle repository errors gracefully', async () => {
            // Arrange
            const actionItem = new ActionItem(
                uuidv4(),
                'Test Action Item',
                'This is a test action item',
                'test-owner',
                3,
                'test-user',
                undefined,
                new Date(),
                undefined
            );

            const command = new StoreEntityCommand(actionItem, 'test-user');
            
            mockRepository.recordExists.mockRejectedValue(new Error('Database connection failed'));

            // Act
            const result = await actionItemService.storeActionItem(command);

            // Assert
            expect(result.result.success).toBe(false);
            expect(result.result.message).toBe('Failed to store action item');
            expect(result.result.errors).toContain('Database connection failed');
            expect(result.actionItem).toBeUndefined();
        });
    });

    describe('validateEntity', () => {
        it('should validate a valid action item', () => {
            // Arrange
            const validActionItem = new ActionItem(
                uuidv4(),
                'Test Action Item',
                'This is a test action item',
                'test-owner',
                3,
                'test-user',
                undefined,
                new Date(),
                undefined
            );

            // Act
            const result = actionItemService.validateEntity(validActionItem);

            // Assert
            expect(result.success).toBe(true);
            expect(result.message).toBe('Validation successful');
        });

        it('should fail validation for invalid action item', () => {
            // Arrange
            const invalidActionItem = new ActionItem(
                '', // Invalid empty id
                '', // Invalid empty name
                '', // Invalid empty description
                '', // Invalid empty owner
                10, // Invalid priority (should be 1-5)
                '', // Invalid empty createdBy
                undefined,
                new Date(),
                undefined
            );

            // Act
            const result = actionItemService.validateEntity(invalidActionItem);

            // Assert
            expect(result.success).toBe(false);
            expect(result.errors).toBeDefined();
            expect(result.errors!.length).toBeGreaterThan(0);
        });
    });
});
