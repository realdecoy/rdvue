/* global beforeEach, afterEach */
import sinon from 'sinon';
import fs from 'node:fs';
import { expect } from 'chai';
import { Files } from '../../dist/modules';
import { readAndUpdateFeatureFiles } from '../../src/lib/files';

describe('lib/files.readAndUpdateFeatureFiles', () => {
  const matchRegex = '__VALUE__';
  const destDir = '';
  const dummyFile: { [key: string]: string } = {
    'file1.ts': `line 1\n${matchRegex}\nline 3\n`,
    'file2.ts': `${matchRegex}\nline 2\nline 3\n`,
    'file3.ts': `line 1\nline 2\n${matchRegex}\n`,
  };
  let readFileSyncStub: sinon.SinonStub;
  let writeFileSyncStub: sinon.SinonStub;

  beforeEach(() => {
    readFileSyncStub = sinon.stub(fs, 'readFileSync').callsFake(path => {
      return dummyFile[path.toString()];
    });
    writeFileSyncStub = sinon.stub(fs, 'writeFileSync');
  });

  it('reads and updates feature files', async () => {
    const kebabName = 'component-name';
    const templateVariableName = 'componentName';
    const pascalName = 'withPascalName';

    const files: Array<Files> = [
      {
        source: 'file1.ts',
        target: 'file1.ts',
        content: [{
          matchRegex,
          replace: 'withKebabName',
        }],
      },
      {
        source: 'file2.ts',
        target: 'file2.ts',
        content: [{
          matchRegex,
          // eslint-disable-next-line no-template-curly-in-string
          replace: '${withTemplateVariable}',
        }],
      },
      {
        source: 'file3.ts',
        target: 'file3.ts',
        content: [{
          matchRegex,
          replace: pascalName,
        }],
      },
    ];

    await readAndUpdateFeatureFiles(destDir, files, kebabName, templateVariableName);
    expect(writeFileSyncStub.calledWith(
      `${destDir}${files[0].target}`,
      `line 1\n${kebabName}\nline 3\n`,
    )).to.equal(true);
    expect(writeFileSyncStub.calledWith(
      `${destDir}${files[1].target}`,
      `${templateVariableName}\nline 2\nline 3\n`,
    )).to.equal(true);
    expect(writeFileSyncStub.calledWith(
      `${destDir}${files[2].target}`,
      `line 1\nline 2\n${pascalName}\n`,
    )).to.equal(true);
  });

  it('copies files?', async () => {
    const kebabName = 'component-name';
    const templateVariableName = 'componentName';

    const files: Array<Files> = [
      {
        source: 'file1.ts',
        target: 'file1.ts',
      },
    ];

    await readAndUpdateFeatureFiles(destDir, files, kebabName, templateVariableName);
  });

  afterEach(() => {
    readFileSyncStub.restore();
    writeFileSyncStub.restore();
  });
});
