import { AuthAPI } from '@/services/auth';

describe('AuthService', () => {
  describe('validateEmail', () => {
    it('should validate correct email format', () => {
      expect(AuthAPI.validateEmail('test@example.com')).toBe(true);
      expect(AuthAPI.validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email format', () => {
      expect(AuthAPI.validateEmail('invalid')).toBe(false);
      expect(AuthAPI.validateEmail('test@')).toBe(false);
      expect(AuthAPI.validateEmail('@example.com')).toBe(false);
      expect(AuthAPI.validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should accept strong passwords', () => {
      const result = AuthAPI.validatePassword('StrongPass123');
      expect(result.valid).toBe(true);
      expect(result.message).toBeUndefined();
    });

    it('should reject short passwords', () => {
      const result = AuthAPI.validatePassword('Short1');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('at least 8 characters');
    });

    it('should require uppercase letter', () => {
      const result = AuthAPI.validatePassword('weakpass123');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('uppercase');
    });

    it('should require lowercase letter', () => {
      const result = AuthAPI.validatePassword('STRONGPASS123');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('lowercase');
    });

    it('should require number', () => {
      const result = AuthAPI.validatePassword('StrongPass');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('number');
    });
  });

  describe('signUp', () => {
    it('should successfully sign up with valid data', async () => {
      const result = await AuthAPI.signUp({
        name: 'Test User',
        email: 'test@example.com',
        password: 'StrongPass123',
      });

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
    });
  });

  describe('signIn', () => {
    it('should successfully sign in with credentials', async () => {
      const result = await AuthAPI.signIn({
        email: 'test@example.com',
        password: 'StrongPass123',
      });

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
    });
  });
});
