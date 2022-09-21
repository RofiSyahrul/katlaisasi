import { describe, expect, it } from 'vitest';

import { isUserNameValid } from './user-name';

describe('Test user-name utils', () => {
  describe('Test isUserNameValid function', () => {
    it('should be valid user name with only alphabet and/or space', () => {
      expect(isUserNameValid('turu')).toBe(true);
      expect(isUserNameValid('Orang Tampan')).toBe(true);
    });

    it('should be invalid user name with empty string', () => {
      expect(isUserNameValid('')).toBe(false);
    });

    it('should be invalid user name with only one character', () => {
      expect(isUserNameValid('a')).toBe(false);
    });

    it('should be invalid user name with one or more spaces only', () => {
      expect(isUserNameValid(' ')).toBe(false);
      expect(isUserNameValid('        ')).toBe(false);
    });

    it('should be invalid user name with one or more leading spaces', () => {
      expect(isUserNameValid(' test')).toBe(false);
      expect(isUserNameValid('  user')).toBe(false);
    });

    it('should be invalid user name with one or more trailing spaces', () => {
      expect(isUserNameValid('test ')).toBe(false);
      expect(isUserNameValid('user  ')).toBe(false);
    });

    it('should be invalid user name that has character(s) other than alphabet or space', () => {
      expect(isUserNameValid('test123')).toBe(false);
      expect(isUserNameValid('siapa?')).toBe(false);
    });

    it('should be invalid user name that has more than 20 characters', () => {
      expect(isUserNameValid('abcdefgh ijklmn opqrstu')).toBe(false);
    });
  });
});
