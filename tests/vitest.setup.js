import { expect, test, describe, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';

beforeEach(() => {
  const dom = new JSDOM();
  global.window = dom.window;
  global.document = dom.window.document;
});

