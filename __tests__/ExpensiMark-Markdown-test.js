/* eslint-disable max-len */
import ExpensiMark from '../lib/ExpensiMark';

const parser = new ExpensiMark();

test('Test bold HTML replacement', () => {
    const boldTestStartString = 'This is a <strong>sentence,</strong> and it has some <strong>punctuation, words, and spaces</strong>. '
        + '<strong>test</strong> * testing* test*test*test. * testing * *testing * '
        + 'This is a <b>sentence,</b> and it has some <b>punctuation, words, and spaces</b>. '
        + '<b>test</b> * testing* test*test*test. * testing * *testing *';
    const boldTestReplacedString = 'This is a *sentence,* and it has some *punctuation, words, and spaces*. '
        + '*test* * testing* test*test*test. * testing * *testing * '
        + 'This is a *sentence,* and it has some *punctuation, words, and spaces*. '
        + '*test* * testing* test*test*test. * testing * *testing *';

    expect(parser.htmlToMarkdown(boldTestStartString)).toBe(boldTestReplacedString);
});

test('Test italic HTML replacement', () => {
    const italicTestStartString = 'This is a <em>sentence,</em> and it has some <em>punctuation, words, and spaces</em>. <em>test</em> _ testing_ test_test_test. _ test _ _test _ '
        + 'This is a <i>sentence,</i> and it has some <i>punctuation, words, and spaces</i>. <i>test</i> _ testing_ test_test_test. _ test _ _test _';
    const italicTestReplacedString = 'This is a _sentence,_ and it has some _punctuation, words, and spaces_. _test_ _ testing_ test_test_test. _ test _ _test _ '
        + 'This is a _sentence,_ and it has some _punctuation, words, and spaces_. _test_ _ testing_ test_test_test. _ test _ _test _';
    expect(parser.htmlToMarkdown(italicTestStartString)).toBe(italicTestReplacedString);
});

// Words wrapped in ~ successfully replaced with <del></del>
test('Test strikethrough HTML replacement', () => {
    const strikethroughTestStartString = 'This is a <del>sentence,</del> and it has some <del>punctuation, words, and spaces</del>. <del>test</del> ~ testing~ test~test~test. ~ testing ~ ~testing ~';
    const strikethroughTestReplacedString = 'This is a ~sentence,~ and it has some ~punctuation, words, and spaces~. ~test~ ~ testing~ test~test~test. ~ testing ~ ~testing ~';
    expect(parser.htmlToMarkdown(strikethroughTestStartString)).toBe(strikethroughTestReplacedString);
});

test('Test Mixed HTML strings', () => {
    const rawHTMLTestStartString = '<em>This is</em> a <strong>test</strong>. None of <h1>these strings</h1> should display <del>as</del> <div>HTML</div>.';
    const rawHTMLTestReplacedString = '_This is_ a *test*. None of these strings should display ~as~ HTML.';
    expect(parser.htmlToMarkdown(rawHTMLTestStartString)).toBe(rawHTMLTestReplacedString);
});

test('Test HTML string with <br/> tags to markdown ', () => {
    const testString = 'Hello<br/>World,<br/>Welcome<br/>To<br/>\nExpensify<br/>\n\nTwo new lines preceded by br';
    const resultString = 'Hello\nWorld,\nWelcome\nTo\nExpensify\n\nTwo new lines preceded by br';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test HTML string with inconsistent <br/> closing tags to markdown ', () => {
    const testString = 'Hello<br>World,<br/>Welcome<br>To<br/>Expensify';
    const resultString = 'Hello\nWorld,\nWelcome\nTo\nExpensify';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test HTML string with seperate closing tags (<br><br/>) to markdown ', () => {
    const testString = 'Hello<br>World,<br><br/>Welcome<br/>To<br/>Expensify';
    const resultString = 'Hello\nWorld,\nWelcome\nTo\nExpensify';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test HTML string with attributes', () => {
    const testString = '<em style="color:red;">This is</em><br style="border-color:red;"> a <button disabled>test</button>. None of <strong data-link=\'bad\'>these strings</strong>.';
    const resultString = '_This is_\n a test. None of *these strings*.';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test HTML string with spcial Tags', () => {
    const testString = '<html>\n<body>\n<!--StartFragment--><span style="color: rgb(0, 0, 0); font-family: &quot;Times New Roman&quot;; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">test message</span><!--EndFragment-->\n</body>\n</html>\n';
    const resultString = 'test message';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});


test('Test HTML string with Internal Tags', () => {
    const testString = `<style>
    span {
        color: rgb(0, 0, 0);
        font-family: "Times New Roman";
        font-size: medium;
        font-style: normal;
        font-variant-ligatures: normal;
        font-variant-caps: normal;
        font-weight: 400;
        letter-spacing: normal;
        orphans: 2;
        text-align: start;
        text-indent: 0px;
        text-transform: none;
        white-space: pre-wrap;
        widows: 2;
        word-spacing: 0px;
        -webkit-text-stroke-width: 0px;
        text-decoration-thickness: initial;
        text-decoration-style: initial;
        text-decoration-color: initial;
        display: inline !important;
        float: none;
    }
</style>
<script type="text/javascript">
    document.write('Hacked');
</script>
<p>test message</p>`;
    const resultString = 'test message';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test HTML string with encoded entities', () => {
    const testString = 'Text Entity &amp; &quot;';
    const resultString = 'Text Entity & "';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});


test('Test HTML string with blockquote', () => {
    const testString = '<blockquote><p>This GH seems to assume that there will be something in the paste\nbuffer when you copy block-quoted text out of slack. But when I dump\nsome <em>lorem ipsum</em> into a blockquote in Slack, copy it to the\nbuffer, then dump it into terminal, there\'s nothing. And if I dump it </blockquote>'
        + '<blockquote>line1\nline2\n\nsome <em>lorem ipsum</em> into a blockquote in Slack, copy it to the\n\n\nbuffer </blockquote>'
        + '<blockquote style="color:red;" data-label="note">line1 <em>lorem ipsum</em></blockquote>';

    const resultString = '\n> This GH seems to assume that there will be something in the paste\n> buffer when you copy block-quoted text out of slack. But when I dump\n> some _lorem ipsum_ into a blockquote in Slack, copy it to the\n> buffer, then dump it into terminal, there\'s nothing. And if I dump it\n'
        + '\n> line1\n> line2\n> \n> some _lorem ipsum_ into a blockquote in Slack, copy it to the\n> \n> \n> buffer\n'
        + '\n> line1 _lorem ipsum_\n';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test HTML string with InlineCodeBlock', () => {
    const testString = 'This is a <code>InlineCodeBlock</code> text';

    const resultString = 'This is a `InlineCodeBlock` text';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test wrapped anchor tags', () => {
    const wrappedUrlTestStartString = '<del><a href="https://www.example.com" target="_blank">https://www.example.com</a></del> <em><a href="http://www.test.com" target="_blank">http://www.test.com</a></em>'
        + ' <strong><a href="http://www.asdf.com/_test" target="_blank">http://www.asdf.com/_test</a></strong>';
    const wrappedUrlTestReplacedString = '~https://www.example.com~ _http://www.test.com_ *http://www.asdf.com/_test*';
    expect(parser.htmlToMarkdown(wrappedUrlTestStartString)).toBe(wrappedUrlTestReplacedString);
});

test('Test acnchor tags convesion to markdown style link with various styles', () => {
    const testString = 'Go to <del><a href="https://www.expensify.com" target="_blank">Expensify</a></del> '
        + '<em><a href="https://www.expensify.com" target="_blank">Expensify</a></em> '
        + '<strong><a href="https://www.expensify.com" target="_blank">Expensify</a></strong> '
        + '<a href="https://www.expensify.com" target="_blank">Expensify!</a> '
        + '<a href="https://www.expensify.com" target="_blank">Expensify?</a> '
        + '<a href="https://www.expensify-test.com" target="_blank">Expensify</a> '
        + '<a href="https://www.expensify.com/settings?param={%22section%22:%22account%22}" target="_blank">Expensify</a> '
        + '<a href="https://www.expensify.com/settings?param=(%22section%22+%22account%22)" target="_blank">Expensify</a> '
        + '<a href="https://www.expensify.com/settings?param=[%22section%22:%22account%22]" target="_blank">Expensify</a>';

    const resultString = 'Go to ~[Expensify](https://www.expensify.com)~ '
        + '_[Expensify](https://www.expensify.com)_ '
        + '*[Expensify](https://www.expensify.com)* '
        + '[Expensify!](https://www.expensify.com) '
        + '[Expensify?](https://www.expensify.com) '
        + '[Expensify](https://www.expensify-test.com) '
        + '[Expensify](https://www.expensify.com/settings?param={%22section%22:%22account%22}) '
        + '[Expensify](https://www.expensify.com/settings?param=(%22section%22+%22account%22)) '
        + '[Expensify](https://www.expensify.com/settings?param=[%22section%22:%22account%22])';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test anchor tags where links end in a comma', () => {
    const testString = '<a href="https://github.com/Expensify/Expensify/issues/143231" target="_blank">https://github.com/Expensify/Expensify/issues/143231</a>,';
    const resultString = 'https://github.com/Expensify/Expensify/issues/143231,';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test anchor tags where links have a period at the end', () => {
    const testString = '<a href="https://github.com/Expensify/ReactNativeChat/pull/645" target="_blank">https://github.com/Expensify/ReactNativeChat/pull/645</a>.';
    const resultString = 'https://github.com/Expensify/ReactNativeChat/pull/645.';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test anchor tags where links ending with a question mark', () => {
    const testString = '<a href="https://github.com/Expensify/ReactNativeChat/pull/645" target="_blank">https://github.com/Expensify/ReactNativeChat/pull/645</a>?';
    const resultString = 'https://github.com/Expensify/ReactNativeChat/pull/645?';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test anchor tags where links ending with a closing parentheses', () => {
    const testString = '<a href="https://github.com/Expensify/ReactNativeChat/pull/645" target="_blank">https://github.com/Expensify/ReactNativeChat/pull/645</a>)';
    const resultString = 'https://github.com/Expensify/ReactNativeChat/pull/645)';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test anchor tags where links are markdown style email link with various styles', () => {
    const testString = 'Go to <del><a href="mailto:concierge@expensify.com">Expensify</a></del> '
        + '<em><a href="mailto:concierge@expensify.com">Expensify</a></em> '
        + '<strong><a href="mailto:concierge@expensify.com">Expensify</a></strong> '
        + '<a href="mailto:no-concierge1@expensify.com">Expensify!</a> '
        + '<a href="mailto:concierge?@expensify.com">Expensify?</a> '
        + '<a href="mailto:applausetester+qaabecciv@applause.expensifail.com">Applause</a> ';

    const resultString = 'Go to ~[Expensify](concierge@expensify.com)~ '
        + '_[Expensify](concierge@expensify.com)_ '
        + '*[Expensify](concierge@expensify.com)* '
        + '[Expensify!](no-concierge1@expensify.com) '
        + '[Expensify?](concierge?@expensify.com) '
        + '[Applause](applausetester+qaabecciv@applause.expensifail.com) ';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test anchor tags with general email link', () => {
    const testString = 'Go to <a href="mailto:concierge@expensify.com">concierge@expensify.com</a> '
        + '<a href="mailto:no-concierge@expensify.com">no-concierge@expensify.com</a> '
        + '<a href="mailto:concierge!@expensify.com">concierge!@expensify.com</a> '
        + '<a href="mailto:concierge1?@expensify.com">concierge1?@expensify.com</a> '
        + '<a href="mailto:applausetester+qaabecciv@applause.expensifail.com">applausetester+qaabecciv@applause.expensifail.com</a> ';
    const resultString = 'Go to concierge@expensify.com '
        + 'no-concierge@expensify.com '
        + 'concierge!@expensify.com '
        + 'concierge1?@expensify.com '
        + 'applausetester+qaabecciv@applause.expensifail.com ';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test anchor tags where links have inconsistent starting and closing parens', () => {
    const testString = '<a href="http://google.com/(something)?after=parens" target="_blank">google</a> '
        + '(<a href="http://google.com/(something)?after=parens" target="_blank">google</a>) '
        + '(<a href="https://google.com/" target="_blank">google</a>) '
        + '(<a href="http://google.com/(something)?after=parens" target="_blank">google</a>))) '
        + '(((<a href="http://google.com/(something)?after=parens" target="_blank">google</a> '
        + '(<a href="http://foo.com/(something)?after=parens" target="_blank">http://foo.com/(something)?after=parens</a>) '
        + '(((<a href="http://foo.com/(something)?after=parens" target="_blank">http://foo.com/(something)?after=parens</a> '
        + '(((<a href="http://foo.com/(something)?after=parens" target="_blank">http://foo.com/(something)?after=parens</a>))) '
        + '<a href="http://foo.com/(something)?after=parens" target="_blank">http://foo.com/(something)?after=parens</a>))) '
        + '<a href="https://c8.alamy.com/compes/ha11pc/cookie-cat-con-sombrero-de-cowboy-y-sun-glass-ha11pc.jpg" target="_blank">Yo (click here to see a cool cat)</a> '
        + '<a href="https://c8.alamy.com/compes/ha11pc/cookie-cat-con-sombrero-de-cowboy-y-sun-glass-ha11pc.jpg" target="_blank">Yo click here to see a cool cat)</a> '
        + '<a href="https://c8.alamy.com/compes/ha11pc/cookie-cat-con-sombrero-de-cowboy-y-sun-glass-ha11pc.jpg" target="_blank">Yo (click here to see a cool cat</a> '
        + '<a href="https://c8.alamy.com/compes/ha11pc/cookie-cat-con-sombrero-de-cowboy-y-sun-glass-ha11pc.jpg" target="_blank">Yo click * $ &amp; here to see a cool cat</a> ';

    const resultString = '[google](http://google.com/(something)?after=parens) '
        + '([google](http://google.com/(something)?after=parens)) '
        + '([google](https://google.com/)) '
        + '([google](http://google.com/(something)?after=parens)))) '
        + '((([google](http://google.com/(something)?after=parens) '
        + '(http://foo.com/(something)?after=parens) '
        + '(((http://foo.com/(something)?after=parens '
        + '(((http://foo.com/(something)?after=parens))) '
        + 'http://foo.com/(something)?after=parens))) '
        + '[Yo (click here to see a cool cat)](https://c8.alamy.com/compes/ha11pc/cookie-cat-con-sombrero-de-cowboy-y-sun-glass-ha11pc.jpg) '
        + '[Yo click here to see a cool cat)](https://c8.alamy.com/compes/ha11pc/cookie-cat-con-sombrero-de-cowboy-y-sun-glass-ha11pc.jpg) '
        + '[Yo (click here to see a cool cat](https://c8.alamy.com/compes/ha11pc/cookie-cat-con-sombrero-de-cowboy-y-sun-glass-ha11pc.jpg) '
        + '[Yo click * $ & here to see a cool cat](https://c8.alamy.com/compes/ha11pc/cookie-cat-con-sombrero-de-cowboy-y-sun-glass-ha11pc.jpg) ';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test anchor tags replacements', () => {
    const urlTestStartString = 'Testing '
        + '<a href="http://foo.com" target="_blank">foo.com</a> \n'
        + '<a href="http://www.foo.com" target="_blank">www.foo.com</a> \n'
        + '<a href="http://www.foo.com" target="_blank">http://www.foo.com</a> \n'
        + '<a href="http://foo.com/blah_blah" target="_blank">http://foo.com/blah_blah</a> \n'
        + '<a href="http://foo.com/blah_blah/" target="_blank">http://foo.com/blah_blah/</a> \n'
        + '<a href="http://foo.com/blah_blah_(wikipedia)" target="_blank">http://foo.com/blah_blah_(wikipedia)</a> \n'
        + '<a href="http://www.example.com/wpstyle/?p=364" target="_blank">http://www.example.com/wpstyle/?p=364</a> \n'
        + '<a href="https://www.example.com/foo/?bar=baz&amp;inga=42&amp;quux" target="_blank">https://www.example.com/foo/?bar=baz&amp;inga=42&amp;quux</a> \n'
        + '<a href="http://foo.com/(something)?after=parens" target="_blank">http://foo.com/(something)?after=parens</a> \n'
        + '<a href="http://code.google.com/events/#&amp;product=browser" target="_blank">http://code.google.com/events/#&amp;product=browser</a> \n'
        + '<a href="http://foo.bar/?q=Test%20URL-encoded%20stuff" target="_blank">http://foo.bar/?q=Test%20URL-encoded%20stuff</a> \n'
        + '<a href="http://www.test.com/path?param=123#123" target="_blank">http://www.test.com/path?param=123#123</a> \n'
        + '<a href="http://1337.net" target="_blank">http://1337.net</a> \n'
        + '<a href="http://a.b-c.de/" target="_blank">http://a.b-c.de/</a> \n'
        + '<a href="https://sd1.sd2.docs.google.com/" target="_blank">https://sd1.sd2.docs.google.com/</a> \n'
        + '<a href="https://expensify.cash/#/r/1234" target="_blank">https://expensify.cash/#/r/1234</a> \n'
        + '<a href="https://github.com/Expensify/ReactNativeChat/pull/6.45" target="_blank">https://github.com/Expensify/ReactNativeChat/pull/6.45</a> \n'
        + '<a href="https://github.com/Expensify/Expensify/issues/143,231" target="_blank">https://github.com/Expensify/Expensify/issues/143,231</a> \n'
        + '<a href="http://testRareTLDs.beer" target="_blank">testRareTLDs.beer</a> \n'
        + '<a href="mailto:test@expensify.com">test@expensify.com</a> \n'
        + 'test.completelyFakeTLD \n'
        + '<a href="https://www.expensify.com/_devportal/tools/logSearch/#query=request_id:(%22Ufjjim%22)+AND+timestamp:[2021-01-08T03:48:10.389Z+TO+2021-01-08T05:48:10.389Z]&amp;index=logs_expensify-008878" target="_blank">https://www.expensify.com/_devportal/tools/logSearch/#query=request_id:(%22Ufjjim%22)+AND+timestamp:[2021-01-08T03:48:10.389Z+TO+2021-01-08T05:48:10.389Z]&amp;index=logs_expensify-008878</a>) \n'
        + '<a href="http://necolas.github.io/react-native-web/docs/?path=/docs/components-pressable--disabled" target="_blank">http://necolas.github.io/react-native-web/docs/?path=/docs/components-pressable--disabled</a> \n'
        + '<a href="https://github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash" target="_blank">https://github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash</a> \n'
        + '<a href="https://github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash" target="_blank">https://github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash</a> \n'
        + 'mm..food \n'
        + '<a href="http://upwork.com/jobs/~016781e062ce860b84" target="_blank">upwork.com/jobs/~016781e062ce860b84</a> \n'
        + '<a href="https://bastion1.sjc/logs/app/kibana#/discover?_g=()&amp;_a=(columns:!(_source),index:&#x27;2125cbe0-28a9-11e9-a79c-3de0157ed580&#x27;,interval:auto,query:(language:lucene,query:&#x27;&#x27;),sort:!(timestamp,desc))" target="_blank">https://bastion1.sjc/logs/app/kibana#/discover?_g=()&amp;_a=(columns:!(_source),index:&#x27;2125cbe0-28a9-11e9-a79c-3de0157ed580&#x27;,interval:auto,query:(language:lucene,query:&#x27;&#x27;),sort:!(timestamp,desc))</a> \n'
        + '<a href="http://google.com/maps/place/The+Flying&#x27;+Saucer/@42.4043314,-86.2742418,15z/data=!4m5!3m4!1s0x0:0xe28f6108670216bc!8m2!3d42.4043316!4d-86.2742121" target="_blank">google.com/maps/place/The+Flying&#x27;+Saucer/@42.4043314,-86.2742418,15z/data=!4m5!3m4!1s0x0:0xe28f6108670216bc!8m2!3d42.4043316!4d-86.2742121</a> \n'
        + '<a href="http://google.com/maps/place/%E9%9D%92%E5%B3%B6%E9%80%A3%E7%B5%A1%E8%88%B9%E4%B9%97%E5%A0%B4/@33.7363156,132.4877213,17.78z/data=!4m5!3m4!1s0x3545615c8c65bf7f:0xb89272c1a705a33f!8m2!3d33.7366776!4d132.4878843" target="_blank">google.com/maps/place/%E9%9D%92%E5%B3%B6%E9%80%A3%E7%B5%A1%E8%88%B9%E4%B9%97%E5%A0%B4/@33.7363156,132.4877213,17.78z/data=!4m5!3m4!1s0x3545615c8c65bf7f:0xb89272c1a705a33f!8m2!3d33.7366776!4d132.4878843</a> \n'
        + '<a href="https://www.google.com/maps/place/Taj+Mahal+@is~&quot;Awesome&quot;/@27.1751496,78.0399535,17z/data=!4m12!1m6!3m5!1s0x39747121d702ff6d:0xdd2ae4803f767dde!2sTaj+Mahal!8m2!3d27.1751448!4d78.0421422!3m4!1s0x39747121d702ff6d:0xdd2ae4803f767dde!8m2!3d27.1751448!4d78.0421422" target="_blank">https://www.google.com/maps/place/Taj+Mahal+@is~&quot;Awesome&quot;/@27.1751496,78.0399535,17z/data=!4m12!1m6!3m5!1s0x39747121d702ff6d:0xdd2ae4803f767dde!2sTaj+Mahal!8m2!3d27.1751448!4d78.0421422!3m4!1s0x39747121d702ff6d:0xdd2ae4803f767dde!8m2!3d27.1751448!4d78.0421422</a>';

    const urlTestReplacedString = 'Testing '
        + '[foo.com](http://foo.com) \n'
        + '[www.foo.com](http://www.foo.com) \n'
        + 'http://www.foo.com \n'
        + 'http://foo.com/blah_blah \n'
        + 'http://foo.com/blah_blah/ \n'
        + 'http://foo.com/blah_blah_(wikipedia) \n'
        + 'http://www.example.com/wpstyle/?p=364 \n'
        + 'https://www.example.com/foo/?bar=baz&inga=42&quux \n'
        + 'http://foo.com/(something)?after=parens \n'
        + 'http://code.google.com/events/#&product=browser \n'
        + 'http://foo.bar/?q=Test%20URL-encoded%20stuff \n'
        + 'http://www.test.com/path?param=123#123 \n'
        + 'http://1337.net \n'
        + 'http://a.b-c.de/ \n'
        + 'https://sd1.sd2.docs.google.com/ \n'
        + 'https://expensify.cash/#/r/1234 \n'
        + 'https://github.com/Expensify/ReactNativeChat/pull/6.45 \n'
        + 'https://github.com/Expensify/Expensify/issues/143,231 \n'
        + '[testRareTLDs.beer](http://testRareTLDs.beer) \n'
        + 'test@expensify.com \n'
        + 'test.completelyFakeTLD \n'
        + 'https://www.expensify.com/_devportal/tools/logSearch/#query=request_id:(%22Ufjjim%22)+AND+timestamp:[2021-01-08T03:48:10.389Z+TO+2021-01-08T05:48:10.389Z]&index=logs_expensify-008878) \n'
        + 'http://necolas.github.io/react-native-web/docs/?path=/docs/components-pressable--disabled \n'
        + 'https://github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash \n'
        + 'https://github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash \n'
        + 'mm..food \n'
        + '[upwork.com/jobs/~016781e062ce860b84](http://upwork.com/jobs/~016781e062ce860b84) \n'
        + 'https://bastion1.sjc/logs/app/kibana#/discover?_g=()&_a=(columns:!(_source),index:\'2125cbe0-28a9-11e9-a79c-3de0157ed580\',interval:auto,query:(language:lucene,query:\'\'),sort:!(timestamp,desc)) \n'

        + '[google.com/maps/place/The+Flying\'+Saucer/@42.4043314,-86.2742418,15z/data=!4m5!3m4!1s0x0:0xe28f6108670216bc!8m2!3d42.4043316!4d-86.2742121](http://google.com/maps/place/The+Flying\'+Saucer/@42.4043314,-86.2742418,15z/data=!4m5!3m4!1s0x0:0xe28f6108670216bc!8m2!3d42.4043316!4d-86.2742121) \n'

        + '[google.com/maps/place/%E9%9D%92%E5%B3%B6%E9%80%A3%E7%B5%A1%E8%88%B9%E4%B9%97%E5%A0%B4/@33.7363156,132.4877213,17.78z/data=!4m5!3m4!1s0x3545615c8c65bf7f:0xb89272c1a705a33f!8m2!3d33.7366776!4d132.4878843](http://google.com/maps/place/%E9%9D%92%E5%B3%B6%E9%80%A3%E7%B5%A1%E8%88%B9%E4%B9%97%E5%A0%B4/@33.7363156,132.4877213,17.78z/data=!4m5!3m4!1s0x3545615c8c65bf7f:0xb89272c1a705a33f!8m2!3d33.7366776!4d132.4878843) \n'
        + 'https://www.google.com/maps/place/Taj+Mahal+@is~"Awesome"/@27.1751496,78.0399535,17z/data=!4m12!1m6!3m5!1s0x39747121d702ff6d:0xdd2ae4803f767dde!2sTaj+Mahal!8m2!3d27.1751448!4d78.0421422!3m4!1s0x39747121d702ff6d:0xdd2ae4803f767dde!8m2!3d27.1751448!4d78.0421422';

    expect(parser.htmlToMarkdown(urlTestStartString)).toBe(urlTestReplacedString);
});
test('Test HTML string with code fence', () => {
    const testString = '<pre id="code1">class Expensify extends PureComponent {\n    constructor(props) {\n        super(props);\n    }\n}</pre>';
    const resultString = '```\nclass Expensify extends PureComponent {\n    constructor(props) {\n        super(props);\n    }\n}\n```';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);

    const testStringWithBrTag = '<pre id="code1">class Expensify extends PureComponent {<br />    constructor(props) {<br />        super(props);<br />    }<br />}</pre>';
    const resultStringForBrTag = '```\nclass Expensify extends PureComponent {\n    constructor(props) {\n        super(props);\n    }\n}\n```';
    expect(parser.htmlToMarkdown(testStringWithBrTag)).toBe(resultStringForBrTag);

    const testStringWithNewLinesFromSlack = '<pre class="c-mrkdwn__pre" data-stringify-type="pre" >line1'
    + '<span class="c-mrkdwn__br" data-stringify-type="paragraph-break" style="box-sizing: inherit; display: block; height: unset;">'
    + '</span>line3<span class="c-mrkdwn__br" data-stringify-type="paragraph-break" style="box-sizing: inherit; display: block; height: unset;"></span>'
    + '<span class="c-mrkdwn__br" data-stringify-type="paragraph-break" style="box-sizing: inherit; display: block; height: unset;"></span>line6</pre>';
    const resultStringWithNewLinesFromSlack = '```\nline1\n\nline3\n\n\nline6\n```';
    expect(parser.htmlToMarkdown(testStringWithNewLinesFromSlack)).toBe(resultStringWithNewLinesFromSlack);
});
