import { expect } from 'chai';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';

import { determineRadix, parseNumber } from '../../parser';

vscode.window.showInformationMessage('Start all tests.');

describe('parser.ts', () => {
	it('parseNumber', () => {
		expect(parseNumber('0x1')).to.equal(1);
	});
	it('determineRadix', () => {
		expect(determineRadix('0x1')).to.equal(16);
		expect(determineRadix('0b1')).to.equal(2);
		expect(determineRadix('0o1')).to.equal(8);
		expect(determineRadix('100')).to.equal(10);
	});
	it('makeMarkdown', () => {
		expect(parseNumber('0x1')).to.equal(1);
	});
});
