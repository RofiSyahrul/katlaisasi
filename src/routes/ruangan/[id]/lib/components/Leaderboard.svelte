<script lang="ts">
  import { flip } from 'svelte/animate';
  import { crossfade } from 'svelte/transition';

  import type { LeaderboardItem } from '../liveblocks/types';

  export let data: LeaderboardItem[];

  const [send, receive] = crossfade({});
</script>

<h3>Klasemen</h3>

<ol>
  {#each data as item (item.id)}
    <li in:receive={{ key: item.id }} out:send={{ key: item.id }} animate:flip>
      <div>
        <strong class="user-name">{item.userName}</strong>
        <strong>{item.score}</strong>
      </div>
    </li>
  {/each}
</ol>

<style>
  ol {
    margin: 0;
    padding: 0;
    list-style-position: inside;
    width: 100%;
  }

  li + li {
    margin-top: 8px;
  }

  li:first-child {
    background-color: var(--color-bg-tile-exact);
    color: var(--color-neutral-bright);
  }

  li:nth-child(2) {
    background-color: var(--color-bg-tile-correct);
    color: var(--color-neutral-bright);
  }

  li {
    width: 100%;
    padding: 4px;
    border-radius: 4px;
  }

  li > div {
    display: inline-flex;
    align-items: center;
    width: calc(100% - 24px);
    justify-content: space-between;
  }

  li .user-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
