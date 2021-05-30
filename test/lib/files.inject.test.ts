/* global beforeEach, afterEach */
import sinon from 'sinon';
import fs from 'fs';
import {inject} from '../../src/lib/files';
import {expect} from 'chai';

describe('lib/files.inject', () => {
  const content = 'import foo from \'bar\'';
  const dummyText = 'line 1\nline 2\nline 3\n';
  const targetPath = 'dummy';

  let readFileSyncStub: sinon.SinonStub;
  let writeFileSyncStub: sinon.SinonStub;

  beforeEach(() => {
    readFileSyncStub  = sinon.stub(fs, 'readFileSync').returns(dummyText);
    writeFileSyncStub = sinon.stub(fs, 'writeFileSync');
  });

  it('default - injects string at start of file', () => {
    const expectedOutput = `${content}\n${dummyText}`;

    inject(targetPath, content);

    expect(writeFileSyncStub.getCall(0).args[1]).equals(expectedOutput);
  });

  it('options - alternative encoding', () => {
    const options = {
      encoding: 'hex',
    };

    inject(targetPath, content, options);

    expect(readFileSyncStub.getCall(0).args[1]).to.include({encoding: options.encoding});
  });

  it('options - alternative numeric index', () => {
    const expectedOutput = `line 1\nline 2\n${content}\nline 3\n`;
    const options = {
      index: 2,
    };

    inject(targetPath, content, options);

    expect(writeFileSyncStub.getCall(0).args[1]).equals(expectedOutput);
  });

  it('options - alternative dynamic index', () => {
    const expectedOutput = `${dummyText}\n${content}`;
    const options = {
      index: (lines: string[]) => {
        return lines.length;
      },
    };

    inject(targetPath, content, options);

    expect(writeFileSyncStub.getCall(0).args[1]).equals(expectedOutput);
  });

  afterEach(() => {
    readFileSyncStub.restore();
    writeFileSyncStub.restore();
  });
});
