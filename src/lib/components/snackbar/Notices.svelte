<script lang="ts">
  let container: HTMLDivElement;

  export function insert(el: HTMLElement) {
    container.insertAdjacentElement('afterbegin', el);
  }
</script>

<div class="notices" bind:this={container} />

<style>
  .notices {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    padding: 16px;
    z-index: 1000;
    pointer-events: none;
    display: flex;
    flex-direction: column;
  }
</style>
