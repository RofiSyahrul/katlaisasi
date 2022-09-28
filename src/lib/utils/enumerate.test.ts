import { describe, expect, it } from 'vitest';

import { enumerate } from './enumerate';

describe('Test enumerate function', () => {
  it('should return empty string if there is no value', () => {
    expect(enumerate()).toBe('');
  });

  it('should return the string if there is only one value', () => {
    expect(enumerate('foo')).toBe('foo');
    expect(enumerate(1)).toBe('1');
    expect(enumerate(Symbol())).toBe('Symbol()');
  });

  it('should return string with " dan " separator if there is two values', () => {
    expect(enumerate('foo', 'bar')).toBe('foo dan bar');
    expect(enumerate(1, 2)).toBe('1 dan 2');
    expect(enumerate(Symbol('a'), Symbol('b'))).toBe('Symbol(a) dan Symbol(b)');
  });

  it('should return string with "str1, str2, str3 ... dan strN" format if there is more than two values', () => {
    expect(enumerate('foo', 'bar', 'baz')).toBe('foo, bar dan baz');
    expect(enumerate('typescript', 'javascript', 'html', 'css')).toBe(
      'typescript, javascript, html dan css'
    );
  });
});
