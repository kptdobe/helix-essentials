/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import chai from 'chai';
const {
  expect
} = chai;

import { JSDOM } from 'jsdom';

import {
  toClassName,
  createTag,
  wrapSections
} from '../scripts/dom.js';

describe('dom#toClassName', () => {
  it('dom#toClassName keeps valid characters', () => {
    expect(toClassName('valid-classname')).to.equal('valid-classname');
    expect(toClassName('valid-classname1')).to.equal('valid-classname1');
    expect(toClassName('valid5-classname1')).to.equal('valid5-classname1');
  });

  it('dom#toClassName replaces invalid characters', () => {
    expect(toClassName('invalid->classname')).to.equal('invalid--classname');
    expect(toClassName('invalid2_classname2_')).to.equal('invalid2-classname2-');
    expect(toClassName('invalid2_classname3_')).to.equal('invalid2-classname3-');
    expect(toClassName('another invalid classname ')).to.equal('another-invalid-classname-');
  });
});

describe('dom#createTag', () => {
  beforeEach(() => {
    const dom = new JSDOM();

    global.window = dom.window;
    global.document = dom.window.document;
  });

  afterEach(() => {
    delete global.document;
    delete global.window
  });

  it('dom#createTag creates a dom element', () => {
    expect(createTag('div', {}).outerHTML).to.equal('<div></div>');
    expect(createTag('p', {}).outerHTML).to.equal('<p></p>');
    expect(createTag('a', {}).outerHTML).to.equal('<a></a>');
    expect(createTag('img', {}).outerHTML).to.equal('<img>');
  });

  it('dom#createTag manages attr', () => {
    expect(createTag('div', { 'class': 'a-css-class' }).outerHTML).to.equal('<div class="a-css-class"></div>');
    expect(createTag('a', { 'href': 'https://www.server.com/', 'class': 'a-css-class'}).outerHTML).to.equal('<a href="https://www.server.com/" class="a-css-class"></a>');
    expect(createTag('img', { 'src': 'https://www.server.com/img.jpg'}).outerHTML).to.equal('<img src="https://www.server.com/img.jpg">');
  });
});

describe('dom#wrapSections', () => {
  beforeEach(() => {
    const dom = new JSDOM();

    global.window = dom.window;
    global.document = dom.window.document;
  });

  afterEach(() => {
    delete global.document;
    delete global.window
  });

  it('dom#wrapSections wraps sections', () => {
    global.document.body.innerHTML = `
    <main>
      <div></div>
      <div>Some content</div>
      <div>
        <div>another div</div>
      </div>
      <p>A paragraph</p>
      <div>One more</div>
      <div id="adivid">Div with an id</div>
    </main>
    `;
    wrapSections('main>div');
    expect(global.document.body.innerHTML.replace(/\s/gm, '')).to.equal(`
    <main>
      <p>A paragraph</p>
      <div id="adivid">Div with an id</div>
      <div class="section-wrapper">
        <div></div>
      </div>
      <div class="section-wrapper">
        <div>Some content</div>
      </div>
      <div class="section-wrapper">
        <div>
          <div>another div</div>
        </div>
      </div>
      <div class="section-wrapper">
        <div>One more</div>
      </div>
    </main>`.replace(/\s/gm, ''));
  });
});