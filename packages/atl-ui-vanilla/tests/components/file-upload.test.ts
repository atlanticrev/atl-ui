import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { createAltFileUploadElementClass } from '../../src/components/file-upload';
import type { AltFileUploadElementApi } from '../../src/components/file-upload/types';

const TAG_NAME = 'alt-file-upload-test';

beforeAll(() => {
	if (!customElements.get(TAG_NAME)) {
		customElements.define(TAG_NAME, createAltFileUploadElementClass(window.HTMLElement));
	}
});

beforeEach(() => {
	document.body.replaceChildren();
});

describe('alt-file-upload', () => {
	it('keeps a native file input and emits selected files', async () => {
		const upload = document.createElement(TAG_NAME) as AltFileUploadElementApi;

		const onChange = vi.fn();

		upload.label = 'Upload media';

		upload.name = 'media';

		upload.addEventListener('alt-change', onChange);

		document.body.append(upload);

		await Promise.resolve();

		const input = upload.inputElement;

		const file = new File(['video'], 'post.mp4', { type: 'video/mp4' });

		Object.defineProperty(input, 'files', {
			configurable: true,
			value: [file],
		});

		input?.dispatchEvent(new Event('change', { bubbles: true }));

		await Promise.resolve();

		expect(input?.type).toBe('file');

		expect(input?.name).toBe('media');

		expect(upload.querySelector('.alt-file-upload__button')?.classList.contains('alt-button')).toBe(true);

		expect(upload.querySelector('.alt-file-upload__value')?.textContent).toBe('post.mp4');

		expect(onChange.mock.calls[0][0].detail.files).toEqual([file]);
	});

	it('reflects disabled and multiple state to the native input', async () => {
		const upload = document.createElement(TAG_NAME) as AltFileUploadElementApi;

		const icon = document.createElement('span');

		upload.buttonIcon = icon;

		upload.disabled = true;

		upload.multiple = true;

		document.body.append(upload);

		await Promise.resolve();

		expect(upload.inputElement?.disabled).toBe(true);

		expect(upload.inputElement?.multiple).toBe(true);

		expect(upload.querySelector('.alt-file-upload__icon')?.firstChild).toBe(icon);
	});
});
