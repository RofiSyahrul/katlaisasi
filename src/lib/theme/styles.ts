export const darkStyles = `:root, ::before, ::after {
--color-bg-body: var(--color-neutral-dim);
--color-text-body: var(--color-neutral-bright);
--color-text-subtle: var(--color-neutral-bright2);
--color-text-inverse: var(--color-neutral-dim);

--color-primary: var(--color-primary-bright);
--color-secondary: var(--color-secondary-bright);
--color-danger: var(--color-danger-bright);

--color-border: var(--color-neutral-dim1);
}`;

export const lightStyles = `:root, ::before, ::after {
--color-bg-body: var(--color-neutral-bright);
--color-text-body: var(--color-neutral-dim);
--color-text-subtle: var(--color-neutral-dim2);
--color-text-inverse: var(--color-neutral-bright);

--color-primary: var(--color-primary-dim);
--color-secondary: var(--color-secondary-dim);
--color-danger: var(--color-danger-dim);

--color-border: var(--color-neutral-bright1);
}`;

export const systemStyles = `${lightStyles}
@media (prefer-color-scheme: dark) {${darkStyles}}`;
