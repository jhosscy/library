<script>
  import { subjects } from "../services/shared.js";
  import { createSubject } from '../services/subjectServices.ts';

  let loading = $state(false);

  // Listas de opciones para iconos y colores
  const icons = [
    "computer",
    "calculate",
    "science",
    "menu_book",
    "biotech"
  ];

  const colors = [
    "bg-blue-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-purple-500",
    "bg-red-500"
  ];

  // Variables de estado
  let selectedIcon = $state("");
  let selectedColor = $state("");
  let title = "";
  // Variables para el feedback (HTML y clases de estilos)
  let feedbackHtml = $state("");
  let feedbackClass = $state("mb-4 p-3 rounded-md hidden");

  // Función para seleccionar un icono: actualiza el índice activo y guarda el icono seleccionado
  let iconSelector;
  let colorSelector;
  // Listener de delegación para iconos (se deja el snippet original)
  function iconClickHandler(e) {
    const target = e.target;
    const button = target.closest('.icon-btn');
    if (!button) return;
    const index = button.dataset.index;
    selectedIcon = icons[index] || '';
  }


  // Función para seleccionar un color: actualiza el índice activo y guarda el color seleccionado
  function colorClickHandler(e) {
    const target = e.target;
    const button = target.closest('.color-btn');
    if (!button) return;
    const index = button.dataset.index;
    selectedColor = colors[index] || '';
  }

  // Función para manejar el clic en "Crear materia"
  async function createSubjectHandler(e) {
    // Se muestra el feedback de carga
    feedbackClass = "mb-4 p-3 rounded-md flex items-center justify-center";
    feedbackHtml = `<div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-600"></div><span class="ml-2">Creando materia...</span>`;

    // Validación: se rechaza si el título está compuesto solo por espacios
    if (title && !title.trim()) {
      feedbackHtml = 'El nombre no debe estar compuesto solo por espacios en blanco.';
      feedbackClass = 'mb-4 bg-yellow-100 text-yellow-600 border border-yellow-300 p-2 rounded-md';
      return;
    }

    const errors = [];

    if (!title) {
      errors.push('Debes ingresar el nombre de la materia.');
    }
    if (!selectedIcon) {
      errors.push('Debes seleccionar un ícono.');
    }
    if (!selectedColor) {
      errors.push('Debes seleccionar un color.');
    }

    if (errors.length > 0) {
      feedbackHtml = errors.join('<br>');
      feedbackClass = 'mb-4 bg-red-100 text-red-600 border border-red-300 p-2 rounded-md';
      return;
    }

    loading = true;
    const subject = await createSubject({
      title: title.trim(),
      icon: selectedIcon,
      color: selectedColor
    });

    if (subject) {
      loading = false;
      feedbackHtml = 'Materia creada exitosamente.';
      feedbackClass = 'mb-4 bg-emerald-100 text-emerald-600 border border-emerald-300 p-2 rounded-md';
      $subjects.push(subject)
      // Se dispara el evento para cerrar el modal
      e.target.dispatchEvent(new CustomEvent('close-modal', { bubbles: true }));
    } else {
      feedbackHtml = 'Error al crear la materia. Intenta de nuevo.';
      feedbackClass = 'mb-4 bg-red-100 text-red-600 border border-red-300 p-2 rounded-md';
    }
  }
</script>

<!-- Encabezado del modal -->
<div class="modal-header p-4 border-b border-primary-200 dark:border-primary-700 flex justify-between items-center">
  <h2 class="font-semibold text-lg text-primary-900 dark:text-white">Nueva materia</h2>
  <button class="modal-close text-primary-500 hover:text-primary-700 dark:hover:text-primary-300">
    <span class="material-symbols-outlined pointer-events-none">close</span>
  </button>
</div>

<!-- Cuerpo del modal -->
<div class="modal-body p-4 overflow-y-auto">
  <div class="mb-4">
    <label class="block text-sm text-primary-700 dark:text-primary-300 mb-2">Nombre de la materia</label>
    <input
      id="subject-title"
      type="text"
      placeholder="Ej: Matemáticas Avanzadas"
      class="w-full px-3 py-2 bg-white dark:bg-primary-900 border border-primary-300 dark:border-primary-700 rounded-md focus:outline-none focus:ring-1 focus:ring-accent-500"
      bind:value={title} />
  </div>

  <div class="mb-4">
    <label class="block text-sm text-primary-700 dark:text-primary-300 mb-2">Icono</label>
    <div class="grid grid-cols-5 gap-2" id="icon-selector" bind:this={iconSelector} on:click={iconClickHandler}>
      {#each icons as icon, i}
        <button
          type="button"
          class={`p-2 border border-primary-300 dark:border-primary-700 rounded-md hover:bg-primary-100 dark:hover:bg-primary-700 transition-colors text-center icon-btn ${selectedIcon === icon ? 'active ring-2 ring-[#339af0] bg-primary-200 dark:bg-primary-700' : ''}`}
          data-index={i}>
          <span class="material-symbols-outlined">{icon}</span>
        </button>
      {/each}
    </div>
  </div>

  <div class="mb-4">
    <label class="block text-sm text-primary-700 dark:text-primary-300 mb-2">Color</label>
    <div class="grid grid-cols-5 gap-2" id="color-selector" bind:this={colorSelector} on:click={colorClickHandler}>
      {#each colors as color, i}
        <button
          type="button"
          class={`p-2 rounded-md ${color} h-8 color-btn ${selectedColor === color ? 'active ring-2 ring-white ring-offset-2 ring-offset-primary-800' : ''}`}
          data-index={i}>
        </button>
      {/each}
    </div>
  </div>

  <!-- Div de feedback, se actualiza dinámicamente -->
  <div class={feedbackClass} >{@html feedbackHtml}</div>
</div>

<!-- Pie del modal -->
<div class="modal-footer p-4 border-t border-primary-200 dark:border-primary-700 flex justify-end">
  <button
    type="button"
    class="modal-close px-4 py-2 border border-primary-300 dark:border-primary-700 rounded-md text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors mr-2"
  >
    Cancelar
  </button>
  <button
    type="button"
    id="create-subject-btn"
    class="px-4 py-2 bg-accent-500 hover:bg-accent-700 text-white rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
    disabled={loading}
    on:click={createSubjectHandler}>
    Crear materia
  </button>
</div>
