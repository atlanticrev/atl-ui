import type { SelectModel } from '../select/model';
import { type OptionView, syncOptionViews } from '../select/option-view';

import type { DropdownDom } from './dropdown-dom';

export const renderDropdown = (
	host: HTMLElement,
	dom: DropdownDom,
	model: SelectModel,
	views: Map<string, OptionView>,
	emptyIcon: Node | null,
): void => {
	host.dataset.multiple = String(host.hasAttribute('multiple'));
	dom.list.setAttribute('aria-multiselectable', String(host.hasAttribute('multiple')));
	dom.list.style.setProperty('--alt-listbox-max-height', `${Number(host.getAttribute('max-height')) || 320}px`);
	dom.emptyText.textContent = host.getAttribute('empty-text') ?? 'No options';
	dom.emptyIcon.hidden = !emptyIcon;
	if (emptyIcon && dom.emptyIcon.firstChild !== emptyIcon) dom.emptyIcon.replaceChildren(emptyIcon);
	if (!emptyIcon && dom.emptyIcon.childNodes.length > 0) dom.emptyIcon.replaceChildren();
	dom.empty.hidden = model.options.length > 0;
	dom.footer.hidden = !host.hasAttribute('show-footer');
	dom.footerText.textContent = host.getAttribute('footer-text') ?? '';
	dom.footerText.hidden = !dom.footerText.textContent;
	dom.selectAll.textContent = host.getAttribute('select-all-text') ?? 'Select all';
	dom.selectAll.hidden = !host.hasAttribute('multiple');
	syncOptionViews(dom.list, views, model.options, model.activeValue, model.values);
	const active = model.activeValue ? views.get(model.activeValue) : undefined;
	if (active) {
		dom.list.setAttribute('aria-activedescendant', active.element.id);
		active.element.scrollIntoView?.({ block: 'nearest' });
	} else dom.list.removeAttribute('aria-activedescendant');
};
