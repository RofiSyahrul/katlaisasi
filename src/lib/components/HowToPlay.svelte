<script lang="ts" context="module">
  type Example = {
    descriptions: string[];
    guess: GuessItem[];
  };

  function createDescription(chars: string[], status: GuessStatus): string {
    if (chars.length === 0) return '';

    let description = `Huruf `;
    description += enumerate(...chars.map((char) => `<strong>${char}</strong>`));

    switch (status) {
      case 'exact': {
        description += ' ada di kata rahasia dan posisinya sudah tepat.';
        return description;
      }
      case 'correct': {
        description += ' ada di kata rahasia, tetapi posisinya belum tepat.';
        return description;
      }
      case 'wrong': {
        description += ' tidak ada di kata rahasia.';
        return description;
      }
      default: {
        description = '';
        return description;
      }
    }
  }

  function createExample(value: string, upperCaseStatuses: GuessStatus[]): Example {
    const exactChars: string[] = [];
    const correctChars: string[] = [];
    const wrongChars: string[] = [];

    const guess = value.split('').map<GuessItem>((char) => {
      const upperCasedChar = char.toUpperCase();
      let status: GuessStatus = 'wrong';
      if (upperCasedChar === char && upperCaseStatuses.length > 0) {
        status = upperCaseStatuses[0];
        upperCaseStatuses.shift();
        if (status === 'correct') correctChars.push(upperCasedChar);
        else if (status === 'exact') exactChars.push(upperCasedChar);
      } else {
        wrongChars.push(upperCasedChar);
      }
      return {
        char: upperCasedChar,
        status
      };
    });

    const descriptions = [
      createDescription(exactChars, 'exact'),
      createDescription(correctChars, 'correct'),
      createDescription(wrongChars, 'wrong')
    ].filter(Boolean);

    return { descriptions, guess };
  }

  const example = createExample('teBAk', ['exact', 'correct']);
</script>

<script lang="ts">
  import { MAX_ROUND_PER_ROOM } from '$lib/constants/game';
  import type { GuessItem, GuessStatus } from '$lib/types/game';
  import { enumerate } from '$lib/utils/enumerate';
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

<div class="example-guess">
  {#each example.guess as { char, status }, index (`${char}-${status}-${index}`)}
    <Tile letter={char} {status} />
  {/each}
</div>
<ul>
  {#each example.descriptions as description (description)}
    <li>
      {@html description}
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
    margin: 0 0 16px;
  }

  ul > li + li {
    margin-top: 8px;
  }

  .example-guess {
    display: grid;
    grid-template-columns: repeat(5, 1.5fr);
    gap: 6px;
    align-self: flex-start;
    width: 100%;
    max-width: 180px;
    user-select: none;
  }
</style>
