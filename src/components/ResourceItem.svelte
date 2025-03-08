<script>
  const { file } = $props();
  import Modal from './Modal.svelte';
  import FileDeleteModal from './FileDeleteModal.svelte';
  import { isModalVisible } from "../services/shared.js";
  import { onMount } from 'svelte';
  import PdfViewer from 'svelte-pdf';
  
  let viewerModalOpen = $state(false);
  let fileUrl = $state('');
  let fileType = $state('');
  let fileContent = $state(null);
  
  // Nuevo: modal para visualizar/editar contenido simple
  let contentViewerOpen = $state(false);
  
  // Función para descargar archivos
  async function downloadFile(url, filename) {
    console.log('Intentando descargar:', url, filename);
    
    // Verificar si la URL es válida
    if (!url) {
      console.error('URL no válida para descarga');
      return;
    }
    
    try {
      // Asegurar que la URL sea absoluta
      if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
        // Si es una URL relativa, convertirla a absoluta
        url = new URL(url, window.location.origin).href;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename || 'archivo_descargado';
      document.body.appendChild(a);
      a.click();
      
      // Limpiar
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
    }
  }
  
  // Función para extraer la extensión de un archivo
  function getFileExtension(url) {
    if (!url) return '';
    const parts = url.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  }
  
  // Función para manejar el clic en un recurso
  function handlefileClick(event) {
    if (file.file_type !== 'article' && file.content_type === 'file' && file.content) {
      event.preventDefault();
      event.stopPropagation(); 
      downloadFile(file.content, `${file.title}.${getFileExtension(file.content)}`);
    }
  }
  
  // Función para visualizar el archivo
  async function viewFile(url) {
    if (!url) return;
    
    try {
      // Asegurar que la URL sea absoluta
      if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
        url = new URL(url, window.location.origin).href;
      }
      
      const ext = getFileExtension(url);
      fileType = ext;
      fileUrl = url;
      
      // Para archivos de texto, intentar cargar el contenido
      if (['txt', 'json', 'xml', 'html', 'css', 'js', 'md'].includes(ext)) {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        fileContent = await response.text();
      } else {
        fileContent = null;
      }
      
      viewerModalOpen = true;
    } catch (error) {
      console.error('Error al visualizar el archivo:', error);
    }
  }
  
  function closeViewerModal() {
    viewerModalOpen = false;
    fileUrl = '';
    fileType = '';
    fileContent = null;
  }
  
  // Nuevo: función para abrir el visor de contenido
  function openContentViewer() {
    contentViewerOpen = true;
  }
  
  // Nuevo: función para cerrar el visor de contenido
  function closeContentViewer() {
    contentViewerOpen = false;
  }
  
  function handleDelete() {
    isModalVisible.set({ [file.id]: true });
  }
  
  function canPreview(fileType) {
    const previewableTypes = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'svg', 'txt', 'json', 'xml', 'html', 'css', 'js', 'md'];
    return previewableTypes.includes(fileType.toLowerCase());
  }
</script>

<div class="flex items-center p-3 bg-white dark:bg-primary-800 rounded-lg border border-primary-200 dark:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-700/70 transition-colors" 
     role="button" 
     on:click={handlefileClick}>
  <div class="flex-shrink-0 {
    file.file_type === 'pdf' ? 'text-red-500' : 
    file.file_type === 'doc' ? 'text-blue-500' : 
    file.file_type === 'note' ? 'text-yellow-500' : 
    'text-indigo-500'
  }">
    <span class="material-symbols-outlined">
      {file.file_type === 'pdf' ? 'picture_as_pdf' : 
       file.file_type === 'doc' ? 'description' : 
       file.file_type === 'note' ? 'sticky_note_2' : 'article'}
    </span>
  </div>
  
  <div class="ml-3 flex-1 min-w-0">
    <!-- Título con extensión al lado -->
    <div class="flex items-center gap-1.5">
      <h3 class="text-sm font-medium text-primary-800 dark:text-primary-200 truncate">{file.title}</h3>
      {#if file.content_type === 'file' && file.content}
        <span class="bg-primary-100 dark:bg-primary-700 px-1.5 py-0.5 rounded text-[10px] font-medium flex-shrink-0">
          {getFileExtension(file.content)}
        </span>
      {/if}
    </div>
    
    <!-- Información de tamaño y fecha -->
    <p class="text-xs text-primary-500 dark:text-primary-400 flex items-center mt-0.5">
      {#if file.size_bytes}
        <span class="mr-2">{Math.round(file.size_bytes / 1024)} KB</span>
      {/if}
      <span>{new Date(file.created_at).toLocaleDateString()}</span>
    </p>
    
    <!-- Tags debajo del tamaño y fecha -->
    {#if file.tags && file.tags.length > 0}
      <div class="mt-1 flex flex-wrap gap-1">
        {#each file.tags as tag}
          <span class="bg-accent-500/10 text-accent-500 px-2 py-0.5 rounded-full text-[10px] flex items-center">
            <span class="material-symbols-outlined text-[10px] mr-0.5">tag</span>
            {tag}
          </span>
        {/each}
      </div>
    {/if}
  </div>
  
  <!-- Botones que se reorganizan en pantallas pequeñas -->
  <div class="flex-shrink-0 flex flex-col xs:flex-row space-y-1 xs:space-y-0 xs:space-x-1 max-[375px]:mt-1">
    {#if file.content_type === 'file' && file.content}
      {#if canPreview(getFileExtension(file.content))}
        <button class="text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-200 p-1.5 rounded-full hover:bg-primary-200 dark:hover:bg-primary-600 transition-colors"
                aria-label="Visualizar archivo"
                title="Visualizar archivo"
                on:click|preventDefault|stopPropagation={(e) => {
                  if (file.content) {
                    viewFile(file.content);
                  }
                }}>
          <span class="material-symbols-outlined text-sm">visibility</span>
        </button>
      {/if}
      <button class="text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-200 p-1.5 rounded-full hover:bg-primary-200 dark:hover:bg-primary-600 transition-colors"
              aria-label="Descargar archivo"
              title="Descargar archivo"
              on:click|preventDefault|stopPropagation={(e) => {
                if (file.content) {
                  downloadFile(file.content, `${file.title}.${getFileExtension(file.content)}`);
                }
              }}>
        <span class="material-symbols-outlined text-sm">download</span>
      </button>
    {:else}
      <button class="text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-200 p-1.5 rounded-full hover:bg-primary-200 dark:hover:bg-primary-600 transition-colors"
              aria-label="Editar archivo"
              title="Editar archivo"
              on:click|preventDefault|stopPropagation={openContentViewer}>
        <span class="material-symbols-outlined text-sm">edit</span>
      </button>
    {/if}
    
    <button class="text-primary-500 dark:text-primary-400 dark:hover:text-red-400 p-1.5 rounded-full hover:bg-primary-200 dark:hover:bg-primary-600 transition-colors"
            aria-label="Eliminar archivo"
            title="Eliminar archivo"
            on:click|preventDefault|stopPropagation={handleDelete}>
      <span class="material-symbols-outlined text-sm text-red-500">delete</span>
    </button>
  </div>
</div>

<!-- Modal para visualizar archivos -->
{#if viewerModalOpen}
  <div class="fixed inset-0 z-50 overflow-auto bg-primary-900/80 flex justify-center items-center p-4" on:click={closeViewerModal}>
    <div class="bg-white dark:bg-primary-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden" on:click|stopPropagation>
      <div class="p-4 border-b border-primary-200 dark:border-primary-700 flex justify-between items-center">
        <h3 class="text-lg font-medium text-primary-800 dark:text-primary-200">
          {file.title}.{fileType}
        </h3>
        <button class="text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-200" on:click={closeViewerModal}>
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      
      <div class="flex-1 overflow-auto p-4">
        {#if fileType === 'pdf'}
          <div class="flex flex-col items-center h-full">
            <PdfViewer url={fileUrl} showButtons={["navigation", "zoom", "print", "rotate", "download"]} />
          </div>
        {:else if ['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(fileType.toLowerCase())}
          <div class="flex justify-center">
            <img src={fileUrl} alt={file.title} class="max-w-full max-h-[70vh] object-contain" />
          </div>
        {:else if fileContent !== null}
          <pre class="whitespace-pre-wrap bg-primary-50 dark:bg-primary-900 p-4 rounded overflow-auto max-h-[70vh] text-sm font-mono">{fileContent}</pre>
        {:else}
          <div class="flex items-center justify-center h-64">
            <p class="text-primary-500 dark:text-primary-400">
              Este tipo de archivo no se puede previsualizar en el navegador.
            </p>
          </div>
        {/if}
      </div>
      
      <div class="p-4 border-t border-primary-200 dark:border-primary-700 flex justify-end">
        <button 
          class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
          on:click={() => downloadFile(fileUrl, `${file.title}.${fileType}`)}>
          <span class="flex items-center">
            <span class="material-symbols-outlined mr-1">download</span>
            Descargar
          </span>
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Nuevo: Modal para visualizar contenido simple -->
{#if contentViewerOpen}
  <div class="fixed inset-0 z-50 overflow-auto bg-primary-900/80 flex justify-center items-center p-4" on:click={closeContentViewer}>
    <div class="bg-white dark:bg-primary-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden" on:click|stopPropagation>
      <div class="p-4 border-b border-primary-200 dark:border-primary-700 flex justify-between items-center">
        <h3 class="text-lg font-medium text-primary-800 dark:text-primary-200">
          {file.title}
        </h3>
        <button class="text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-200" on:click={closeContentViewer}>
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      
      <div class="flex-1 overflow-auto p-6">
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-1">{file.title}</h2>
          <div class="text-sm text-primary-500 dark:text-primary-400 mb-4">
            Fecha: {new Date(file.created_at).toLocaleDateString()} · 
            Tipo: {file.file_type}
            {#if file.tags && file.tags.length > 0}
              <div class="mt-2 flex flex-wrap gap-1">
                {#each file.tags as tag}
                  <span class="bg-accent-500/10 text-accent-500 px-2 py-0.5 rounded-full text-xs flex items-center">
                    <span class="material-symbols-outlined text-[10px] mr-0.5">tag</span>
                    {tag}
                  </span>
                {/each}
              </div>
            {/if}
          </div>
          <div class="bg-primary-50 dark:bg-primary-900 p-4 rounded-lg">
            <div class="prose dark:prose-invert max-w-none">
              <p>{file.content || 'No hay contenido disponible'}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="p-4 border-t border-primary-200 dark:border-primary-700 flex justify-end gap-2">
        <button 
          class="px-4 py-2 border border-primary-300 dark:border-primary-600 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-700/50"
          on:click={closeContentViewer}>
          <span class="flex items-center">
            Cerrar
          </span>
        </button>
        <button 
          class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
          on:click={closeContentViewer}>
          <span class="flex items-center">
            <span class="material-symbols-outlined mr-1">edit</span>
            Editar
          </span>
        </button>
      </div>
    </div>
  </div>
{/if}

<Modal id={file.id}>
 <FileDeleteModal {file} />
</Modal>
