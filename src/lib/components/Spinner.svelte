<script lang="ts">
  export let label = '';
  export let size = '32px';
</script>

<label aria-label={label} style:height={size} style:width={size}>
  <progress aria-busy="true" style:height={size} style:width={size} />
</label>

<style>
  @keyframes ripple {
    0% {
      transform: scale(0);
    }
    100% {
      opacity: 0;
    }
  }

  label {
    position: relative;
    text-align: center;
    align-self: stretch;
    justify-self: stretch;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    z-index: 0;
    overflow: hidden;
    color: var(--color-text-body);
    border-radius: 50%;
  }

  progress {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    display: block;
    margin: 1em auto;
    background: none;
    border: 0;
  }

  progress::-moz-progress-bar {
    background: none;
  }

  progress::-webkit-progress-bar {
    display: none;
  }

  progress::-ms-fill {
    animation-name: none;
  }

  progress,
  label::before,
  label::after {
    content: '';
    position: absolute;
    z-index: -1;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    border-radius: 100%;
    box-shadow: 0 0 2em 0.5em;
    animation: ripple 3s infinite;
  }

  label::before {
    animation-delay: -0.2s;
  }

  label::after {
    animation-delay: -0.4s;
  }
</style>
