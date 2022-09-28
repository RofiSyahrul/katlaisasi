export const darkStyles = `:root, ::before, ::after {
--color-bg-body: var(--color-neutral-dim, black);
--color-bg-subtle: var(--color-neutral-dim2, darkslategray);
--color-text-body: var(--color-neutral-bright, white);
--color-text-subtle: var(--color-neutral-bright2, lightslategray);
--color-text-inverse: var(--color-neutral-dim, black);

--color-primary: var(--color-primary-bright, cyan);
--color-secondary: var(--color-secondary-bright, lightgreen);
--color-danger: var(--color-danger-bright, lightcoral);

--color-border: var(--color-neutral-dim1, darkslategray);

--shadow-color-06: rgba(255, 255, 255, 0.06);
--shadow-color-10: rgba(255, 255, 255, 0.1);
}`;

export const lightStyles = `:root, ::before, ::after {
--color-bg-body: var(--color-neutral-bright, white);
--color-bg-subtle: var(--color-neutral-bright2, lightslategray);
--color-text-body: var(--color-neutral-dim, black);
--color-text-subtle: var(--color-neutral-dim2, darkslategray);
--color-text-inverse: var(--color-neutral-bright, white);

--color-primary: var(--color-primary-dim, darkcyan);
--color-secondary: var(--color-secondary-dim, darkgreen);
--color-danger: var(--color-danger-dim, darkred);

--color-border: var(--color-neutral-bright1, lightslategray);

--shadow-color-06: rgba(0, 0, 0, 0.06);
--shadow-color-10: rgba(0, 0, 0, 0.1);
}`;

export const systemStyles = `${lightStyles}
@media (prefers-color-scheme: dark) {${darkStyles}}`;
