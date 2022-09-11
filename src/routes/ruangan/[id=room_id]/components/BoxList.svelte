<script lang="ts">
  import { onDestroy } from 'svelte';

  import { getRoom } from '../room-context';
  import { sortUsers } from './utils';

  const room = getRoom();

  let currentUser = room.getSelf();
  let others = room.getOthers().toArray();

  $: users = sortUsers(currentUser ? others.concat(currentUser) : others);
  $: isAdmin = users.length > 0 && users[0].id === currentUser?.id;

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

  onDestroy(() => {
    unsubscribeOthers();
    unsubscribeConnection();
    unsubscribeMyPresence();
  });
</script>

<div>
  {#each users as { connectionId, id, presence }, index (id)}
    <div>
      <p>#{connectionId}</p>
      <p>
        {presence?.userName || 'unknown'}
        {id === currentUser?.id ? ' (Kamu)' : ''}
        {#if index === 0}
          {' - '}
          <strong>Admin</strong>
        {/if}
      </p>
    </div>
  {/each}
</div>

{#if isAdmin}
  <button>Ulangi adu mekanik</button>
{/if}
