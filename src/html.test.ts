import test from 'tape';
import { htmlAttributeNameRegex, htmlEsc, htmlTagNameRegex } from './html.js';

test('removes unsafe characters', async (t) => {
	t.notOk(htmlEsc('< << <<< Hello<World').includes('<'));
	t.notOk(htmlEsc('> >> >>> Hello>World').includes('>'));
	t.notOk(htmlEsc("' '' ''' Hello'World").includes("'"));
	t.notOk(htmlEsc('" "" """ Hello"World').includes('"'));
	t.doesNotMatch('& && &&& Hello&World', /&\S+;/);
});

test('replaces unsafe characters with correct entity', async (t) => {
	t.equal(htmlEsc('"'), '&#34;');
	t.equal(htmlEsc('&'), '&#38;');
	t.equal(htmlEsc("'"), '&#39;');
	t.equal(htmlEsc('<'), '&#60;');
	t.equal(htmlEsc('>'), '&#62;');
});

test('regex matches only valid tag names', async (t) => {
	t.ok(htmlTagNameRegex.test('a'));
	t.ok(htmlTagNameRegex.test('div'));
	t.ok(htmlTagNameRegex.test('custom-element'));
	t.ok(htmlTagNameRegex.test('this.that'));
	t.ok(htmlTagNameRegex.test('number1'));
	t.ok(htmlTagNameRegex.test('update:value'));
	t.ok(htmlTagNameRegex.test('åéîoü'));
	t.ok(htmlTagNameRegex.test('😄'));
	t.ok(htmlTagNameRegex.test('👨🏻‍🌾')); // zero width joiner
	t.ok(htmlTagNameRegex.test('🇦🇶')); // flag sequence
	t.ok(htmlTagNameRegex.test('a\u00B7')); // middle dot

	t.notOk(htmlTagNameRegex.test('div div'));
	t.notOk(htmlTagNameRegex.test('div>'));
	t.notOk(htmlTagNameRegex.test('div/'));
	t.notOk(htmlTagNameRegex.test('-div'));
	t.notOk(htmlTagNameRegex.test('.div'));
	t.notOk(htmlTagNameRegex.test('1number'));
	t.notOk(htmlTagNameRegex.test('a+b'));
	t.notOk(htmlTagNameRegex.test('a*b'));
	t.notOk(htmlTagNameRegex.test('\u007B')); // middle dot
	t.notOk(htmlTagNameRegex.test('\u00D7')); // multiplication sign
	t.notOk(htmlTagNameRegex.test('\u00F7')); // division sign
	t.notOk(htmlTagNameRegex.test('\u037E')); // greek question mark
});

test('regex matches only valid attribute names', async (t) => {
	t.ok(htmlAttributeNameRegex.test('q'));
	t.ok(htmlAttributeNameRegex.test('class'));
	t.ok(htmlAttributeNameRegex.test('aria-label'));
	t.ok(htmlAttributeNameRegex.test('data-1_2_3'));
	t.ok(htmlAttributeNameRegex.test('åéîoü'));
	t.ok(htmlAttributeNameRegex.test(':value'));
	t.ok(htmlAttributeNameRegex.test('😄'));
	t.ok(htmlAttributeNameRegex.test('👨🏻‍🌾')); // zero width joiner
	t.ok(htmlAttributeNameRegex.test('🇦🇶')); // flag sequence

	t.notOk(htmlAttributeNameRegex.test('aria label'));
	t.notOk(htmlAttributeNameRegex.test('class"'));
	t.notOk(htmlAttributeNameRegex.test("class'"));
	t.notOk(htmlAttributeNameRegex.test('class>'));
	t.notOk(htmlAttributeNameRegex.test('class/'));
	t.notOk(htmlAttributeNameRegex.test('class='));
	t.notOk(htmlAttributeNameRegex.test('\u0007')); // control char
	t.notOk(htmlAttributeNameRegex.test('\uFFFE')); // non-character
});
