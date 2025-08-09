import { MediaFileServices } from '../media-files-services';
import { MediaFile } from '../../entities/media-file';
import { IRepository } from '../../interfaces/repository';
import { StoreEntityCommand } from '../../requests/store-entity-command';
import { AppResult, GetRecordResult } from '../../results/app-result';
import { FileType } from '../../enums/file-type';

// Mock the repository
const mockRepository: jest.Mocked<IRepository<MediaFile>> = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  recordExists: jest.fn(),
  getRecordById: jest.fn(),
  validate: jest.fn(),
};

describe('MediaFileServices', () => {
  let service: MediaFileServices;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    service = new MediaFileServices(mockRepository);
  });

  describe('deleteRecord', () => {
    it('should return false when id is empty', async () => {
      const result = await service.deleteRecord('');
      expect(result).toBe(false);
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    it('should return false when id is null', async () => {
      const result = await service.deleteRecord(null as any);
      expect(result).toBe(false);
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    it('should return false when id is not a valid UUID', async () => {
      const result = await service.deleteRecord('invalid-uuid');
      expect(result).toBe(false);
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    it('should call repository delete when id is a valid UUID', async () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      mockRepository.delete.mockResolvedValue(true);

      const result = await service.deleteRecord(validUuid);

      expect(mockRepository.delete).toHaveBeenCalledWith(validUuid);
      expect(result).toBe(true);
    });

    it('should return false when repository delete fails', async () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      mockRepository.delete.mockResolvedValue(false);

      const result = await service.deleteRecord(validUuid);

      expect(mockRepository.delete).toHaveBeenCalledWith(validUuid);
      expect(result).toBe(false);
    });
  });

  describe('getRecordById', () => {
    it('should return error result when id is empty', async () => {
      const result = await service.getRecordById('');
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid ID');
      expect(result.record).toBeNull();
      expect(result.errors).toContain('ID cannot be empty');
      expect(mockRepository.getRecordById).not.toHaveBeenCalled();
    });

    it('should return error result when id is not a valid UUID', async () => {
      const result = await service.getRecordById('invalid-uuid');
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid ID format');
      expect(result.record).toBeNull();
      expect(result.errors).toContain('ID must be a valid UUID');
      expect(mockRepository.getRecordById).not.toHaveBeenCalled();
    });

    it('should call repository getRecordById when id is valid', async () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      const mockMediaFile = createMockMediaFile();
      const mockResult = new GetRecordResult<MediaFile>(true, 'Success', mockMediaFile);
      
      mockRepository.getRecordById.mockResolvedValue(mockResult);

      const result = await service.getRecordById(validUuid);

      expect(mockRepository.getRecordById).toHaveBeenCalledWith(validUuid);
      expect(result).toBe(mockResult);
    });
  });

  describe('recordExists', () => {
    it('should return false when id is empty', async () => {
      const result = await service.recordExists('');
      expect(result).toBe(false);
      expect(mockRepository.recordExists).not.toHaveBeenCalled();
    });

    it('should return false when id is not a valid UUID', async () => {
      const result = await service.recordExists('invalid-uuid');
      expect(result).toBe(false);
      expect(mockRepository.recordExists).not.toHaveBeenCalled();
    });

    it('should call repository recordExists when id is valid', async () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      mockRepository.recordExists.mockResolvedValue(true);

      const result = await service.recordExists(validUuid);

      expect(mockRepository.recordExists).toHaveBeenCalledWith(validUuid);
      expect(result).toBe(true);
    });

    it('should return false when repository recordExists returns false', async () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      mockRepository.recordExists.mockResolvedValue(false);

      const result = await service.recordExists(validUuid);

      expect(mockRepository.recordExists).toHaveBeenCalledWith(validUuid);
      expect(result).toBe(false);
    });
  });

  describe('storeRecord', () => {
    let validCommand: StoreEntityCommand<MediaFile>;
    let validMediaFile: MediaFile;

    beforeEach(() => {
      validMediaFile = createValidMediaFileForSchema();
      validCommand = new StoreEntityCommand(validMediaFile, 'user-123');
    });

    it('should return validation error when entity is invalid - missing id', async () => {
      const invalidMediaFile = { ...validMediaFile, id: '' };
      const command = new StoreEntityCommand(invalidMediaFile, 'user-123');

      const result = await service.storeRecord(command);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(mockRepository.recordExists).not.toHaveBeenCalled();
    });

    it('should return validation error when entity is invalid - invalid UUID', async () => {
      const invalidMediaFile = { ...validMediaFile, id: 'invalid-uuid' };
      const command = new StoreEntityCommand(invalidMediaFile, 'user-123');

      const result = await service.storeRecord(command);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(mockRepository.recordExists).not.toHaveBeenCalled();
    });

    it('should return validation error when entity is invalid - empty name', async () => {
      const invalidMediaFile = { ...validMediaFile, name: '' };
      const command = new StoreEntityCommand(invalidMediaFile, 'user-123');

      const result = await service.storeRecord(command);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(mockRepository.recordExists).not.toHaveBeenCalled();
    });

    it('should return validation error when entity is invalid - negative size', async () => {
      const invalidMediaFile = { ...validMediaFile, size: -1 };
      const command = new StoreEntityCommand(invalidMediaFile, 'user-123');

      const result = await service.storeRecord(command);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(mockRepository.recordExists).not.toHaveBeenCalled();
    });

    it('should create new record when entity does not exist', async () => {
      mockRepository.recordExists.mockResolvedValue(false);
      mockRepository.create.mockResolvedValue(AppResult.ok('Created successfully') as AppResult);

      const result = await service.storeRecord(validCommand);

      expect(mockRepository.recordExists).toHaveBeenCalledWith(validCommand.entity.id);
      expect(mockRepository.create).toHaveBeenCalledWith(validCommand.entity);
      expect(validCommand.entity.createdBy).toBe('user-123');
      expect(validCommand.entity.createdAt).toBeInstanceOf(Date);
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should update existing record when entity exists', async () => {
      mockRepository.recordExists.mockResolvedValue(true);
      mockRepository.update.mockResolvedValue(AppResult.ok('Updated successfully') as AppResult);

      const result = await service.storeRecord(validCommand);

      expect(mockRepository.recordExists).toHaveBeenCalledWith(validCommand.entity.id);
      expect(mockRepository.update).toHaveBeenCalledWith(validCommand.entity);
      expect(validCommand.entity.updatedBy).toBe('user-123');
      expect(validCommand.entity.updatedAt).toBeInstanceOf(Date);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should handle repository create failure', async () => {
      mockRepository.recordExists.mockResolvedValue(false);
      mockRepository.create.mockResolvedValue(AppResult.fail(['Create failed']) as AppResult);

      const result = await service.storeRecord(validCommand);

      expect(result.success).toBe(false);
      expect(result.errors).toContain('Create failed');
    });

    it('should handle repository update failure', async () => {
      mockRepository.recordExists.mockResolvedValue(true);
      mockRepository.update.mockResolvedValue(AppResult.fail(['Update failed']) as AppResult);

      const result = await service.storeRecord(validCommand);

      expect(result.success).toBe(false);
      expect(result.errors).toContain('Update failed');
    });
  });
});

// Helper functions
function createMockMediaFile(): MediaFile {
  const mediaFile = new MediaFile();
  mediaFile.id = '123e4567-e89b-12d3-a456-426614174000';
  mediaFile.filename = 'test-file.jpg';
  mediaFile.url = 'http://example.com/test-file.jpg';
  mediaFile.type = FileType.IMAGE;
  mediaFile.size = 1024;
  mediaFile.createdBy = 'user-123';
  mediaFile.accountId = 'account-123';
  mediaFile.uploadedAt = new Date();
  mediaFile.createdAt = new Date();
  return mediaFile;
}

// Note: The schema in the service expects different properties than the MediaFile entity
// This helper creates an object that matches the schema validation
function createValidMediaFileForSchema(): any {
  return {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'test-file.jpg', // Schema expects 'name' not 'filename'
    type: 'image/jpeg',     // Schema expects type as string, not FileType enum
    size: 1024,
    createdBy: 'user-123',
    createdAt: new Date(),
  };
}
