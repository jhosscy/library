<script>
  let { files } = $props();
  import ResourceItem from './ResourceItem.svelte'
  import { resources } from "../services/shared.js";
  $resources = files;
</script>

{#each $resources as file}
  <ResourceItem {file} />
{/each}
