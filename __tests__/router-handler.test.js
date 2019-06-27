'use strict';

const handle = require('../src/auth/router');

describe('Handle function', () => {
  it('should delete', () => {
    handle.handleDelete();
  });
});