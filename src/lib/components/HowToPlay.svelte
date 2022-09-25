<script lang="ts" context="module">
  type Example = {
    description: string;
    guess: GuessItem[];
  };

  function createExample(value: string, upperCaseStatus: GuessStatus): Example {
    let highlightedChar = '';

    const guess = value.split('').map<GuessItem>((char) => {
      const upperCasedChar = char.toUpperCase();
      let status: GuessStatus = 'guessing';
      if (upperCasedChar === char && !highlightedChar) {
        status = upperCaseStatus;
        highlightedChar = char;
      }
      return {
        char: upperCasedChar,
        status
      };
    });

    let description = `Huruf <strong>${highlightedChar}</strong> `;
    switch (upperCaseStatus) {
      case 'exact':
        description += 'ada di kata rahasia dan posisinya sudah tepat';
        break;
      case 'correct':
        description += 'ada di kata rahasia, tetapi posisinya belum tepat';
        break;
      case 'wrong':
        description += 'tidak ada di kata rahasia';
        break;
      default:
        description = '';
    }

    return { description, guess };
  }

  const examples: Example[] = [
    createExample('teBak', 'exact'),
    createExample('sayUr', 'correct'),
    createExample('fosiL', 'wrong')
  ];
</script>

<script lang="ts">
  import { MAX_ROUND_PER_ROOM } from '$lib/constants/game';
  import type { GuessItem, GuessStatus } from '$lib/types/game';
  import Tile from './Tile.svelte';
</script>

<h3>Cara bermain</h3>
<p>Tebak KATLA dalam 6 kesempatan. Dalam 1 ruangan ada 1 kata rahasia di setiap rondenya.</p>
<p>
  Setiap tebakan harus merupakan kata valid 5 huruf sesuai KBBI. Tekan tombol <kbd>ENTER</kbd> untuk
  mengirimkan tebakan.
</p>
<p>
  Setelah tebakan dikirimkan, kamu harus menunggu orang lain di ruangan yang sama untuk mengirimkan
  tebakan juga. Kamu tidak bisa mengubah tebakanmu ketika menunggu.
</p>
<p>
  Setelah semua orang di satu ruangan mengirimkan tebakan, warna kotak akan berubah untuk
  menunjukkan seberapa dekat tebakanmu dari kata rahasia.
</p>

<hr />

<strong>Contoh</strong>

<ul>
  {#each examples as { description, guess } (description)}
    <li>
      <div>
        {#each guess as { char, status }, index (`${char}-${status}-${index}`)}
          <Tile letter={char} {status} />
        {/each}
      </div>
      <p>
        {@html description}
      </p>
    </li>
  {/each}
</ul>

<hr />

<p>Kamu hanya bisa memainkan {MAX_ROUND_PER_ROOM} ronde di dalam 1 ruangan.</p>

<style>
  h3 {
    width: 100%;
    text-align: center;
    margin: 0 0 12px;
  }

  p {
    width: 100%;
    margin: 0 0 8px;
    font-size: 0.9rem;
  }

  strong {
    width: 100%;
    font-size: 0.9rem;
  }

  hr {
    margin: 0 0 16px;
    height: 0px;
    width: 100%;
    border: none;
    border-top: 1px solid var(--color-border);
  }

  ul {
    display: block;
    list-style: none;
    width: 100%;
    padding: 0;
    margin: 12px 0;
  }

  ul > li + li {
    margin-top: 12px;
  }

  ul div {
    display: grid;
    grid-template-columns: repeat(5, 1.5fr);
    gap: 6px;
    width: 100%;
    max-width: 180px;
    margin-bottom: 4px;
  }

  ul p {
    margin: 0;
  }
</style>
