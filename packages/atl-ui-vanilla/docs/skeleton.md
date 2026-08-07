# Skeleton

Skeleton поддерживает атомарные placeholders и content-backed host для составных виджетов. Host использует
реальный DOM будущего содержимого как источник геометрии, поэтому библиотека не вычисляет width или height в
JavaScript.

## Content-backed host

```html
<article class="alt-card alt-skeleton-host" aria-busy="true">
  <div class="alt-skeleton-host__content" aria-hidden="true" inert>
    <h2>Scheduled publication</h2>
    <button class="alt-button" type="button">Review</button>
  </div>
</article>
```

```ts
import { setAltSkeletonHostLoading } from '@atlanticrev/atl-ui-vanilla/skeleton';

setAltSkeletonHostLoading(host, true);

// Записать готовые данные в существующий content DOM.

setAltSkeletonHostLoading(host, false);
```

Host должен иметь ровно один прямой `.alt-skeleton-host__content`. Helper явно отклоняет неверную разметку,
выставляет `aria-busy` и синхронизирует `aria-hidden`/`inert`. Импорт SSR-safe и не регистрирует custom elements.

При `loading=false` готовый content открывается сразу, а overlay плавно исчезает поверх него. Host и content не
удаляются, поэтому transition не меняет layout. При `prefers-reduced-motion: reduce` shimmer и fade отключаются.

## Radius

Overlay наследует вычисленный `border-radius` host. Совмещайте host с реальной surface class:

```html
<section class="alt-card alt-skeleton-host">...</section>
```

Тогда `--alt-card-radius` одновременно определяет форму карточки и skeleton. Для произвольной surface задайте
`border-radius` самому host. Не копируйте radius на отдельный overlay.

Atomic `.alt-skeleton` использует `--alt-skeleton-radius` с системным fallback `--alt-radius-sm`; shapes `line` и
`circle` устанавливают свои значения.

Shimmer меняет только позицию gradient background внутри неизменного overlay box. Поэтому во время fade-out он не
рисуется за границами host даже после восстановления обычного `overflow` готового содержимого.

## Visual overrides

```css
.publication-skeleton {
  --alt-skeleton-bg: #e8edf3;
  --alt-skeleton-highlight: rgb(255 255 255 / 64%);
  --alt-skeleton-shimmer-duration: 1.8s;
  --alt-skeleton-fade-duration: 220ms;
  --alt-skeleton-fade-easing: ease-out;
  --alt-skeleton-overlay-z-index: 2;
}
```

Все overrides локальны host или atomic skeleton. Default values используют library tokens и не требуют темы
приложения.

## Граница точности

Host гарантирует одинаковую геометрию loading и ready для уже созданной структуры. Библиотека не угадывает
неизвестное число API-строк, длину текста, active tab или media ratio. Приложение должно заранее выбрать
структурный variant, резервное число строк, clamp или `min-block-size`.

Для составных карточек и форм используйте host. Для отдельной строки, avatar, chip или прямоугольника оставляйте
`span.alt-skeleton` с подходящим `data-shape`.
