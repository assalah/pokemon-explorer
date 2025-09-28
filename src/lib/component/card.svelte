
<script>
  export let pokemon = null; // data comming from page.sevlte
  export let open = false;   // stat of opening side bar
  export let onClose;        

</script>

<!-- darkbaground when sidebar is opened-->
{#if open}
  <div class="fixed inset-0 bg-black/50 z-40" on:click={onClose}></div>
{/if}

<!-- sidebar setting -->
<div class={`fixed top-0 right-0 h-full bg-black shadow-lg transform transition-transform duration-300 z-50 
  ${open ? 'translate-x-0 w-96' : 'translate-x-full w-96'}`}>

  <!-- closing botton -->
  <button on:click={onClose} class="m-4 px-3 py-1 bg-gray-400 rounded hover:bg-gray-700 text-black ">
    ✕
  </button>


  <!-- printing pokemon data  -->
  {#if pokemon}

    <div class="p-6 overflow-y-auto h-full">
      <h2 class="text-2xl font-bold capitalize mb-2">
        {pokemon.name} #{pokemon.id}
      </h2>

      <img src={pokemon.sprites.front_default} alt={pokemon.name}
           class="mx-auto mb-4 w-40 h-40" />

      <!-- base states of pokemon -->
      <h3 class="font-semibold mt-4">Base Stats:</h3>
       <ul class="space-y-2 max-h-60 overflow-y-auto">
       {#each pokemon.stats.slice(0,10) as s}
         <li class="flex items-center gap-3">
      <!-- name -->
      <span class="w-40 capitalize">{s.stat.name}</span>

      <!-- progress bar -->
      <div class="flex-1 bg-black-200 rounded-full h-1">
        <div
          class="bg-green-500 h-1 rounded-full"
          style="width: {Math.min(s.base_stat, 100)}%"
        ></div>
      </div>

      <!-- precentage -->
      <span class="w-10 text-right font-mono">{s.base_stat}</span>
    </li>
  {/each}
</ul>

      <!-- pokemon's abilities -->
      <h3 class="font-semibold mt-4">Abilities:</h3>
      <ul class="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
        {#each pokemon.abilities.slice(0,10) as b}
          <li >{b.ability.name}</li>
        {/each}
      </ul>

    </div>
  {/if}
</div>




