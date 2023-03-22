import sinon, { SinonStub } from 'sinon';
import { expect } from 'chai';

import { format } from 'node:util';
import { log } from '../../src/lib/stdout';

const { stdout } = process;

describe('lib/stdout.log', () => {
  let writeStub: SinonStub;

  beforeEach(() => {
    writeStub = sinon.stub(stdout, 'write');
  });

  it('default - prints an empty message', () => {
    log();
    expect(writeStub.lastCall.args).to.include('\n');
  });

  it('default - prints a string', () => {
    const message = 'my message';
    log(message);
    expect(writeStub.lastCall.args).to.include(`${message}\n`);
  });

  it('default - prints a not string', () => {
    const message = {
      key: 'value',
    };
    log(message);
    expect(writeStub.lastCall.args).to.include(`${format(message)}\n`);
  });

  afterEach(() => {
    writeStub.restore();
  });
});
