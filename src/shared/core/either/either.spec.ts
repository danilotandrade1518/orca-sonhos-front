import { Either } from './either';

describe('Either', () => {
  describe('when creating success cases', () => {
    it('should create successful Either with data', () => {
      // Arrange
      const testData = 'test success data';

      // Act
      const result = Either.success(testData);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.hasError).toBe(false);
      expect(result.data).toBe(testData);
      expect(result.errors).toEqual([]);
    });

    it('should create successful Either with undefined data', () => {
      // Arrange & Act
      const result = Either.success<string, undefined>(undefined);

      // Assert
      expect(result.hasData).toBe(false); // undefined data means no data
      expect(result.hasError).toBe(false);
      expect(result.data).toBeNull(); // getter returns null when no data
      expect(result.errors).toEqual([]);
    });

    it('should create successful Either with null data', () => {
      // Arrange & Act
      const result = Either.success<string, null>(null);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.hasError).toBe(false);
      expect(result.data).toBeNull();
      expect(result.errors).toEqual([]);
    });

    it('should create successful Either with complex object data', () => {
      // Arrange
      const complexData = {
        id: '123',
        name: 'Test Entity',
        values: [1, 2, 3],
        metadata: { created: new Date() }
      };

      // Act
      const result = Either.success(complexData);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.data).toEqual(complexData);
      expect(result.data).toBe(complexData); // setData stores the same reference
    });
  });

  describe('when creating error cases', () => {
    it('should create Either with single error', () => {
      // Arrange
      const errorMessage = 'Test error message';

      // Act
      const result = Either.error<string, any>(errorMessage);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.data).toBeNull();
      expect(result.errors).toEqual([errorMessage]);
    });

    it('should create Either with Error object', () => {
      // Arrange
      const errorObj = new Error('Test error object');

      // Act
      const result = Either.error<Error, any>(errorObj);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.data).toBeNull();
      expect(result.errors).toEqual([errorObj]);
      expect(result.errors[0]).toBeInstanceOf(Error);
    });

    it('should create Either with multiple errors', () => {
      // Arrange
      const errorList = ['Error 1', 'Error 2', 'Error 3'];

      // Act
      const result = Either.errors<string, any>(errorList);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.data).toBeNull();
      expect(result.errors).toEqual(errorList);
      expect(result.errors.length).toBe(3);
    });

    it('should create Either with empty error array', () => {
      // Arrange
      const emptyErrors: string[] = [];

      // Act
      const result = Either.errors<string, any>(emptyErrors);

      // Assert
      expect(result.hasError).toBe(false); // No errors means no error state
      expect(result.hasData).toBe(false); // But also no data
      expect(result.data).toBeNull();
      expect(result.errors).toEqual([]);
    });

    it('should create Either with mixed error types', () => {
      // Arrange
      const mixedErrors = [
        'String error',
        new Error('Error object'),
        { code: 'CUSTOM_ERROR', message: 'Custom error object' }
      ];

      // Act
      const result = Either.errors<any, any>(mixedErrors);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toEqual(mixedErrors);
      expect(result.errors[0]).toBe('String error');
      expect(result.errors[1]).toBeInstanceOf(Error);
      expect(result.errors[2]).toEqual({ code: 'CUSTOM_ERROR', message: 'Custom error object' });
    });
  });

  describe('when manipulating Either instances', () => {
    it('should add single error to existing Either', () => {
      // Arrange
      const either = new Either<string, any>();
      const errorMessage = 'New error';

      // Act
      either.addError(errorMessage);

      // Assert
      expect(either.hasError).toBe(true);
      expect(either.errors).toEqual([errorMessage]);
    });

    it('should add multiple errors to existing Either', () => {
      // Arrange
      const either = new Either<string, any>();
      const newErrors = ['Error 1', 'Error 2'];

      // Act
      either.addManyErrors(newErrors);

      // Assert
      expect(either.hasError).toBe(true);
      expect(either.errors).toEqual(newErrors);
    });

    it('should add errors to Either that already has errors', () => {
      // Arrange
      const either = Either.error<string, any>('Initial error');
      const additionalErrors = ['Error 2', 'Error 3'];

      // Act
      either.addManyErrors(additionalErrors);

      // Assert
      expect(either.hasError).toBe(true);
      expect(either.errors).toEqual(['Initial error', 'Error 2', 'Error 3']);
      expect(either.errors.length).toBe(3);
    });

    it('should set data on existing Either', () => {
      // Arrange
      const either = new Either<string, string>();
      const testData = 'test data';

      // Act
      either.setData(testData);

      // Assert
      expect(either.hasData).toBe(true);
      expect(either.data).toBe(testData);
    });

    it('should overwrite existing data when setting new data', () => {
      // Arrange
      const either = Either.success('initial data');
      const newData = 'new data';

      // Act
      either.setData(newData);

      // Assert
      expect(either.data).toBe(newData);
    });
  });

  describe('when checking Either state', () => {
    it('should return correct hasError state for error Either', () => {
      // Arrange
      const either = Either.error<string, any>('test error');

      // Act & Assert
      expect(either.hasError).toBe(true);
    });

    it('should return correct hasError state for success Either', () => {
      // Arrange
      const either = Either.success('test data');

      // Act & Assert
      expect(either.hasError).toBe(false);
    });

    it('should return correct hasData state for success Either', () => {
      // Arrange
      const either = Either.success('test data');

      // Act & Assert
      expect(either.hasData).toBe(true);
    });

    it('should return correct hasData state for error Either', () => {
      // Arrange
      const either = Either.error<string, any>('test error');

      // Act & Assert
      expect(either.hasData).toBe(false);
    });

    it('should return correct hasData state for Either with undefined data', () => {
      // Arrange
      const either = Either.success<string, undefined>(undefined);

      // Act & Assert
      expect(either.hasData).toBe(false); // undefined means no data
    });

    it('should return false for hasData when Either has errors', () => {
      // Arrange
      const either = new Either<string, string>();
      either.addError('test error');
      either.setData('test data');

      // Act & Assert
      expect(either.hasData).toBe(false); // Should be false because of error
      expect(either.hasError).toBe(true);
    });
  });

  describe('when accessing Either data', () => {
    it('should return data when Either has data and no errors', () => {
      // Arrange
      const testData = 'test data';
      const either = Either.success(testData);

      // Act
      const result = either.data;

      // Assert
      expect(result).toBe(testData);
    });

    it('should return null when Either has errors', () => {
      // Arrange
      const either = Either.error<string, string>('test error');

      // Act
      const result = either.data;

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when Either has no data', () => {
      // Arrange
      const either = new Either<string, string>();

      // Act
      const result = either.data;

      // Assert
      expect(result).toBeNull();
    });

    it('should return errors array when Either has errors', () => {
      // Arrange
      const errors = ['Error 1', 'Error 2'];
      const either = Either.errors<string, any>(errors);

      // Act
      const result = either.errors;

      // Assert
      expect(result).toEqual(errors);
    });

    it('should return empty array when Either has no errors', () => {
      // Arrange
      const either = Either.success('test data');

      // Act
      const result = either.errors;

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('when using Either for validation workflows', () => {
    it('should support chaining validation results', () => {
      // Arrange
      const validateName = (name: string): Either<string, string> => {
        if (!name || name.trim().length === 0) {
          return Either.error('Name is required');
        }
        if (name.length > 100) {
          return Either.error('Name is too long');
        }
        return Either.success(name.trim());
      };

      const validateAge = (age: number): Either<string, number> => {
        if (age < 0) {
          return Either.error('Age cannot be negative');
        }
        if (age > 150) {
          return Either.error('Age is unrealistic');
        }
        return Either.success(age);
      };

      // Act - Valid case
      const validNameResult = validateName('John Doe');
      const validAgeResult = validateAge(30);

      // Assert - Valid case
      expect(validNameResult.hasData).toBe(true);
      expect(validNameResult.data).toBe('John Doe');
      expect(validAgeResult.hasData).toBe(true);
      expect(validAgeResult.data).toBe(30);

      // Act - Invalid cases
      const invalidNameResult = validateName('');
      const invalidAgeResult = validateAge(-5);

      // Assert - Invalid cases
      expect(invalidNameResult.hasError).toBe(true);
      expect(invalidNameResult.errors).toEqual(['Name is required']);
      expect(invalidAgeResult.hasError).toBe(true);
      expect(invalidAgeResult.errors).toEqual(['Age cannot be negative']);
    });

    it('should accumulate multiple validation errors', () => {
      // Arrange
      const validateUser = (name: string, age: number): Either<string, { name: string; age: number }> => {
        const errors: string[] = [];

        if (!name || name.trim().length === 0) {
          errors.push('Name is required');
        }
        if (name && name.length > 100) {
          errors.push('Name is too long');
        }
        if (age < 0) {
          errors.push('Age cannot be negative');
        }
        if (age > 150) {
          errors.push('Age is unrealistic');
        }

        if (errors.length > 0) {
          return Either.errors(errors);
        }

        return Either.success({ name: name.trim(), age });
      };

      // Act - Multiple validation errors
      const result = validateUser('', -5);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toEqual([
        'Name is required',
        'Age cannot be negative'
      ]);
      expect(result.errors.length).toBe(2);
    });
  });

  describe('when using Either for factory patterns', () => {
    class TestEntity {
      constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly value: number
      ) {}

      static create(props: {
        id: string;
        name: string;
        value: number;
      }): Either<string, TestEntity> {
        // Validation
        if (!props.id || props.id.trim().length === 0) {
          return Either.error('ID is required');
        }
        if (!props.name || props.name.trim().length === 0) {
          return Either.error('Name is required');
        }
        if (props.value < 0) {
          return Either.error('Value cannot be negative');
        }

        return Either.success(
          new TestEntity(props.id.trim(), props.name.trim(), props.value)
        );
      }
    }

    it('should create entity successfully with valid data', () => {
      // Arrange
      const props = {
        id: 'entity-123',
        name: 'Test Entity',
        value: 100
      };

      // Act
      const result = TestEntity.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.data).toBeInstanceOf(TestEntity);
      expect(result.data!.id).toBe('entity-123');
      expect(result.data!.name).toBe('Test Entity');
      expect(result.data!.value).toBe(100);
    });

    it('should return validation error with invalid data', () => {
      // Arrange
      const props = {
        id: '',
        name: 'Test Entity',
        value: -10
      };

      // Act
      const result = TestEntity.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('ID is required');
      expect(result.data).toBeNull();
    });

    it('should trim whitespace in entity creation', () => {
      // Arrange
      const props = {
        id: '  entity-123  ',
        name: '  Test Entity  ',
        value: 100
      };

      // Act
      const result = TestEntity.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.data!.id).toBe('entity-123');
      expect(result.data!.name).toBe('Test Entity');
    });
  });

  describe('edge cases and boundary conditions', () => {
    it('should handle very long error messages', () => {
      // Arrange
      const longError = 'A'.repeat(10000);

      // Act
      const result = Either.error<string, any>(longError);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors[0]).toBe(longError);
      expect(result.errors[0].length).toBe(10000);
    });

    it('should handle large number of errors', () => {
      // Arrange
      const manyErrors = Array.from({ length: 1000 }, (_, i) => `Error ${i + 1}`);

      // Act
      const result = Either.errors<string, any>(manyErrors);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1000);
      expect(result.errors[999]).toBe('Error 1000');
    });

    it('should handle circular reference in data', () => {
      // Arrange
      const circularData: any = { name: 'test' };
      circularData.self = circularData;

      // Act
      const result = Either.success(circularData);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.data).toBe(circularData);
      expect(result.data!.self).toBe(result.data);
    });

    it('should handle function as data', () => {
      // Arrange
      const functionData = () => 'test function';

      // Act
      const result = Either.success(functionData);

      // Assert
      expect(result.hasData).toBe(true);
      expect(typeof result.data).toBe('function');
      expect(result.data!()).toBe('test function');
    });

    it('should handle Symbol as error', () => {
      // Arrange
      const symbolError = Symbol('test error');

      // Act
      const result = Either.error<symbol, any>(symbolError);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors[0]).toBe(symbolError);
      expect(typeof result.errors[0]).toBe('symbol');
    });
  });
});