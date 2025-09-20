import { Email } from './email';

describe('Email', () => {
  describe('when creating Email from valid string', () => {
    it('should create Email with valid email address', () => {
      // Arrange
      const validEmail = 'user@example.com';

      // Act
      const result = Email.create(validEmail);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.hasError).toBe(false);
      const email = result.data!;
      expect(email.value).toBe('user@example.com');
      expect(email.toString()).toBe('user@example.com');
    });

    it('should create Email with uppercase letters and normalize to lowercase', () => {
      // Arrange
      const uppercaseEmail = 'USER@EXAMPLE.COM';

      // Act
      const result = Email.create(uppercaseEmail);

      // Assert
      expect(result.hasData).toBe(true);
      const email = result.data!;
      expect(email.value).toBe('user@example.com'); // Should be normalized to lowercase
    });

    it('should create Email with mixed case and normalize to lowercase', () => {
      // Arrange
      const mixedCaseEmail = 'User@Example.Com';

      // Act
      const result = Email.create(mixedCaseEmail);

      // Assert
      expect(result.hasData).toBe(true);
      const email = result.data!;
      expect(email.value).toBe('user@example.com');
    });

    it('should create Email with numbers in local part', () => {
      // Arrange
      const emailWithNumbers = 'user123@example.com';

      // Act
      const result = Email.create(emailWithNumbers);

      // Assert
      expect(result.hasData).toBe(true);
      const email = result.data!;
      expect(email.value).toBe('user123@example.com');
    });

    it('should create Email with numbers in domain', () => {
      // Arrange
      const emailWithDomainNumbers = 'user@example123.com';

      // Act
      const result = Email.create(emailWithDomainNumbers);

      // Assert
      expect(result.hasData).toBe(true);
      const email = result.data!;
      expect(email.value).toBe('user@example123.com');
    });

    it('should create Email with dots in local part', () => {
      // Arrange
      const emailWithDots = 'first.last@example.com';

      // Act
      const result = Email.create(emailWithDots);

      // Assert
      expect(result.hasData).toBe(true);
      const email = result.data!;
      expect(email.value).toBe('first.last@example.com');
    });

    it('should create Email with plus sign in local part', () => {
      // Arrange
      const emailWithPlus = 'user+tag@example.com';

      // Act
      const result = Email.create(emailWithPlus);

      // Assert
      expect(result.hasData).toBe(true);
      const email = result.data!;
      expect(email.value).toBe('user+tag@example.com');
    });

    it('should create Email with hyphen in domain', () => {
      // Arrange
      const emailWithHyphen = 'user@my-domain.com';

      // Act
      const result = Email.create(emailWithHyphen);

      // Assert
      expect(result.hasData).toBe(true);
      const email = result.data!;
      expect(email.value).toBe('user@my-domain.com');
    });

    it('should create Email with subdomain', () => {
      // Arrange
      const emailWithSubdomain = 'user@mail.example.com';

      // Act
      const result = Email.create(emailWithSubdomain);

      // Assert
      expect(result.hasData).toBe(true);
      const email = result.data!;
      expect(email.value).toBe('user@mail.example.com');
    });

    it('should create Email with country code TLD', () => {
      // Arrange
      const emailWithCountryTLD = 'user@example.co.uk';

      // Act
      const result = Email.create(emailWithCountryTLD);

      // Assert
      expect(result.hasData).toBe(true);
      const email = result.data!;
      expect(email.value).toBe('user@example.co.uk');
    });

    it('should create Email and trim whitespace', () => {
      // Arrange
      const emailWithWhitespace = '  user@example.com  ';

      // Act
      const result = Email.create(emailWithWhitespace);

      // Assert
      expect(result.hasData).toBe(true);
      const email = result.data!;
      expect(email.value).toBe('user@example.com'); // Should be trimmed
    });
  });

  describe('when creating Email with invalid input', () => {
    it('should return error when input is not a string', () => {
      // Arrange
      const invalidInput = 123 as any;

      // Act
      const result = Email.create(invalidInput);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toEqual(['Email must be a string']);
      expect(result.data).toBeNull();
    });

    it('should return error when input is null', () => {
      // Arrange
      const nullInput = null as any;

      // Act
      const result = Email.create(nullInput);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toEqual(['Email must be a string']);
    });

    it('should return error when input is undefined', () => {
      // Arrange
      const undefinedInput = undefined as any;

      // Act
      const result = Email.create(undefinedInput);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toEqual(['Email must be a string']);
    });

    it('should return error when input is empty string', () => {
      // Arrange
      const emptyString = '';

      // Act
      const result = Email.create(emptyString);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toEqual(['Email cannot be empty']);
    });

    it('should return error when input is only whitespace', () => {
      // Arrange
      const whitespaceOnly = '   ';

      // Act
      const result = Email.create(whitespaceOnly);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toEqual(['Email cannot be empty']);
    });

    it('should return error when email format is invalid - missing @', () => {
      // Arrange
      const noAtSign = 'userexample.com';

      // Act
      const result = Email.create(noAtSign);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toEqual(['Invalid email format']);
    });

    it('should return error when email format is invalid - multiple @', () => {
      // Arrange
      const multipleAtSigns = 'user@@example.com';

      // Act
      const result = Email.create(multipleAtSigns);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toEqual(['Invalid email format']);
    });

    it('should return error when email format is invalid - missing local part', () => {
      // Arrange
      const missingLocalPart = '@example.com';

      // Act
      const result = Email.create(missingLocalPart);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toEqual(['Invalid email format']);
    });

    it('should return error when email format is invalid - missing domain', () => {
      // Arrange
      const missingDomain = 'user@';

      // Act
      const result = Email.create(missingDomain);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toEqual(['Invalid email format']);
    });

    it('should return error when email format is invalid - missing TLD', () => {
      // Arrange
      const missingTLD = 'user@example';

      // Act
      const result = Email.create(missingTLD);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toEqual(['Invalid email format']);
    });

    it('should return error when email format is invalid - spaces in email', () => {
      // Arrange
      const spacesInEmail = 'user name@example.com';

      // Act
      const result = Email.create(spacesInEmail);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toEqual(['Invalid email format']);
    });

    it('should return error when email format is invalid - spaces in domain', () => {
      // Arrange
      const spacesInDomain = 'user@exam ple.com';

      // Act
      const result = Email.create(spacesInDomain);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toEqual(['Invalid email format']);
    });

    it('should return error when email starts with @', () => {
      // Arrange
      const startsWithAt = '@user@example.com';

      // Act
      const result = Email.create(startsWithAt);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toEqual(['Invalid email format']);
    });

    it('should return error when email ends with @', () => {
      // Arrange
      const endsWithAt = 'user@example.com@';

      // Act
      const result = Email.create(endsWithAt);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toEqual(['Invalid email format']);
    });

    it('should return error when domain has no TLD', () => {
      // Arrange
      const noTLD = 'user@localhost';

      // Act
      const result = Email.create(noTLD);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toEqual(['Invalid email format']);
    });

    it('should return error when email is just random text', () => {
      // Arrange
      const randomText = 'this is not an email';

      // Act
      const result = Email.create(randomText);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toEqual(['Invalid email format']);
    });
  });

  describe('when using Email accessors', () => {
    it('should return correct value through getter', () => {
      // Arrange
      const emailString = 'user@example.com';
      const email = Email.create(emailString).data!;

      // Act
      const value = email.value;

      // Assert
      expect(value).toBe('user@example.com');
    });

    it('should return correct value through toString()', () => {
      // Arrange
      const emailString = 'user@example.com';
      const email = Email.create(emailString).data!;

      // Act
      const stringValue = email.toString();

      // Assert
      expect(stringValue).toBe('user@example.com');
    });

    it('should have consistent value and toString()', () => {
      // Arrange
      const emailString = 'test@domain.org';
      const email = Email.create(emailString).data!;

      // Act & Assert
      expect(email.value).toBe(email.toString());
    });

    it('should return normalized value through accessors', () => {
      // Arrange
      const uppercaseEmail = 'USER@EXAMPLE.COM';
      const email = Email.create(uppercaseEmail).data!;

      // Act & Assert
      expect(email.value).toBe('user@example.com');
      expect(email.toString()).toBe('user@example.com');
      expect(email.value).toBe(email.toString());
    });
  });

  describe('when serializing Email to JSON', () => {
    it('should serialize Email to JSON object', () => {
      // Arrange
      const emailString = 'user@example.com';
      const email = Email.create(emailString).data!;

      // Act
      const json = email.toJSON();

      // Assert
      expect(json).toEqual({
        value: 'user@example.com'
      });
    });

    it('should serialize normalized Email to JSON', () => {
      // Arrange
      const uppercaseEmail = 'USER@EXAMPLE.COM';
      const email = Email.create(uppercaseEmail).data!;

      // Act
      const json = email.toJSON();

      // Assert
      expect(json).toEqual({
        value: 'user@example.com' // Should be normalized
      });
    });

    it('should create Email from JSON object', () => {
      // Arrange
      const emailString = 'test@domain.org';
      const json = { value: emailString };

      // Act
      const result = Email.fromJSON(json);

      // Assert
      expect(result.hasData).toBe(true);
      const email = result.data!;
      expect(email.value).toBe('test@domain.org');
    });

    it('should handle round-trip serialization', () => {
      // Arrange
      const originalEmailString = 'user@example.com';
      const originalEmail = Email.create(originalEmailString).data!;

      // Act
      const json = originalEmail.toJSON();
      const reconstructedResult = Email.fromJSON(json);

      // Assert
      expect(reconstructedResult.hasData).toBe(true);
      const reconstructedEmail = reconstructedResult.data!;
      expect(reconstructedEmail.value).toBe(originalEmail.value);
    });

    it('should handle round-trip serialization with normalization', () => {
      // Arrange
      const uppercaseEmail = 'USER@EXAMPLE.COM';
      const originalEmail = Email.create(uppercaseEmail).data!;

      // Act
      const json = originalEmail.toJSON();
      const reconstructedResult = Email.fromJSON(json);

      // Assert
      expect(reconstructedResult.hasData).toBe(true);
      const reconstructedEmail = reconstructedResult.data!;
      expect(reconstructedEmail.value).toBe('user@example.com');
      expect(reconstructedEmail.value).toBe(originalEmail.value);
    });

    it('should return error when creating from invalid JSON', () => {
      // Arrange
      const invalidJson = { value: 'invalid-email-format' };

      // Act
      const result = Email.fromJSON(invalidJson);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toEqual(['Invalid email format']);
    });
  });

  describe('when working with Email instances', () => {
    it('should maintain immutability through public interface', () => {
      // Arrange
      const emailString = 'user@example.com';
      const email = Email.create(emailString).data!;
      const originalValue = email.value;

      // Act - Value should be accessible but not modifiable through public interface
      // TypeScript compiler prevents direct modification of readonly properties
      const accessedValue = email.value;

      // Assert
      expect(accessedValue).toBe(originalValue);
      expect(email.value).toBe('user@example.com');

      // Value should be the same on multiple accesses
      expect(email.value).toBe(email.value);
    });

    it('should work as object key', () => {
      // Arrange
      const email1 = Email.create('user1@example.com').data!;
      const email2 = Email.create('user2@example.com').data!;
      const map = new Map<string, string>();

      // Act
      map.set(email1.value, 'value1');
      map.set(email2.value, 'value2');

      // Assert
      expect(map.get(email1.value)).toBe('value1');
      expect(map.get(email2.value)).toBe('value2');
      expect(map.size).toBe(2);
    });

    it('should be comparable by value', () => {
      // Arrange
      const emailString = 'user@example.com';
      const email1 = Email.create(emailString).data!;
      const email2 = Email.create(emailString).data!;

      // Act & Assert
      expect(email1.value).toBe(email2.value); // Same value
      expect(email1).not.toBe(email2); // Different instances
    });

    it('should normalize different case inputs to same value', () => {
      // Arrange
      const lowercaseEmail = Email.create('user@example.com').data!;
      const uppercaseEmail = Email.create('USER@EXAMPLE.COM').data!;
      const mixedCaseEmail = Email.create('User@Example.Com').data!;

      // Act & Assert
      expect(lowercaseEmail.value).toBe('user@example.com');
      expect(uppercaseEmail.value).toBe('user@example.com');
      expect(mixedCaseEmail.value).toBe('user@example.com');

      // All should have the same normalized value
      expect(lowercaseEmail.value).toBe(uppercaseEmail.value);
      expect(uppercaseEmail.value).toBe(mixedCaseEmail.value);
    });
  });

  describe('edge cases and boundary conditions', () => {
    it('should handle very long email addresses', () => {
      // Arrange
      const longLocalPart = 'a'.repeat(60);
      const longDomain = 'b'.repeat(60);
      const longEmail = `${longLocalPart}@${longDomain}.com`;

      // Act
      const result = Email.create(longEmail);

      // Assert
      expect(result.hasData).toBe(true);
      const email = result.data!;
      expect(email.value).toBe(longEmail.toLowerCase());
    });

    it('should handle minimum valid email', () => {
      // Arrange
      const minimalEmail = 'a@b.c';

      // Act
      const result = Email.create(minimalEmail);

      // Assert
      expect(result.hasData).toBe(true);
      const email = result.data!;
      expect(email.value).toBe('a@b.c');
    });

    it('should handle email with multiple dots in domain', () => {
      // Arrange
      const multiDotDomain = 'user@mail.subdomain.example.com';

      // Act
      const result = Email.create(multiDotDomain);

      // Assert
      expect(result.hasData).toBe(true);
      const email = result.data!;
      expect(email.value).toBe('user@mail.subdomain.example.com');
    });

    it('should handle email with underscores', () => {
      // Arrange
      const emailWithUnderscores = 'user_name@example_domain.com';

      // Act
      const result = Email.create(emailWithUnderscores);

      // Assert
      expect(result.hasData).toBe(true);
      const email = result.data!;
      expect(email.value).toBe('user_name@example_domain.com');
    });

    it('should accept email with consecutive dots in local part', () => {
      // Arrange
      const consecutiveDots = 'user..name@example.com';

      // Act
      const result = Email.create(consecutiveDots);

      // Assert
      expect(result.hasData).toBe(true);
      const email = result.data!;
      expect(email.value).toBe('user..name@example.com');
    });

    it('should accept email starting with dot in local part', () => {
      // Arrange
      const startingDot = '.user@example.com';

      // Act
      const result = Email.create(startingDot);

      // Assert
      expect(result.hasData).toBe(true);
      const email = result.data!;
      expect(email.value).toBe('.user@example.com');
    });

    it('should accept email ending with dot in local part', () => {
      // Arrange
      const endingDot = 'user.@example.com';

      // Act
      const result = Email.create(endingDot);

      // Assert
      expect(result.hasData).toBe(true);
      const email = result.data!;
      expect(email.value).toBe('user.@example.com');
    });

    it('should handle tabs and newlines in input (should be rejected)', () => {
      // Arrange
      const emailWithTabs = 'user\t@example.com';
      const emailWithNewlines = 'user\n@example.com';

      // Act
      const tabResult = Email.create(emailWithTabs);
      const newlineResult = Email.create(emailWithNewlines);

      // Assert
      expect(tabResult.hasError).toBe(true);
      expect(tabResult.errors).toEqual(['Invalid email format']);
      expect(newlineResult.hasError).toBe(true);
      expect(newlineResult.errors).toEqual(['Invalid email format']);
    });
  });
});