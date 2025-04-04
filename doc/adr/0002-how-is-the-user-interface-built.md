# 2. How is the user interface built

Date: 2025-03-21

## Status

Accepted

## Context

The issue motivating this decision, and any context that influences or constrains the decision.

Within the next 12 months we need to create a user interface (UI) that enables testing of a communication platform in online civil court proceedings. The scope of the MVP is clear from a functional perspective, but the user flow and its look and feel (design) is and will be work in progress for the weeks ahead. It will adjust iteratively. For example after doing a technical spike or user testing/interviews or an option that may seem promising for our roadmap. It is therefore important to be able to react flexibly to future user interface (product) requirements.
In order to be able to start development soon and gather initial findings at an early stage, we have various options with regard to the UI development:

- A2J - Digitale Rechtsantragstelle [Components](https://github.com/digitalservicebund/a2j-rechtsantragstelle/tree/main/app/components)
  - :heavy_exclamation_mark: Copy/paste/adjust and new components need to be created from scratch
- Style-free (or headless) component library options:
  - [React Aria Components](https://react-spectrum.adobe.com/react-aria/components.html)
    - :white_check_mark: Tailwind support
  - [Radix UI Primitives](https://www.radix-ui.com/primitives)
    - :heavy_exclamation_mark: Tailwind is not encouraged
- Other component library options that come already with styles:
  - [KERN UX](https://www.kern-ux.de/)
    - :bangbang: Non customizable design system with a lot of instantly usable components
  - [Material 3](https://m3.material.io/)
    - :white_check_mark: A full customizable design system with a Figma Kit (also good for our design colleagues to get quickly started)

|     | A2J | KERN UX | React Aria | Radix |
| --- | --- | ------- | ---------- | ----- |
| a   |     |         |            |       |
| b   |     |         |            |       |
| c   |     |         |            |       |

### Testing notes

#### KERN UX

- HTML/CSS components have been tested
  - There are also Web Components (WC) available, but its usage within a React project is not always easy. For example: Before React 19 prop passing and event handling (synthetic event system from React vs. custom DOM events for WCs) was not always easy, WC usage needs another evaluation.
- Easy usage: A components HTML can be copy/pasted from its overview, see the [Checkbox](https://www.kern-ux.de/components/form-inputs/checkboxes) for example.
- The rendered markup is slim and clean.

```html
<div class="kern-form-check">
  <input
    class="kern-form-check__checkbox"
    id="herr"
    name="geschlecht"
    type="checkbox"
  />
  <label class="kern-form-check__label" for="herr">Herr</label>
</div>
```

#### React Aria

- Usage: React components can be imported into a view/page directly from the [npm package](https://www.npmjs.com/package/react-aria) or a custom component library can be customized according to our ideas.
- It seems that a lot of HTML markup (Components) needs to be reworked to align with our design goals of Angie/KERN UX.
  To give an example, here is the rendered output of a React Aria Checkbox component:

  ```html
  <div>
    <label
      class="flex gap-2 items-center group transition ds-checkbox"
      data-rac=""
    >
      <span
        style="border:0;clip:rect(0 0 0 0);clip-path:inset(50%);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;white-space:nowrap"
      >
        <input type="checkbox" tabindex="0" title="" />
      </span>
      <div
        class="outline-blue-600 dark:outline-blue-500 forced-colors:outline-[Highlight] outline-offset-2 w-40 h-40 shrink-0 rounded-sm flex items-center justify-center border-2 transition outline-0"
      ></div>
      Herr
    </label>
  </div>
  ```

  This markup can't be used out of the box with Angie DS CSS definitions. The Checkbox relevant stylings, e. g. the `.ds-checkbox+label` CSS styles, take care of the layout of an `<input>` and its related `<label>`. They need to be rendered in a specific order: a `<label>` followed by the Checkboxes `<input>` field. Therefor, markup/component rework is needed to get React Aria in a usable state for our needs.

- Additionally: A lot of markup is being rendered (as you can see above), this is not the most minimal approach of rendering a checkbox with a label.

## Decision

The change that we're proposing or have agreed to implement.

## Consequences

What becomes easier or more difficult to do and any risks introduced by the change that will need to be mitigated.
