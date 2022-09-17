import { describe, expect, it } from 'vitest';

import { decode, encode } from './codec.server';

describe('Test codec utils', () => {
  it('should encode empty string to be "0"', () => {
    expect(encode('')).toBe('0');
  });

  it('should decode "0" to empty string', () => {
    expect(decode('0')).toBe('');
  });

  it('should decode encoded value to its original value', () => {
    expect(decode(encode('oRIGinal valUE'))).toBe('oRIGinal valUE');
  });

  it('should use cache for subsequent encoding and decoding of same value', () => {
    expect(decode(encode('value'))).toBe('value');
    expect(decode(encode('value'))).toBe('value');
  });
});
