import { ScheduledPost } from '../../entities/scheduled-post';
import { ScheduledPostList } from '../../entities/scheduled-post-list';
import { IRepository } from '../../interfaces/repository';
import { StoreEntityCommand } from '../../requests/store-entity-command';
import { AppResult, GetRecordResult } from '../../results/app-result';
import { ScheduledPostsService } from '../scheduled-posts-services';

// Mock the repository
const mockRepository: jest.Mocked<IRepository<ScheduledPostList>> = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  recordExists: jest.fn(),
  getRecordById: jest.fn(),
  validate: jest.fn(),
};

describe('ScheduledPostsService', () => {
  let service: ScheduledPostsService;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    service = new ScheduledPostsService(mockRepository);
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

  // create test to test storing a ScheduledPostList that's valid
  describe('storeRecord', () => {
    it('should return a successful AppResult when storing a valid ScheduledPostList', async () => {
      const scheduledPostList = createScheduledPostList();
      const command = new StoreEntityCommand<ScheduledPostList>(scheduledPostList, 'user1');

      mockRepository.recordExists.mockResolvedValue(false);
      mockRepository.create.mockResolvedValue(new AppResult(true, 'Record created successfully'));

      const result = await service.storeRecord(command);

      console.log(result)

      //expect(mockRepository.create).toHaveBeenCalledWith(scheduledPostList);
      expect(result.success).toBe(true);
      //expect(result.message).toBe('Record created successfully');
    });

  });


});

export function createScheduledPostList(): ScheduledPostList {
  const accountId1 = '400d9961-0440-4d99-8ca4-6b2086078cd1';
  const posts = [
        new ScheduledPost('400d9961-0440-4d99-8ca4-6b2086078cd1', 'Why did Anakin cross the road?', 'To get to the Dark Side!', [], accountId1, 'scheduled', [], ['twitter'], new Date('2023-10-02T10:00:00Z')),
        new ScheduledPost('400d9961-0440-4d99-8ca4-6b2086078cd2', 'What do you call a Sith who likes to dance?', 'Darth Groover!', [], accountId1, 'scheduled', [], ['twitter'], new Date('2023-10-04T10:00:00Z')),
        new ScheduledPost('400d9961-0440-4d99-8ca4-6b2086078cd3', 'Why did the Jedi refuse to play cards?', 'Because he was afraid of Chewie!', [], accountId1, 'scheduled', [], ['twitter'], new Date('2023-10-06T10:00:00Z')),
        new ScheduledPost('400d9961-0440-4d99-8ca4-6b2086078cd4', 'What do you call a stormtrooper with a sense of humor?', 'A real blast!', [], accountId1, 'scheduled', [], ['twitter'], new Date('2023-10-07T10:00:00Z'))
    ];

  const result = new ScheduledPostList(posts, 'da4a4e80-a1ad-4f69-8c1b-fbbaa600c128', new Date(), 'user1');
  console.log(result);
  return result;
}