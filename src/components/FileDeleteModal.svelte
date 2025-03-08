<script>
  let { file } = $props();
  import { deleteFile } from '../services/fileServices.ts';
  import { isModalVisible, resources } from "../services/shared.js";

  let loading = $state(false);

  const handleDelete = async (e) => {
    if (loading) return; // Evita múltiples peticiones
    loading = true;
    const state = await deleteFile(file.id);
    $resources = $resources.filter(item => item.id !== file.id);
    isModalVisible.set({ [file.id]: false });
    if (state) {
      loading = false;
    }
  }

  // Función para obtener la extensión del archivo
  function getFileExtension(url) {
    if (!url) return '';
    const parts = url.split('.');
    return parts[parts.length - 1].toLowerCase();
  }

  // Formatear el tamaño del archivo
  function formatFileSize(bytes) {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }

  // Obtener la fecha formateada
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  // Determinar el icono basado en el tipo de archivo
  function getFileIcon(fileType) {
    switch(fileType) {
      case 'pdf': return 'picture_as_pdf';
      case 'doc': return 'description';
      case 'note': return 'sticky_note_2';
      case 'article': return 'article';
      default: return 'insert_drive_file';
    }
  }

  // Determinar el color del icono
  function getFileIconColor(fileType) {
    switch(fileType) {
      case 'pdf': return 'text-red-500';
      case 'doc': return 'text-blue-500';
      case 'note': return 'text-yellow-500';
      case 'article': return 'text-indigo-500';
      default: return 'text-gray-500';
    }
  }
</script>

<div class="modal-header p-4 border-b border-primary-200 dark:border-primary-700 flex justify-between items-center">
  <h2 class="font-semibold text-lg text-primary-900 dark:text-white">
    Eliminar {file.content_type === 'file' ? 'archivo' : 'texto'}
  </h2>
  <button class="modal-close text-primary-500 hover:text-primary-700 dark:hover:text-primary-300" disabled={loading}>
    <span class="material-symbols-outlined pointer-events-none">close</span>
  </button>
</div>

<div class="modal-body p-4">
  <!-- Información del elemento a eliminar -->
  <div class="bg-primary-50 dark:bg-primary-800/50 p-4 rounded-lg mb-4 border border-primary-200 dark:border-primary-700">
    <div class="flex items-start">
      <!-- Icono del tipo de archivo -->
      <div class="flex-shrink-0 {getFileIconColor(file.file_type)} p-3 bg-white dark:bg-primary-700 rounded-lg shadow-sm">
        <span class="material-symbols-outlined text-2xl">
          {getFileIcon(file.file_type)}
        </span>
      </div>
      
      <!-- Detalles del archivo -->
      <div class="ml-4 flex-1">
        <div class="flex items-center gap-1.5">
          <h3 class="text-base font-semibold text-primary-900 dark:text-white">{file.title}</h3>
          {#if file.content_type === 'file' && file.content}
            <span class="bg-primary-200 dark:bg-primary-700 px-2 py-0.5 rounded text-xs font-medium uppercase">
              {getFileExtension(file.content)}
            </span>
          {/if}
        </div>
        
        <div class="mt-1 text-sm text-primary-600 dark:text-primary-300 flex flex-col sm:flex-row sm:gap-4">
          {#if file.size_bytes}
            <div class="flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">sd_card</span>
              <span>{formatFileSize(file.size_bytes)}</span>
            </div>
          {/if}
          
          <div class="flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">calendar_today</span>
            <span>Creado: {formatDate(file.created_at)}</span>
          </div>
          
          <div class="flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">
              {file.content_type === 'file' ? 'file_present' : 'text_snippet'}
            </span>
            <span>{file.content_type === 'file' ? 'Archivo' : 'Texto'}</span>
          </div>
        </div>
        
        {#if file.description}
          <p class="mt-2 text-sm text-primary-600 dark:text-primary-400 italic">
            "{file.description}"
          </p>
        {/if}
      </div>
    </div>
  </div>
  
  <!-- Mensaje de advertencia -->
  <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
    <div class="flex items-start">
      <div class="flex-shrink-0 text-red-500">
        <span class="material-symbols-outlined">warning</span>
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-red-800 dark:text-red-300">¡Atención! Esta acción no se puede deshacer</h3>
        <div class="mt-2 text-sm text-red-700 dark:text-red-400">
          <p>
            {#if file.content_type === 'file'}
              Este archivo será eliminado permanentemente del sistema y no podrá ser recuperado.
            {:else}
              Este texto será eliminado permanentemente del sistema y no podrá ser recuperado.
            {/if}
          </p>
        </div>
      </div>
    </div>
  </div>
  
  <div id="delete-feedback" class="mt-3 p-3 rounded-md hidden"></div>
</div>

<div class="modal-footer p-4 border-t border-primary-200 dark:border-primary-700 flex justify-end">
  <button 
    class="modal-close px-4 py-2 border border-primary-300 dark:border-primary-700 rounded-md text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors mr-2" 
    disabled={loading}>
    Cancelar
  </button>
  <button
    class="px-4 py-2 bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-red-300 dark:focus:ring-red-700 text-white rounded-md transition-colors flex items-center justify-center gap-2"
    on:click={handleDelete}
    disabled={loading}>
    {#if loading}
      <div class="w-5 h-5 border-3 border-t-transparent border-white rounded-full animate-spin"></div>
      <span>Eliminando...</span>
    {:else}
      <span class="material-symbols-outlined text-sm">delete</span>
      <span>Eliminar {file.content_type === 'file' ? 'archivo' : 'texto'}</span>
    {/if}
  </button>
</div>
