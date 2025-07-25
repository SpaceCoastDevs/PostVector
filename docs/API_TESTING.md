# API Testing Setup

This document describes the Jest testing setup for the Express API services.

## Setup

Jest is configured for TypeScript testing of the API services in the `src/api` directory.

### Dependencies
- `jest`: Testing framework
- `@types/jest`: TypeScript definitions for Jest
- `ts-jest`: TypeScript preprocessor for Jest
- `zod`: Schema validation library (used by services)

## Configuration

### Jest Configuration (`jest.config.js`)
- **Test Environment**: Node.js
- **Test Files**: Files matching `**/__tests__/**/*.ts` or `**/?(*.)+(spec|test).ts`
- **Coverage**: Collects coverage from `src/api/**/*.ts` files
- **Setup**: Uses `src/api/app-core/jest-setup.ts` for global test setup

## Running Tests

### Available Scripts
```bash
# Run all API tests
npm run test:api

# Run tests in watch mode
npm run test:api:watch

# Run tests with coverage report
npm run test:api:coverage

# Run specific test pattern using script
./scripts/test-api.sh "MediaFileServices"
```

### Example Test Commands
```bash
# Run all tests
npm run test:api

# Run tests for a specific service
npx jest media-files-services

# Run tests with verbose output
npx jest --verbose

# Run a specific test case
npx jest --testNamePattern="should return false when id is empty"
```

## Test Structure

### Test Files Location
Tests are located in `__tests__` directories alongside the source files:
```
src/api/app-core/services/
├── media-files-services.ts
└── __tests__/
    └── media-files-services.test.ts
```

### Test Organization
Each test file follows this structure:
- **Service instantiation** with mocked dependencies
- **Test suites** grouped by method (`describe` blocks)
- **Individual tests** for different scenarios (`it` blocks)
- **Helper functions** for creating test data

### Mock Strategy
- **Repository mocking**: Uses `jest.Mocked<IRepository<T>>` for repository dependencies
- **Test isolation**: Each test has fresh mocks via `beforeEach`
- **Data helpers**: Separate functions create valid/invalid test data

## Writing Tests

### Basic Test Structure
```typescript
describe('ServiceName', () => {
  let service: ServiceName;
  let mockRepository: jest.Mocked<IRepository<EntityType>>;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ServiceName(mockRepository);
  });

  describe('methodName', () => {
    it('should handle valid input', async () => {
      // Arrange
      const input = createValidInput();
      mockRepository.someMethod.mockResolvedValue(expectedResult);

      // Act
      const result = await service.methodName(input);

      // Assert
      expect(result).toBe(expectedResult);
      expect(mockRepository.someMethod).toHaveBeenCalledWith(input);
    });
  });
});
```

### Test Coverage Goals
- **Validation testing**: Test all input validation scenarios
- **Error handling**: Test error conditions and edge cases
- **Success paths**: Test normal operation flows
- **Repository interaction**: Verify correct repository method calls

## Coverage Reports

Coverage reports are generated in the `coverage/` directory:
- **HTML Report**: `coverage/lcov-report/index.html`
- **LCOV Report**: `coverage/lcov.info`
- **Console Output**: Shows coverage percentages during test runs

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Descriptive Names**: Test names should clearly describe the scenario
3. **AAA Pattern**: Arrange, Act, Assert structure
4. **Mock Verification**: Verify repository calls with correct parameters
5. **Edge Cases**: Test boundary conditions and error scenarios
6. **Data Helpers**: Use helper functions for creating test data

## Example Service Test

See `src/api/app-core/services/__tests__/media-files-services.test.ts` for a complete example of service testing including:
- Input validation testing
- Repository interaction mocking
- Error scenario handling
- Success path verification
