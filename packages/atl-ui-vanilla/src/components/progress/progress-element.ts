import { createBaseElementClass, upgradeProperties } from '../../core';

import { createProgressDom, type ProgressDom } from './progress-dom';
import { clampProgressValue, getProgressPercent, normalizeProgressMax } from './progress-values';
import type { AltProgressShape, AltProgressSize, AltProgressStatus } from './types';

export const createAltProgressElementClass = (HtmlElementConstructor: typeof HTMLElement): CustomElementConstructor => {
	const BaseElement = createBaseElementClass(HtmlElementConstructor);

	return class AltProgressElement extends BaseElement {
		static observedAttributes = [
			'aria-label',
			'indeterminate',
			'label',
			'max',
			'show-value',
			'shape',
			'size',
			'status',
			'value',
		];
		#dom: ProgressDom | undefined;
		#labelContent: Node | null = null;

		get indeterminate(): boolean {
			return this.hasAttribute('indeterminate');
		}
		set indeterminate(value: boolean) {
			this.toggleAttribute('indeterminate', value);
		}
		get labelContent(): Node | null {
			return this.#labelContent;
		}
		set labelContent(value: Node | null) {
			this.#labelContent = value;

			this.requestUpdate();
		}
		get max(): number {
			return normalizeProgressMax(Number(this.getAttribute('max')));
		}
		set max(value: number) {
			this.setAttribute('max', String(value));
		}
		get shape(): AltProgressShape {
			return this.getAttribute('shape') === 'circular' ? 'circular' : 'linear';
		}
		set shape(value: AltProgressShape) {
			this.setAttribute('shape', value);
		}
		get size(): AltProgressSize {
			return this.getAttribute('size') === 'sm' ? 'sm' : 'md';
		}
		set size(value: AltProgressSize) {
			this.setAttribute('size', value);
		}
		get status(): AltProgressStatus {
			return (this.getAttribute('status') as AltProgressStatus) || 'default';
		}
		set status(value: AltProgressStatus) {
			this.setAttribute('status', value);
		}
		get value(): number {
			return clampProgressValue(Number(this.getAttribute('value')), this.max);
		}
		set value(value: number) {
			this.setAttribute('value', String(value));
		}

		attributeChangedCallback(): void {
			this.requestUpdate();
		}

		onConnected(): void {
			upgradeProperties(this, ['indeterminate', 'labelContent', 'max', 'shape', 'size', 'status', 'value']);

			this.classList.add('alt-progress');

			this.#dom ??= createProgressDom(this);
		}

		update(): void {
			if (!this.#dom) return;

			const label = this.getAttribute('label') ?? '';

			const percent = getProgressPercent(this.value, this.max);

			const showValue = this.getAttribute('show-value') !== 'false' && !this.indeterminate;

			this.dataset.indeterminate = String(this.indeterminate);

			this.dataset.shape = this.shape;

			this.dataset.size = this.size;

			this.dataset.status = this.status;

			this.#dom.control.max = this.max;

			if (this.indeterminate) this.#dom.control.removeAttribute('value');
			else this.#dom.control.value = this.value;

			this.#dom.fill.style.width = this.indeterminate ? '40%' : `${percent}%`;

			this.#dom.circle.style.strokeDashoffset = String(2 * Math.PI * 18 * (1 - percent / 100));

			this.#dom.label.replaceChildren(this.#labelContent ?? label);

			this.#dom.label.hidden = !this.#labelContent && !label;

			this.#dom.value.textContent = `${percent}%`;

			this.#dom.value.hidden = !showValue;

			this.#dom.header.hidden = this.#dom.label.hidden && this.#dom.value.hidden;

			if (!this.#dom.label.hidden) {
				this.#dom.control.setAttribute('aria-labelledby', this.#dom.label.id);

				this.#dom.control.removeAttribute('aria-label');
			} else {
				this.#dom.control.removeAttribute('aria-labelledby');

				this.#dom.control.setAttribute('aria-label', this.getAttribute('aria-label') ?? 'Progress');
			}
		}
	};
};
