<script lang="ts">
  import { onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';

  import { userName } from '$lib/stores';
  import { getRoom } from '../room-context';
  import Card from './Card.svelte';
  import { sortUsers } from './utils';

  const room = getRoom();

  export let isUserNameUpdated = false;

  let currentUser = room.getSelf();
  let others = room.getOthers().toArray();

  $: if (isUserNameUpdated) {
    room.updatePresence({ userName: $userName });
    isUserNameUpdated = false;
  }

  const unsubscribeOthers = room.subscribe('others', (otherUsers) => {
    others = otherUsers.toArray();
  });

  const unsubscribeConnection = room.subscribe('connection', () => {
    currentUser = room.getSelf();
  });

  const unsubscribeMyPresence = room.subscribe('my-presence', (presence) => {
    if (currentUser) {
      currentUser = {
        ...currentUser,
        presence
      };
    }
  });

  $: users = sortUsers(currentUser ? [...others, currentUser] : [...others]);
  $: isAdmin = users.length > 0 && users[0].id === currentUser?.id;

  onDestroy(() => {
    unsubscribeOthers();
    unsubscribeConnection();
    unsubscribeMyPresence();
  });
</script>

<div class="card-list">
  {#each users as { id, presence }, index (id)}
    <Card
      on:editUserName
      isAdmin={index === 0}
      isCurrentUser={id === currentUser?.id}
      userName={presence?.userName ?? ''}
    />
  {/each}
</div>

{#if isAdmin}
  <button in:fade={{ delay: 1000 }}>Ulangi adu mekanik</button>
{/if}

<style>
  .card-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 12px;
    width: 100%;
  }

  button {
    position: fixed;
    top: 8px;
    left: 8px;
    min-height: fit-content;
    box-shadow: var(--shadow-md);
  }
</style>
