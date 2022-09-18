<script lang="ts">
  export let answer: string;
  export let definitions: string[];

  $: kbbiURL = `https://kbbi.kemdikbud.go.id/entri/${answer}`;
  $: kbbiLinkLabel = `Lihat definisi ${answer} di KBBI`;
</script>

<div>
  {#if definitions.length}
    <dl>
      <dt>
        <strong>{answer}</strong>
        <slot name="kbbi-link" {kbbiURL} {kbbiLinkLabel} />
      </dt>
      {#each definitions as definition, index (`${definition}-${index}`)}
        <dd>{definition}</dd>
      {/each}
    </dl>
  {:else}
    <div>
      <p>
        <strong>{answer}</strong>
        <slot name="kbbi-link" {kbbiURL} {kbbiLinkLabel} />
      </p>
      <p>Definisi untuk "{answer}" belum tersedia.</p>
    </div>
  {/if}

  <p class="definition-provider">
    Definisi diambil dari
    <a href={`https://cdn.statically.io/gh/pveyes/makna/main/data/${answer}.json`} target="_blank">
      Makna API by Fatih Kalifa
    </a>
  </p>
</div>

<style>
  dt {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  strong {
    text-transform: uppercase;
  }

  dd {
    position: relative;
    margin-top: 4px;
    line-height: 1rem;
  }

  dd::before {
    content: '⁍';
    position: absolute;
    left: -16px;
  }

  .definition-provider {
    color: var(--color-text-subtle);
  }
</style>
