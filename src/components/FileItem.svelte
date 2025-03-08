<script>
  const { file } = $props();
  
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
</script>

<div class="flex items-center p-3 hover:bg-primary-50 dark:hover:bg-primary-700/70 transition-colors" 
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
    <h3 class="text-sm font-medium text-primary-800 dark:text-primary-200 truncate">{file.title}</h3>
    <p class="text-xs text-primary-500 dark:text-primary-400 flex items-center flex-wrap">
      {#if file.size_bytes}
        <span class="mr-2">{Math.round(file.size_bytes / 1024)} KB</span>
      {/if}
      <span class="mr-2">{new Date(file.created_at).toLocaleDateString()}</span>
      {#if file.content_type === 'file' && file.content}
        <span class="bg-primary-100 dark:bg-primary-700 px-1.5 py-0.5 rounded text-[10px] font-medium">
          {getFileExtension(file.content)}
        </span>
      {/if}
      {#if file.tags && file.tags.length > 0}
        <span class="ml-1 inline-flex gap-1">
          {#each file.tags as tag}
            <span class="bg-primary-100 dark:bg-primary-700/70 text-primary-600 dark:text-primary-300 px-1.5 py-0.5 rounded text-[10px]">
              #{tag}
            </span>
          {/each}
        </span>
      {/if}
    </p>
  </div>
  
  {#if file.file_type !== 'article' && file.content_type === 'file' && file.content}
    <div class="flex-shrink-0">
      <button class="text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-200 p-1.5 rounded-full hover:bg-primary-200 dark:hover:bg-primary-600 transition-colors"
              aria-label="Descargar archivo"
              on:click|preventDefault|stopPropagation={(e) => {
                if (file.content) {
                  downloadFile(file.content, `${file.title}.${getFileExtension(file.content)}`);
                }
              }}>
        <span class="material-symbols-outlined text-sm">download</span>
      </button>
    </div>
  {/if}
</div>
