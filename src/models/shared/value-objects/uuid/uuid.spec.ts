import { Uuid } from './uuid';

describe('Uuid', () => {
  describe('when creating Uuid from valid string', () => {
    it('should create Uuid with valid UUID v4 string', () => {
      // Arrange
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';

      // Act
      const result = Uuid.create(validUuid);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.hasError).toBe(false);
      const uuid = result.data!;
      expect(uuid.value).toBe(validUuid);
      expect(uuid.toString()).toBe(validUuid);
    });

    it('should create Uuid with lowercase UUID', () => {
      // Arrange
      const lowercaseUuid = 'a1b2c3d4-e5f6-4789-a012-b3c4d5e6f789';

      // Act
      const result = Uuid.create(lowercaseUuid);

      // Assert
      expect(result.hasData).toBe(true);
      const uuid = result.data!;
      expect(uuid.value).toBe(lowercaseUuid);
    });

    it('should create Uuid with uppercase UUID', () => {
      // Arrange
      const uppercaseUuid = 'A1B2C3D4-E5F6-4789-A012-B3C4D5E6F789';

      // Act
      const result = Uuid.create(uppercaseUuid);

      // Assert
      expect(result.hasData).toBe(true);
      const uuid = result.data!;
      expect(uuid.value).toBe(uppercaseUuid);
    });

    it('should create Uuid with mixed case UUID', () => {
      // Arrange
      const mixedCaseUuid = 'A1b2C3d4-E5f6-4789-A012-b3C4d5E6f789';

      // Act
      const result = Uuid.create(mixedCaseUuid);

      // Assert
      expect(result.hasData).toBe(true);
      const uuid = result.data!;
      expect(uuid.value).toBe(mixedCaseUuid);
    });

    it('should create Uuid with valid UUID v1', () => {
      // Arrange
      const uuidV1 = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

      // Act
      const result = Uuid.create(uuidV1);

      // Assert
      expect(result.hasData).toBe(true);
      const uuid = result.data!;
      expect(uuid.value).toBe(uuidV1);
    });

    it('should create Uuid with valid UUID v2', () => {
      // Arrange
      const uuidV2 = '6ba7b811-9dad-21d1-80b4-00c04fd430c8';

      // Act
      const result = Uuid.create(uuidV2);

      // Assert
      expect(result.hasData).toBe(true);
      const uuid = result.data!;
      expect(uuid.value).toBe(uuidV2);
    });

    it('should create Uuid with valid UUID v3', () => {
      // Arrange
      const uuidV3 = '6ba7b812-9dad-31d1-80b4-00c04fd430c8';

      // Act
      const result = Uuid.create(uuidV3);

      // Assert
      expect(result.hasData).toBe(true);
      const uuid = result.data!;
      expect(uuid.value).toBe(uuidV3);
    });

    it('should create Uuid with valid UUID v4', () => {
      // Arrange
      const uuidV4 = '6ba7b813-9dad-41d1-80b4-00c04fd430c8';

      // Act
      const result = Uuid.create(uuidV4);

      // Assert
      expect(result.hasData).toBe(true);
      const uuid = result.data!;
      expect(uuid.value).toBe(uuidV4);
    });

    it('should create Uuid with valid UUID v5', () => {
      // Arrange
      const uuidV5 = '6ba7b814-9dad-51d1-80b4-00c04fd430c8';

      // Act
      const result = Uuid.create(uuidV5);

      // Assert
      expect(result.hasData).toBe(true);
      const uuid = result.data!;
      expect(uuid.value).toBe(uuidV5);
    });
  });

  describe('when creating Uuid with invalid input', () => {
    it('should return error when input is not a string', () => {
      // Arrange
      const invalidInput = 123 as any;

      // Act
      const result = Uuid.create(invalidInput);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toEqual(['UUID must be a string']);
      expect(result.data).toBeNull();
    });

    it('should return error when input is null', () => {
      // Arrange
      const nullInput = null as any;

      // Act
      const result = Uuid.create(nullInput);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toEqual(['UUID must be a string']);
    });

    it('should return error when input is undefined', () => {
      // Arrange
      const undefinedInput = undefined as any;

      // Act
      const result = Uuid.create(undefinedInput);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toEqual(['UUID must be a string']);
    });

    it('should return error when input is empty string', () => {
      // Arrange
      const emptyString = '';

      // Act
      const result = Uuid.create(emptyString);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toEqual(['Invalid UUID format']);
    });

    it('should return error when UUID format is invalid - too short', () => {
      // Arrange
      const shortUuid = '123e4567-e89b-12d3-a456-42661417400';

      // Act
      const result = Uuid.create(shortUuid);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toEqual(['Invalid UUID format']);
    });

    it('should return error when UUID format is invalid - too long', () => {
      // Arrange
      const longUuid = '123e4567-e89b-12d3-a456-4266141740000';

      // Act
      const result = Uuid.create(longUuid);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toEqual(['Invalid UUID format']);
    });

    it('should return error when UUID format is invalid - missing hyphens', () => {
      // Arrange
      const noHyphensUuid = '123e4567e89b12d3a456426614174000';

      // Act
      const result = Uuid.create(noHyphensUuid);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toEqual(['Invalid UUID format']);
    });

    it('should return error when UUID format is invalid - wrong hyphen positions', () => {
      // Arrange
      const wrongHyphensUuid = '123e4567e-89b-12d3-a456-426614174000';

      // Act
      const result = Uuid.create(wrongHyphensUuid);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toEqual(['Invalid UUID format']);
    });

    it('should return error when UUID contains invalid characters', () => {
      // Arrange
      const invalidCharsUuid = '123g4567-e89b-12d3-a456-426614174000';

      // Act
      const result = Uuid.create(invalidCharsUuid);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toEqual(['Invalid UUID format']);
    });

    it('should return error when UUID version is invalid', () => {
      // Arrange
      const invalidVersionUuid = '123e4567-e89b-02d3-a456-426614174000'; // version 0

      // Act
      const result = Uuid.create(invalidVersionUuid);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toEqual(['Invalid UUID format']);
    });

    it('should return error when UUID variant is invalid', () => {
      // Arrange
      const invalidVariantUuid = '123e4567-e89b-42d3-2456-426614174000'; // variant starts with 2

      // Act
      const result = Uuid.create(invalidVariantUuid);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toEqual(['Invalid UUID format']);
    });

    it('should return error when UUID is just random text', () => {
      // Arrange
      const randomText = 'this is not a uuid at all';

      // Act
      const result = Uuid.create(randomText);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toEqual(['Invalid UUID format']);
    });
  });

  describe('when generating new UUIDs', () => {
    it('should generate valid UUID', () => {
      // Arrange & Act
      const uuid = Uuid.generate();

      // Assert
      expect(uuid).toBeInstanceOf(Uuid);
      expect(uuid.value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should generate different UUIDs on each call', () => {
      // Arrange & Act
      const uuid1 = Uuid.generate();
      const uuid2 = Uuid.generate();

      // Assert
      expect(uuid1.value).not.toBe(uuid2.value);
      expect(uuid1).not.toBe(uuid2); // Different instances
    });

    it('should generate UUID v4 format', () => {
      // Arrange & Act
      const uuid = Uuid.generate();

      // Assert
      // UUID v4 should have '4' as the first character of the third group
      const parts = uuid.value.split('-');
      expect(parts[2].charAt(0)).toBe('4');
    });

    it('should generate UUIDs with proper variant', () => {
      // Arrange & Act
      const uuid = Uuid.generate();

      // Assert
      // UUID variant should start with 8, 9, a, or b
      const parts = uuid.value.split('-');
      const variantChar = parts[3].charAt(0).toLowerCase();
      expect(['8', '9', 'a', 'b']).toContain(variantChar);
    });

    it('should generate multiple unique UUIDs', () => {
      // Arrange
      const uuids = new Set<string>();
      const count = 100;

      // Act
      for (let i = 0; i < count; i++) {
        const uuid = Uuid.generate();
        uuids.add(uuid.value);
      }

      // Assert
      expect(uuids.size).toBe(count); // All should be unique
    });
  });

  describe('when using Uuid accessors', () => {
    it('should return correct value through getter', () => {
      // Arrange
      const uuidString = '123e4567-e89b-12d3-a456-426614174000';
      const uuid = Uuid.create(uuidString).data!;

      // Act
      const value = uuid.value;

      // Assert
      expect(value).toBe(uuidString);
    });

    it('should return correct value through toString()', () => {
      // Arrange
      const uuidString = '123e4567-e89b-12d3-a456-426614174000';
      const uuid = Uuid.create(uuidString).data!;

      // Act
      const stringValue = uuid.toString();

      // Assert
      expect(stringValue).toBe(uuidString);
    });

    it('should have consistent value and toString()', () => {
      // Arrange
      const uuidString = 'a1b2c3d4-e5f6-4789-a012-b3c4d5e6f789';
      const uuid = Uuid.create(uuidString).data!;

      // Act & Assert
      expect(uuid.value).toBe(uuid.toString());
    });
  });

  describe('when serializing Uuid to JSON', () => {
    it('should serialize Uuid to JSON object', () => {
      // Arrange
      const uuidString = '123e4567-e89b-12d3-a456-426614174000';
      const uuid = Uuid.create(uuidString).data!;

      // Act
      const json = uuid.toJSON();

      // Assert
      expect(json).toEqual({
        value: uuidString
      });
    });

    it('should serialize generated Uuid to JSON', () => {
      // Arrange
      const uuid = Uuid.generate();

      // Act
      const json = uuid.toJSON();

      // Assert
      expect(json.value).toBeDefined();
      expect(typeof json.value).toBe('string');
      expect(json.value).toBe(uuid.value);
    });

    it('should create Uuid from JSON object', () => {
      // Arrange
      const uuidString = 'a1b2c3d4-e5f6-4789-a012-b3c4d5e6f789';
      const json = { value: uuidString };

      // Act
      const result = Uuid.fromJSON(json);

      // Assert
      expect(result.hasData).toBe(true);
      const uuid = result.data!;
      expect(uuid.value).toBe(uuidString);
    });

    it('should handle round-trip serialization', () => {
      // Arrange
      const originalUuid = Uuid.generate();

      // Act
      const json = originalUuid.toJSON();
      const reconstructedResult = Uuid.fromJSON(json);

      // Assert
      expect(reconstructedResult.hasData).toBe(true);
      const reconstructedUuid = reconstructedResult.data!;
      expect(reconstructedUuid.value).toBe(originalUuid.value);
    });

    it('should return error when creating from invalid JSON', () => {
      // Arrange
      const invalidJson = { value: 'invalid-uuid-format' };

      // Act
      const result = Uuid.fromJSON(invalidJson);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toEqual(['Invalid UUID format']);
    });
  });

  describe('when working with Uuid instances', () => {
    it('should maintain immutability through public interface', () => {
      // Arrange
      const uuidString = '123e4567-e89b-12d3-a456-426614174000';
      const uuid = Uuid.create(uuidString).data!;
      const originalValue = uuid.value;

      // Act - Value should be accessible but not modifiable through public interface
      // TypeScript compiler prevents direct modification of readonly properties
      const accessedValue = uuid.value;

      // Assert
      expect(accessedValue).toBe(originalValue);
      expect(uuid.value).toBe(uuidString);

      // Value should be the same on multiple accesses
      expect(uuid.value).toBe(uuid.value);
    });

    it('should work as object key', () => {
      // Arrange
      const uuid1 = Uuid.generate();
      const uuid2 = Uuid.generate();
      const map = new Map<string, string>();

      // Act
      map.set(uuid1.value, 'value1');
      map.set(uuid2.value, 'value2');

      // Assert
      expect(map.get(uuid1.value)).toBe('value1');
      expect(map.get(uuid2.value)).toBe('value2');
      expect(map.size).toBe(2);
    });

    it('should be comparable by value', () => {
      // Arrange
      const uuidString = '123e4567-e89b-12d3-a456-426614174000';
      const uuid1 = Uuid.create(uuidString).data!;
      const uuid2 = Uuid.create(uuidString).data!;

      // Act & Assert
      expect(uuid1.value).toBe(uuid2.value); // Same value
      expect(uuid1).not.toBe(uuid2); // Different instances
    });
  });

  describe('edge cases and boundary conditions', () => {
    it('should handle UUID with all zeros', () => {
      // Arrange
      const zeroUuid = '00000000-0000-4000-8000-000000000000';

      // Act
      const result = Uuid.create(zeroUuid);

      // Assert
      expect(result.hasData).toBe(true);
      const uuid = result.data!;
      expect(uuid.value).toBe(zeroUuid);
    });

    it('should handle UUID with all fs', () => {
      // Arrange
      const maxUuid = 'ffffffff-ffff-4fff-bfff-ffffffffffff';

      // Act
      const result = Uuid.create(maxUuid);

      // Assert
      expect(result.hasData).toBe(true);
      const uuid = result.data!;
      expect(uuid.value).toBe(maxUuid);
    });

    it('should reject UUID with version 6', () => {
      // Arrange
      const version6Uuid = '123e4567-e89b-62d3-a456-426614174000';

      // Act
      const result = Uuid.create(version6Uuid);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toEqual(['Invalid UUID format']);
    });

    it('should handle very long string input', () => {
      // Arrange
      const veryLongString = 'a'.repeat(1000);

      // Act
      const result = Uuid.create(veryLongString);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toEqual(['Invalid UUID format']);
    });

    it('should handle string with special characters', () => {
      // Arrange
      const specialCharsString = '!@#$%^&*()-=+[]{}|;:,.<>?';

      // Act
      const result = Uuid.create(specialCharsString);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toEqual(['Invalid UUID format']);
    });
  });
});