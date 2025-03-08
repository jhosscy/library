<script>
  let { title, id } = $props();
  import { deleteSubject } from '../services/subjectServices.ts';

  let loading = $state(false);

  const handleDelete = async (e) => {
    if (loading) return; // Evita múltiples peticiones
    loading = true;
    const state = await deleteSubject(id);
    loading = false;
    e.target.dispatchEvent(new CustomEvent('close-modal', { bubbles: true }));
    if (state) {
      window.location.href = '/';
    }
  }
</script>

<div class="modal-header p-4 border-b border-primary-200 dark:border-primary-700 flex justify-between items-center">
  <h2 class="font-semibold text-lg text-primary-900 dark:text-white">Eliminar materia</h2>
  <button class="modal-close text-primary-500 hover:text-primary-700 dark:hover:text-primary-300" disabled={loading}>
    <span class="material-symbols-outlined pointer-events-none">close</span>
  </button>
</div>
<div class="modal-body p-4">
  <p class="text-primary-700 dark:text-primary-300">
    ¿Estás seguro de que deseas eliminar <span class="font-medium">{title}</span>? Esta acción no se puede deshacer y se perderán todos los archivos asociados.
  </p>
  <div id="delete-feedback" class="mt-3 p-3 rounded-md hidden"></div>
</div>
<div class="modal-footer p-4 border-t border-primary-200 dark:border-primary-700 flex justify-end">
  <button class="modal-close px-4 py-2 border border-primary-300 dark:border-primary-700 rounded-md text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors mr-2" disabled={loading}>
    Cancelar
  </button>
  <button
    class="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded-md transition-colors flex items-center justify-center"
    on:click={handleDelete}
    disabled={loading}>
    {#if loading}
      <div class="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
    {:else}
      Eliminar
    {/if}
  </button>
</div>
