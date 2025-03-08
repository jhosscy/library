<script>
  let { semesters, subjects, tags: allTags } = $props();
  import { createArticleFile } from '../services/fileServices.ts';
  import { semesters as semestersData, resources } from "../services/shared.js";

  // Extraemos todos los nombres de tags de la prop original
  const allTagNames = allTags.map(tag => tag.name);

  let isSemesterRoute = $state();

  // Variables reactivas con $state para que sean profundamente reactivas
  let loading = $state(false);
  let title = "";
  let description = "";
  let tags = $state(""); // Representa el contenido del input de tags (string)
  let selectedSubject = $state("");  // Ahora es un estado reactivo
  let selectedSemester = $state("");
  let content = "";

  let feedbackHtml = $state("");
  let feedbackClass = $state("hidden");

  // Variables para el manejo de tags, simplificado: solo guardamos strings
  let selectedTags = $state([]); // Array de strings con los nombres de tags seleccionados
  let availableTagsList = $state([...allTagNames]); // Array de strings con los nombres disponibles

  // Variable local para controlar la visibilidad del menú de sugerencias
  let showTagMenu = $state(false);

  // Estado derivado: obtiene el fragmento actual escrito (después de la última coma)
  let currentTagInput = $derived(tags.split(',').pop().trim());

  // Estado derivado: filtra los tags disponibles según el input actual
  let filteredTags = $derived(
    availableTagsList.filter(tag =>
      tag.toLowerCase().startsWith(currentTagInput.toLowerCase())
    )
  );

  // Variable derivada para obtener los semestres disponibles según la materia seleccionada.
  // Se usa $derived.by ya que la lógica es algo más compleja.
  let availableSemesters = $derived.by(() => {
    const subjectObj = subjects.find(s => s.id == selectedSubject);
    return subjectObj && subjectObj.semesters && subjectObj.semesters.length > 0
      ? subjectObj.semesters
      : semesters;
  });

  // Acción para detectar clicks fuera del nodo
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

  // Manejador para el input de tags
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

  // Función para manejar la pulsación de teclas en el input de tags
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

  // Función que se dispara al hacer click en un tag del menú de sugerencias
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

  // Función para eliminar un tag de la selección (por botón "x")
  function removeTag(tagToRemove) {
    selectedTags = selectedTags.filter(tag => tag !== tagToRemove);
    availableTagsList = allTagNames.filter(tag => !selectedTags.includes(tag));
    tags = selectedTags.join(', ') + (selectedTags.length ? ', ' : '');
  }

  // Función para manejar el clic en "Publicar"
  async function publishArticleHandler(e) {
    feedbackClass = "flex items-center justify-center mb-4 p-3 rounded-md";
    feedbackHtml = `<div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-600"></div><span class="ml-2">Publicando artículo...</span>`;

    if (title && !title.trim()) {
      feedbackHtml = 'El título no debe estar compuesto solo por espacios en blanco.';
      feedbackClass = 'mb-4 bg-yellow-100 text-yellow-600 border border-yellow-300 p-2 rounded-md';
      return;
    }
    if (content && !content.trim()) {
      feedbackHtml = 'El contenido no debe estar compuesto solo por espacios en blanco.';
      feedbackClass = 'mb-4 bg-yellow-100 text-yellow-600 border border-yellow-300 p-2 rounded-md';
      return;
    }

    const errors = [];
    if (!title.trim()) {
      errors.push('Debes ingresar el título del artículo.');
    }
    if (!selectedSubject) {
      errors.push('Debes seleccionar una materia.');
    }
    if (!selectedSemester) {
      errors.push('Debes seleccionar un semestre.');
    }
    if (!content.trim()) {
      errors.push('Debes ingresar el contenido del artículo.');
    }
    if (errors.length > 0) {
      feedbackHtml = errors.join('<br>');
      feedbackClass = 'mb-4 bg-red-100 text-red-600 border border-red-300 p-2 rounded-md';
      return;
    }

    loading = true;
    
    const articleData = {
      title: title.trim(),
      description: description.trim() || null,
      content: content.trim(),
      subject_id: Number(selectedSubject),
      semester_id: Number(selectedSemester),
      tags: selectedTags
    };

    const fileResponse = await createArticleFile(articleData);
    
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
      feedbackHtml = 'Artículo publicado exitosamente.';
      feedbackClass = 'mb-4 bg-emerald-100 text-emerald-600 border border-emerald-300 p-2 rounded-md';
      e.target.dispatchEvent(new CustomEvent('close-modal', { bubbles: true }));
    } else {
      feedbackHtml = 'Error al publicar el artículo. Intenta de nuevo.';
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
  <h2 class="font-semibold text-lg text-primary-900 dark:text-white">Crear artículo</h2>
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
      placeholder="Breve descripción del artículo"
      rows="2"
      class="w-full px-3 py-2 bg-white dark:bg-primary-900 border border-primary-300 dark:border-primary-700 rounded-md focus:outline-none focus:ring-1 focus:ring-accent-500"
      bind:value={description}></textarea>
  </div>
  <!-- Sección de tags con menú de sugerencias -->
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
  <div class="mb-4">
    <label class="block text-sm text-primary-700 dark:text-primary-300 mb-2">Contenido</label>
    <div class="border border-primary-300 dark:border-primary-700 rounded-md overflow-hidden">
      <div class="flex items-center gap-1 px-2 py-1.5 bg-primary-50 dark:bg-primary-900 border-b border-primary-300 dark:border-primary-700">
        <button class="p-1 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-700 rounded">
          <span class="material-symbols-outlined text-sm">format_bold</span>
        </button>
        <button class="p-1 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-700 rounded">
          <span class="material-symbols-outlined text-sm">format_italic</span>
        </button>
        <button class="p-1 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-700 rounded">
          <span class="material-symbols-outlined text-sm">format_list_bulleted</span>
        </button>
        <button class="p-1 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-700 rounded">
          <span class="material-symbols-outlined text-sm">format_list_numbered</span>
        </button>
        <span class="w-px h-4 bg-primary-300 dark:bg-primary-700 mx-1"></span>
        <button class="p-1 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-700 rounded">
          <span class="material-symbols-outlined text-sm">link</span>
        </button>
        <button class="p-1 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-700 rounded">
          <span class="material-symbols-outlined text-sm">code</span>
        </button>
      </div>
      <textarea
        placeholder="Escribe el contenido de tu artículo aquí..."
        rows="6"
        class="w-full px-3 py-2 bg-white dark:bg-primary-900 border-none focus:outline-none focus:ring-0"
        bind:value={content}></textarea>
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
    on:click={publishArticleHandler}>
    Publicar
  </button>
</div>
