import test from 'tape';
import { htmlEsc } from './html.js';

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
