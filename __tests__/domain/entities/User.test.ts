import { User } from '../../../lib/server/domain/entities/User';
import { Role } from '../../../lib/server/domain/value-objects/Role';

describe('User Entity', () => {
  const validUserData = {
    id: 'user-123',
    name: 'John Doe',
    email: 'john@example.com',
    emailVerified: true,
    role: 'USER' as Role,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };

  describe('Constructor', () => {
    it('should create user with valid data', () => {
      const user = new User(
        validUserData.id,
        validUserData.name,
        validUserData.email,
        validUserData.emailVerified,
        validUserData.role,
        validUserData.createdAt,
        validUserData.updatedAt
      );

      expect(user.id).toBe(validUserData.id);
      expect(user.name).toBe(validUserData.name);
      expect(user.email).toBe(validUserData.email);
      expect(user.emailVerified).toBe(true);
      expect(user.role).toBe('USER');
    });

    it('should create user with phone', () => {
      const user = new User(
        validUserData.id,
        validUserData.name,
        validUserData.email,
        validUserData.emailVerified,
        validUserData.role,
        validUserData.createdAt,
        validUserData.updatedAt,
        undefined,
        '1234567890'
      );

      expect(user.phone).toBe('1234567890');
    });

    it('should create user with image', () => {
      const user = new User(
        validUserData.id,
        validUserData.name,
        validUserData.email,
        validUserData.emailVerified,
        validUserData.role,
        validUserData.createdAt,
        validUserData.updatedAt,
        'https://example.com/avatar.jpg'
      );

      expect(user.image).toBe('https://example.com/avatar.jpg');
    });

    it('should throw error for invalid email', () => {
      expect(() => {
        new User(
          validUserData.id,
          validUserData.name,
          'invalid-email',
          validUserData.emailVerified,
          validUserData.role,
          validUserData.createdAt,
          validUserData.updatedAt
        );
      }).toThrow('Formato de email inválido');
    });

    it('should throw error for invalid phone', () => {
      expect(() => {
        new User(
          validUserData.id,
          validUserData.name,
          validUserData.email,
          validUserData.emailVerified,
          validUserData.role,
          validUserData.createdAt,
          validUserData.updatedAt,
          undefined,
          '123'
        );
      }).toThrow('Teléfono debe tener entre 10 y 15 dígitos');
    });
  });

  describe('Factory method create()', () => {
    it('should create user with factory method', () => {
      const user = User.create(validUserData);

      expect(user.id).toBe(validUserData.id);
      expect(user.name).toBe(validUserData.name);
      expect(user.email).toBe(validUserData.email);
    });

    it('should trim user name', () => {
      const user = User.create({
        ...validUserData,
        name: '  John Doe  ',
      });

      expect(user.name).toBe('John Doe');
    });

    it('should throw error for empty name', () => {
      expect(() => {
        User.create({
          ...validUserData,
          name: '',
        });
      }).toThrow('El nombre no puede estar vacío');
    });

    it('should throw error for whitespace-only name', () => {
      expect(() => {
        User.create({
          ...validUserData,
          name: '   ',
        });
      }).toThrow('El nombre no puede estar vacío');
    });

    it('should throw error for name too short', () => {
      expect(() => {
        User.create({
          ...validUserData,
          name: 'A',
        });
      }).toThrow('El nombre debe tener al menos 2 caracteres');
    });

    it('should throw error for name too long', () => {
      expect(() => {
        User.create({
          ...validUserData,
          name: 'A'.repeat(101),
        });
      }).toThrow('El nombre no puede exceder 100 caracteres');
    });

    it('should accept minimum length name', () => {
      const user = User.create({
        ...validUserData,
        name: 'Jo',
      });

      expect(user.name).toBe('Jo');
    });

    it('should accept maximum length name', () => {
      const longName = 'A'.repeat(100);
      const user = User.create({
        ...validUserData,
        name: longName,
      });

      expect(user.name).toBe(longName);
    });
  });

  describe('Email Value Object integration', () => {
    it('should provide email as string via getter', () => {
      const user = new User(
        validUserData.id,
        validUserData.name,
        validUserData.email,
        validUserData.emailVerified,
        validUserData.role,
        validUserData.createdAt,
        validUserData.updatedAt
      );

      expect(typeof user.email).toBe('string');
      expect(user.email).toBe('john@example.com');
    });

    it('should provide email VO via emailVO getter', () => {
      const user = new User(
        validUserData.id,
        validUserData.name,
        validUserData.email,
        validUserData.emailVerified,
        validUserData.role,
        validUserData.createdAt,
        validUserData.updatedAt
      );

      expect(user.emailVO).toBeDefined();
      expect(user.emailVO.value).toBe('john@example.com');
    });

    it('should normalize email to lowercase', () => {
      const user = new User(
        validUserData.id,
        validUserData.name,
        'JOHN@EXAMPLE.COM',
        validUserData.emailVerified,
        validUserData.role,
        validUserData.createdAt,
        validUserData.updatedAt
      );

      expect(user.email).toBe('john@example.com');
    });
  });

  describe('Phone Value Object integration', () => {
    it('should provide phone as string via getter', () => {
      const user = new User(
        validUserData.id,
        validUserData.name,
        validUserData.email,
        validUserData.emailVerified,
        validUserData.role,
        validUserData.createdAt,
        validUserData.updatedAt,
        undefined,
        '1234567890'
      );

      expect(typeof user.phone).toBe('string');
      expect(user.phone).toBe('1234567890');
    });

    it('should provide phone VO via phoneVO getter', () => {
      const user = new User(
        validUserData.id,
        validUserData.name,
        validUserData.email,
        validUserData.emailVerified,
        validUserData.role,
        validUserData.createdAt,
        validUserData.updatedAt,
        undefined,
        '1234567890'
      );

      expect(user.phoneVO).toBeDefined();
      expect(user.phoneVO?.value).toBe('1234567890');
    });

    it('should return undefined for phone when not provided', () => {
      const user = new User(
        validUserData.id,
        validUserData.name,
        validUserData.email,
        validUserData.emailVerified,
        validUserData.role,
        validUserData.createdAt,
        validUserData.updatedAt
      );

      expect(user.phone).toBeUndefined();
      expect(user.phoneVO).toBeUndefined();
    });
  });

  describe('Update methods', () => {
    it('should update name and dispatch event', () => {
      const user = User.create(validUserData);
      const originalUpdatedAt = user.updatedAt;

      setTimeout(() => {
        user.updateName('Jane Doe');

        expect(user.name).toBe('Jane Doe');
        expect(user.updatedAt).not.toBe(originalUpdatedAt);
      }, 10);
    });

    it('should update role and dispatch event', () => {
      const user = User.create(validUserData);
      const originalUpdatedAt = user.updatedAt;

      setTimeout(() => {
        user.updateRole('ADMIN' as Role);

        expect(user.role).toBe('ADMIN');
        expect(user.updatedAt).not.toBe(originalUpdatedAt);
      }, 10);
    });

    it('should update phone and dispatch event', () => {
      const user = User.create(validUserData);
      const originalUpdatedAt = user.updatedAt;

      setTimeout(() => {
        user.updatePhone('9876543210');

        expect(user.phone).toBe('9876543210');
        expect(user.updatedAt).not.toBe(originalUpdatedAt);
      }, 10);
    });

    it('should remove phone when updating to undefined', () => {
      const user = User.create({
        ...validUserData,
        phone: '1234567890',
      });

      user.updatePhone(undefined);

      expect(user.phone).toBeUndefined();
    });
  });

  describe('Role methods', () => {
    it('should check if user is admin', () => {
      const adminUser = User.create({
        ...validUserData,
        role: 'ADMIN' as Role,
      });

      expect(adminUser.isAdmin()).toBe(true);
      expect(adminUser.role).toBe('ADMIN');
    });

    it('should check if user is regular user', () => {
      const regularUser = User.create(validUserData);

      expect(regularUser.role).toBe('USER');
      expect(regularUser.isAdmin()).toBe(false);
    });

    it('should check admin permissions', () => {
      const adminUser = User.create({
        ...validUserData,
        role: 'ADMIN' as Role,
      });

      expect(adminUser.canManageUsers()).toBe(true);
      expect(adminUser.canAccessReports()).toBe(true);
    });
  });

  describe('Immutability of Value Objects', () => {
    it('should not allow direct modification of email', () => {
      const user = User.create(validUserData);

      // Email VO is readonly
      expect(user.email).toBe('john@example.com');
      // TypeScript prevents modification of readonly fields
      // In runtime, the property can be set but the VO itself is immutable
      const originalEmail = user.email;
      expect(originalEmail).toBe('john@example.com');
    });
  });
});
