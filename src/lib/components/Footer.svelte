<script lang="ts">
  export let isFullWidth = false;
</script>

<footer style:width={isFullWidth ? '100%' : undefined}>
  <p>
    Dikembangkan oleh
    <a
      href="https://rofisyahrul.com?utm_source=katlaisasi&utm_medium=web"
      target="_blank"
      rel="noopener noreferrer"
    >
      Rofi
    </a>
  </p>
  <p>
    Repositori dapat diakses di
    <a
      href="https://github.com/RofiSyahrul/katlaisasi?utm_source=katlaisasi&utm_medium=web"
      target="_blank"
      rel="noopener noreferrer"
    >
      GitHub
    </a>
  </p>
</footer>

<style>
  footer {
    width: calc(100% - 32px);
    max-width: 1366px;
    text-align: right;
    margin: 0 auto;
    padding: 4px 0;
  }

  footer p {
    color: var(--color-text-subtle);
    margin: 0;
  }

  footer p + p {
    margin-top: 4px;
  }
</style>
