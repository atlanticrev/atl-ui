# Textarea

`<alt-textarea>` — самостоятельное многострочное form control с настоящим `<textarea>` в light DOM.
Компонент использует тот же SVG notched outline, размеры, semantic states и focus contract, что и Input.
Label всегда находится в notch: он не перемещается при focus, вводе текста или наличии placeholder.

## Подключение

```ts
import '@atlanticrev/atl-ui-vanilla/default.css';
import { defineAltTextarea } from '@atlanticrev/atl-ui-vanilla/textarea';

defineAltTextarea();
```

Импорт не регистрирует custom element автоматически. `defineAltTextarea()` идемпотентен и безопасен при
вызове вне browser environment.

```html
<alt-textarea
  helper-text="Optional description shown below the field"
  label="Caption"
  name="caption"
  placeholder="Write a caption"
  rows="5"
></alt-textarea>
```

## Атрибуты

| Атрибут | Назначение |
|---|---|
| `value` | Начальное значение и значение, к которому возвращает form reset |
| `name`, `form` | Native form ownership и ключ в `FormData` |
| `label` | Статичный label в SVG notch |
| `description` | Дополнительный текст внутри outline |
| `helper-text` | Supporting или validation text под outline |
| `placeholder` | Native textarea placeholder |
| `disabled`, `readonly`, `required` | Native textarea semantics |
| `min-length`, `max-length` | Native `minlength`/`maxlength`; неявного максимума нет |
| `rows`, `wrap` | Native textarea layout и wrapping |
| `autocomplete`, `inputmode` | Native browser hints |
| `size` | `xl`, `l`, `m`, `s` или `xs`; по умолчанию `m` |
| `status` | `default`, `error` или `success` |
| `show-character-count` | Показывает длину значения; при `max-length` — формат `current/max` |
| `read-only-styled` | Только muted presentation без изменения native editability |
| `aria-label`, `aria-invalid` | Явные accessibility overrides |

Компонент не вводит `max-length` по умолчанию. Без него browser не ограничивает ввод, а включённый
character counter показывает только текущую длину.

## Properties и методы

Публичный `AltTextareaElementApi` предоставляет:

- `value`, `disabled`, `readOnly`, `readOnlyStyled`;
- `textareaElement` для доступа к внутреннему native control;
- `form`, `validity`, `validationMessage`;
- `focus()`, `select()`;
- `checkValidity()`, `reportValidity()`, `setCustomValidity(message)`.

```ts
import type { AltTextareaElementApi } from '@atlanticrev/atl-ui-vanilla/textarea';

const caption = document.querySelector<AltTextareaElementApi>('alt-textarea');

if (caption) {
  caption.value = 'Launch caption';
  caption.setCustomValidity('');
}
```

Properties, назначенные до регистрации custom element, сохраняются при upgrade.

## События

Компонент отправляет bubbling composed events:

- `alt-input` на каждый native `input`;
- `alt-change` на native `change`.

Оба события имеют `detail: { value: string }`. Native events остаются на внутреннем `<textarea>`; application
code должен использовать публичные `alt-*` events на host.

## Формы и accessibility

Native `<textarea>` остаётся участником формы, поэтому browser обслуживает:

- `FormData` и исключение disabled field;
- `required`, length constraints и custom validity;
- form reset;
- keyboard editing, selection, autofill и spell checking.

`label`, `description` и `helper-text` получают стабильные id. Компонент связывает их с native field через
`aria-labelledby` и `aria-describedby`; `status="error"` устанавливает `aria-invalid="true"`.

## Layout и темы

Поле по умолчанию можно изменять только по вертикали. SVG outline пересчитывается через `ResizeObserver`,
поэтому notch и рамка следуют за новой высотой без сдвига label.

Локальная настройка выполняется через публичные custom properties:

```css
alt-textarea[data-purpose='compact-note'] {
  --alt-textarea-field-min-height: 5rem;
  --alt-textarea-radius: var(--alt-radius-sm);
}
```

Основные component tokens:

- `--alt-textarea-field-min-height`;
- `--alt-textarea-padding-block`, `--alt-textarea-padding-inline`;
- `--alt-textarea-bg`;
- `--alt-textarea-radius`;
- `--alt-textarea-font`, `--alt-textarea-label-font`.

Autoresize, rich-text editing, markdown и application loading state не входят в контракт Textarea.
