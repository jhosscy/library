<script>
  let { semesters: datas, subject, id } = $props();
  import FileItem from './FileItem.svelte';
  import { semesters } from "../services/shared.js";
  $semesters = datas;
</script>

{#each $semesters as semester}
  <div class="mb-8">
    {#if semester.files.length > 0}
      <a href={`/subject/${subject}/semester/${semester.semester_name}-${semester.id}-${id}`} class="block">
        <div class="semester-header flex items-center justify-between mb-3 p-2 rounded-md cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-800/60 transition-colors">
          <div class="flex items-center">
            <div class="flex items-center justify-center w-7 h-7 rounded-full bg-accent-500/10 text-accent-500 font-medium text-sm mr-2">
              {semester.semester_name.split(' ')[1]}
            </div>
            <h2 class="text-lg font-medium text-primary-900 dark:text-white">{semester.semester_name}</h2>
          </div>
          <span class="text-primary-500 pt-2 dark:text-primary-400">
            <span class="material-symbols-outlined">arrow_forward</span>
          </span>
        </div>
      </a>
    {:else}
      <div class="block cursor-default">
        <div class="semester-header flex items-center justify-between mb-3 p-2 rounded-md opacity-60 transition-colors">
          <div class="flex items-center">
            <div class="flex items-center justify-center w-7 h-7 rounded-full bg-primary-200/80 dark:bg-primary-700/50 text-primary-500 dark:text-primary-400 font-medium text-sm mr-2">
              {semester.semester_name.split(' ')[1]}
            </div>
            <h2 class="text-lg font-medium text-primary-900 dark:text-white">{semester.semester_name}</h2>
            <span class="ml-2 text-xs text-primary-500 dark:text-primary-400 py-1 px-2 bg-primary-100 dark:bg-primary-700 rounded-md">
              Vacío
            </span>
          </div>
        </div>
      </div>
    {/if}

    {#if semester.files.length > 0}
      <div class="bg-white dark:bg-primary-800 rounded-lg border border-primary-200 dark:border-primary-700 divide-y divide-primary-200 dark:divide-primary-700 overflow-hidden relative">
        {#each semester.files.slice(0, 3) as file}
          <FileItem file={file} />
        {/each}
        
        {#if semester.files.length > 3}
          <a href={`/subject/${subject}/semester/${semester.semester_name}-${semester.id}-${id}`} 
             class="block text-center py-2 text-sm text-accent-600 dark:text-accent-400 hover:bg-primary-50 dark:hover:bg-primary-700/70 font-medium transition-colors">
            <div class="flex items-center justify-center">
              <span>Ver más archivos</span>
              <span class="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
            </div>
          </a>
        {/if}
      </div>
    {/if}
  </div>
{/each}
