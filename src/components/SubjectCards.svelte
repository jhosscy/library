<script>
  let { datas } = $props();
  import { subjects } from "../services/shared.js";
  $subjects = datas;
</script>

{#each $subjects as { id, title, icon, color }}
  <a href={`/subject/${title}-${id}`} class="subject-card bg-white dark:bg-primary-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-primary-200 dark:border-primary-700">
    <div class={`${color} h-2`}></div>
    <div class="p-4">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <h3 class="font-medium text-lg text-primary-900 dark:text-white">{title}</h3>
          <p class="text-primary-500 dark:text-primary-400 text-sm">0 recursos</p>
        </div>
        <div class={`${color.replace('bg-', 'text-')} rounded-full p-2 bg-opacity-10`}>
          <span class="material-symbols-outlined">{icon}</span>
        </div>
      </div>
    </div>
  </a>
{/each}
