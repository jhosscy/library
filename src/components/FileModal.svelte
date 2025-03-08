<script>
  let { semesters, subjects, tags: allTags } = $props();
  import { uploadFile } from '../services/fileServices.ts';
  import { semesters as semestersData, resources } from "../services/shared.js";

  // Extraer nombres de los tags
  const allTagNames = allTags.map(tag => tag.name);

  let isSemesterRoute = $state();
  // Estados reactivos
  let loading = $state(false);
  let title = "";
  let description = "";
  let tags = $state("");
  let selectedSubject = $state("");
  let selectedSemester = $state("");
  let feedbackHtml = $state("");
  let feedbackClass = $state("hidden");
  
  // Variable para almacenar el archivo seleccionado
  let fileToUpload = $state(null);

  // Manejo de tags
  let selectedTags = $state([]);
  let availableTagsList = $state([...allTagNames]);
  let showTagMenu = $state(false);
  let currentTagInput = $derived(tags.split(',').pop().trim());
  let filteredTags = $derived(
    availableTagsList.filter(tag =>
      tag.toLowerCase().startsWith(currentTagInput.toLowerCase())
    )
  );
  let availableSemesters = $derived.by(() => {
    const subjectObj = subjects.find(s => s.id == selectedSubject);
    return subjectObj && subjectObj.semesters && subjectObj.semesters.length > 0
      ? subjectObj.semesters
      : semesters;
  });

  // Variable para almacenar los metadatos del archivo subido
  let uploadedFile = $state(null);

  // Función para formatear el tamaño del archivo
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Función para obtener el icono basado en la extensión del archivo
  function getFileIcon(fileName) {
    const extension = fileName.split('.').pop().toLowerCase();
    
    // Mapeo de extensiones a iconos
    const iconMap = {
      'pdf': 'picture_as_pdf',
      'doc': 'description',
      'docx': 'description',
      'xls': 'table_chart',
      'xlsx': 'table_chart',
      'ppt': 'slideshow',
      'pptx': 'slideshow',
      'jpg': 'image',
      'jpeg': 'image',
      'png': 'image',
      'gif': 'image',
      'txt': 'text_snippet',
      'zip': 'folder_zip',
      'rar': 'folder_zip'
    };
    
    return iconMap[extension] || 'insert_drive_file';
  }

  // Acción para detectar clicks fuera del nodo (para ocultar el menú de sugerencias)
  function clickOutside(node) {
    const handleClick = event => {
      if (!node.contains(event.target)) {
        showTagMenu = false;
      }
    }
    document.addEventListener('click', handleClick, true);
    return {
      destroy() {
        document.removeEventListener('click', handleClick, true);
      }
    }
  }

  // Manejadores para el input de tags
  function onTagsInput(event) {
    tags = event.target.value;
    if (!tags.trim()) {
      selectedTags = [];
      availableTagsList = [...allTagNames];
      showTagMenu = false;
      return;
    }
    showTagMenu = filteredTags.length > 0;
  }
  
  function handleTagKeyDown(event) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      const newTag = currentTagInput;
      if (!newTag) return;
      if (selectedTags.includes(newTag)) {
         feedbackHtml = 'No se pueden agregar tags duplicados.';
         feedbackClass = 'mb-4 bg-yellow-100 text-yellow-600 border border-yellow-300 p-2 rounded-md';
         return;
      }
      selectedTags = [...selectedTags, newTag];
      availableTagsList = allTagNames.filter(tag => !selectedTags.includes(tag));
      tags = selectedTags.join(', ') + ', ';
      showTagMenu = false;
    }
  }
  
  function selectTag(tag) {
    if (selectedTags.includes(tag)) {
      feedbackHtml = 'No se pueden agregar tags duplicados.';
      feedbackClass = 'mb-4 bg-yellow-100 text-yellow-600 border border-yellow-300 p-2 rounded-md';
      return;
    }
    selectedTags = [...selectedTags, tag];
    availableTagsList = availableTagsList.filter(t => t !== tag);
    tags = selectedTags.join(', ') + ', ';
    showTagMenu = false;
  }
  
  function removeTag(tagToRemove) {
    selectedTags = selectedTags.filter(tag => tag !== tagToRemove);
    availableTagsList = allTagNames.filter(tag => !selectedTags.includes(tag));
    tags = selectedTags.join(', ') + (selectedTags.length ? ', ' : '');
  }

  // Función para manejar la selección del archivo.
  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
      fileToUpload = file;
      uploadedFile = {
         name: file.name,
         size: file.size,
         type: file.type,
      };
    }
  }
  
  // Función para disparar el input file oculto al hacer clic en la zona de subir archivos
  function triggerFileInput() {
    document.getElementById('fileInput').click();
  }

  // Función para validar y publicar el archivo.
  async function publishFileHandler(e) {
    feedbackClass = "flex items-center justify-center mb-4 p-3 rounded-md";
    feedbackHtml = `<div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-600"></div><span class="ml-2">Subiendo archivo...</span>`;

    if (title && !title.trim()) {
      feedbackHtml = 'El título no debe estar compuesto solo por espacios en blanco.';
      feedbackClass = 'mb-4 bg-yellow-100 text-yellow-600 border border-yellow-300 p-2 rounded-md';
      return;
    }

    const errors = [];
    if (!title.trim()) {
      errors.push('Debes ingresar el título del archivo.');
    }
    if (!selectedSubject) {
      errors.push('Debes seleccionar una materia.');
    }
    if (!selectedSemester) {
      errors.push('Debes seleccionar un semestre.');
    }
    if (!uploadedFile) {
      errors.push('Debes subir un archivo.');
    }
    if (errors.length > 0) {
      feedbackHtml = errors.join('<br>');
      feedbackClass = 'mb-4 bg-red-100 text-red-600 border border-red-300 p-2 rounded-md';
      return;
    }

    loading = true;

    const fileData = {
      title: title.trim(),
      description: description.trim() || null,
      subject_id: Number(selectedSubject),
      semester_id: Number(selectedSemester),
      tags: selectedTags
    };

    try {
      const fileResponse = await uploadFile(fileToUpload, fileData);
      if (isSemesterRoute) {
        $resources.push(fileResponse)
      } else {
        const semesterIndex = $semestersData.findIndex(
          semester => semester.id === fileResponse.semester_id
        );
        if (semesterIndex !== -1) {
          $semestersData[semesterIndex].files.push(fileResponse);
        }
      }
      loading = false;
      
      if (fileResponse) {
        feedbackHtml = 'Archivo subido exitosamente.';
        feedbackClass = 'mb-4 bg-emerald-100 text-emerald-600 border border-emerald-300 p-2 rounded-md';
        e.target.dispatchEvent(new CustomEvent('close-modal', { bubbles: true }));
      } else {
        feedbackHtml = 'Error al subir el archivo. Intenta de nuevo.';
        feedbackClass = 'mb-4 bg-red-100 text-red-600 border border-red-300 p-2 rounded-md';
      }
    } catch (error) {
      loading = false;
      console.error('Error al subir el archivo:', error);
      feedbackHtml = 'Error al subir el archivo: ' + (error.message || 'Intenta de nuevo.');
      feedbackClass = 'mb-4 bg-red-100 text-red-600 border border-red-300 p-2 rounded-md';
    }
  }

  $effect(() => {
    if (new URL(window.location.href).pathname.includes("/semester")) {
      isSemesterRoute = true;
    } else {
      isSemesterRoute = false;
    };
    // Si hay solo un subject, seleccionarlo automáticamente
    if (subjects.length === 1) {
      selectedSubject = subjects[0].id.toString();
    }
    
    // Si hay solo un semestre, seleccionarlo automáticamente
    if (semesters.length === 1) {
      selectedSemester = semesters[0].id.toString();
    }
  });
</script>

<div class="modal-header p-4 border-b border-primary-200 dark:border-primary-700 flex justify-between items-center">
  <h2 class="font-semibold text-lg text-primary-900 dark:text-white">Subir archivos</h2>
  <button class="modal-close text-primary-500 hover:text-primary-700 dark:hover:text-primary-300">
    <span class="material-symbols-outlined pointer-events-none">close</span>
  </button>
</div>

<div class="modal-body p-4 overflow-y-auto">
  <div class="mb-4">
    <label class="block text-sm text-primary-700 dark:text-primary-300 mb-2">Título</label>
    <input
      type="text"
      placeholder="Ingrese un título"
      class="w-full px-3 py-2 bg-white dark:bg-primary-900 border border-primary-300 dark:border-primary-700 rounded-md focus:outline-none focus:ring-1 focus:ring-accent-500"
      bind:value={title} />
  </div>
  <div class="mb-4">
    <label class="block text-sm text-primary-700 dark:text-primary-300 mb-2">Descripción (opcional)</label>
    <textarea
      placeholder="Breve descripción del archivo"
      rows="2"
      class="w-full px-3 py-2 bg-white dark:bg-primary-900 border border-primary-300 dark:border-primary-700 rounded-md focus:outline-none focus:ring-1 focus:ring-accent-500"
      bind:value={description}></textarea>
  </div>
  <!-- Sección de tags -->
  <div class="mb-4 relative" use:clickOutside>
    <label class="block text-sm text-primary-700 dark:text-primary-300 mb-2">Tags (separados por comas)</label>
    <input
      type="text"
      placeholder="ej: importante, examen, tarea"
      class="w-full px-3 py-2 bg-white dark:bg-primary-900 border border-primary-300 dark:border-primary-700 rounded-md focus:outline-none focus:ring-1 focus:ring-accent-500"
      bind:value={tags}
      on:input={onTagsInput}
      on:keydown={handleTagKeyDown}
      on:focus={() => showTagMenu = filteredTags.length > 0} />
    {#if showTagMenu && filteredTags.length > 0}
      <div class="absolute z-10 mt-1 w-full bg-white dark:bg-primary-900 border border-primary-300 dark:border-primary-700 rounded-md shadow-lg">
        <ul>
          {#each filteredTags as tag}
            <li class="px-3 py-2 hover:bg-primary-100 dark:hover:bg-primary-800 cursor-pointer"
                on:click={() => selectTag(tag)}>
              {tag}
            </li>
          {/each}
        </ul>
      </div>
    {/if}
    {#if selectedTags.length > 0}
      <div class="flex flex-wrap mt-2">
        {#each selectedTags as tag (tag)}
          <div class="flex items-center bg-primary-100 dark:bg-primary-800 text-primary-900 dark:text-white rounded-full px-3 py-1 mr-2 mb-2">
            <span>{tag}</span>
            <button type="button" class="ml-2 text-xs" on:click={() => removeTag(tag)}>x</button>
          </div>
        {/each}
      </div>
    {/if}
  </div>
  <!-- Selección de materia y semestre -->
  <div class="mb-4">
    <label class="block text-sm text-primary-700 dark:text-primary-300 mb-2">Seleccionar materia</label>
    <select
      class="w-full px-3 py-2 bg-white dark:bg-primary-900 border border-primary-300 dark:border-primary-700 rounded-md focus:outline-none focus:ring-1 focus:ring-accent-500"
      bind:value={selectedSubject}>
      <option value="">Seleccione una materia</option>
      {#each subjects as subject}
        <option value={subject.id}>{subject.title}</option>
      {/each}
    </select>
  </div>
  <div class="mb-4">
    <label class="block text-sm text-primary-700 dark:text-primary-300 mb-2">Seleccionar semestre</label>
    <select
      class="w-full px-3 py-2 bg-white dark:bg-primary-900 border border-primary-300 dark:border-primary-700 rounded-md focus:outline-none focus:ring-1 focus:ring-accent-500"
      bind:value={selectedSemester}>
      <option value="">Seleccione un semestre</option>
      {#each availableSemesters as semester}
        <option value={semester.id}>{semester.semester_name}</option>
      {/each}
    </select>
  </div>
  <!-- Zona de subida de archivos - Mejorada para nombres largos -->
  <div class="mb-4">
    <label class="block text-sm text-primary-700 dark:text-primary-300 mb-2">Subir archivo</label>
    <!-- Input file oculto -->
    <input type="file" id="fileInput" on:change={handleFileSelect} style="display: none;" />
    <!-- Zona de upload -->
    <div class="upload-zone w-full border-2 border-dashed border-primary-300 dark:border-primary-700 rounded-lg p-4 text-center transition-colors hover:border-accent-500 dark:hover:border-accent-500 cursor-pointer"
         on:click={triggerFileInput}>
      {#if !uploadedFile}
        <div class="flex flex-col items-center justify-center py-4">
          <div class="mb-2 text-primary-400 dark:text-primary-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 class="text-base font-medium text-primary-700 dark:text-primary-300 mb-1">Subir archivo</h3>
          <p class="text-sm text-primary-500 dark:text-primary-400">Arrastra el archivo aquí o haz clic para buscar</p>
        </div>
      {:else}
        <div class="flex flex-col items-center justify-center py-4">
          <div class="file-preview bg-primary-50 dark:bg-primary-800 rounded-lg p-4 w-full max-w-md mx-auto">
            <div class="flex items-start">
              <!-- Icono del archivo basado en la extensión -->
              <div class="flex-shrink-0 bg-accent-500 text-white rounded-lg pt-3 pb-1 px-4 mr-4">
                <span class="material-symbols-outlined text-3xl">{getFileIcon(uploadedFile.name)}</span>
              </div>
              <!-- Información del archivo con soporte para texto largo -->
              <div class="flex-grow text-left overflow-hidden">
                <div class="overflow-x-auto pb-2 max-w-[200px] sm:max-w-[250px] md:max-w-[300px]">
                  <h4 class="font-semibold text-primary-900 dark:text-white text-lg mb-1 whitespace-nowrap">{uploadedFile.name}</h4>
                </div>
                <p class="text-primary-600 dark:text-primary-400 text-sm">{formatFileSize(uploadedFile.size)}</p>
              </div>
              <!-- Botón para cambiar el archivo -->
              <button type="button" class="flex-shrink-0 ml-2 text-primary-500 hover:text-primary-700 dark:hover:text-primary-300" on:click={(e) => {
                e.stopPropagation();
                triggerFileInput();
              }}>
                <span class="material-symbols-outlined">edit</span>
              </button>
            </div>
          </div>
          <p class="mt-3 text-sm text-primary-500 dark:text-primary-400">Haz clic para cambiar el archivo</p>
        </div>
      {/if}
    </div>
  </div>
</div>

<div class={feedbackClass}>
  {@html feedbackHtml}
</div>

<div class="modal-footer p-4 border-t border-primary-200 dark:border-primary-700 flex justify-end">
  <button class="modal-close px-4 py-2 border border-primary-300 dark:border-primary-700 rounded-md text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors mr-2">
    Cancelar
  </button>
  <button
    type="button"
    class="px-4 py-2 bg-accent-500 hover:bg-accent-700 text-white rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
    disabled={loading}
    on:click={publishFileHandler}>
    Subir
  </button>
</div>
