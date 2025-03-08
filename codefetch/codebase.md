Project Structure:
├── README.md
├── astro.config.mjs
├── package.json
├── public
│   └── favicon.svg
├── src
│   ├── assets
│   │   ├── astro.svg
│   │   └── background.svg
│   ├── components
│   │   ├── Header.astro
│   │   ├── SubjectCard.astro
│   │   ├── FloatingActionButton.astro
│   │   ├── ResourceItem.astro
│   │   ├── Modal.astro
│   │   └── FolderModal.astro
│   ├── layouts
│   │   └── Layout.astro
│   ├── pages
│   │   ├── index.astro
│   │   └── subject
│   │       ├── [subject].astro
│   │       └── [subject]
│   │           └── semester
│   │               └── [semester].astro
│   ├── styles
│   │   └── global.css
│   ├── services
│   │   ├── subjectServices.ts
│   │   ├── semesterServices.ts
│   │   └── fileServices.ts
│   ├── supabase.ts
│   └── dataTypes.ts
├── tsconfig.json
└── bun.lock


src/components/Header.astro
```
1 | <header class="bg-white dark:bg-primary-900 border-b border-primary-200 dark:border-primary-800 px-3 sm:px-6 py-3 sticky top-0 z-10">
2 |   <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
3 |     <!-- Primera parte: Breadcrumb y toggle de tema en móvil (visible solo en móvil) -->
4 |     <div class="flex items-center justify-between w-full sm:w-auto">
5 |       <a href="/" class="text-sm text-primary-500 dark:text-primary-400">Inicio</a>
6 |       <button id="theme-toggle-mobile" class="p-2 rounded-sm text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors sm:hidden">
7 |         <!-- Icono para modo claro -->
8 |         <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 hidden dark:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
9 |           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
10 |         </svg>
11 |         <!-- Icono para modo oscuro -->
12 |         <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 block dark:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
13 |           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
14 |         </svg>
15 |       </button>
16 |     </div>
17 | 
18 |     <!-- Segunda parte: Buscador -->
19 |     <div class="mt-3 sm:mt-0 sm:w-md relative">
20 |       <input
21 |         type="text"
22 |         id="search-input"
23 |         placeholder="Buscar..."
24 |         class="w-full py-2 pl-10 pr-3 bg-primary-100 dark:bg-primary-800 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-accent-500 dark:text-primary-200 "
25 |       />
26 |       <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
27 |          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
28 |       </svg>
29 |     </div>
30 | 
31 |     <!-- Tercera parte: Toggle de tema para pantallas grandes (visible solo en desktop) -->
32 |     <div class="hidden sm:block">
33 |       <button id="theme-toggle-desktop" class="p-2 rounded-sm text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors">
34 |         <!-- Icono para modo claro -->
35 |         <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 hidden dark:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
36 |           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
37 |         </svg>
38 |         <!-- Icono para modo oscuro -->
39 |         <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 block dark:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
40 |           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
41 |         </svg>
42 |       </button>
43 |     </div>
44 |   </div>
45 | </header>
46 | 
47 | <script>
48 |   // Función para alternar el tema (se usa para ambos botones)
49 |   function toggleTheme() {
50 |     const isDark = document.documentElement.classList.toggle('dark');
51 |     localStorage.setItem('theme', isDark ? 'dark' : 'light');
52 |   }
53 |   document.getElementById('theme-toggle-mobile')?.addEventListener('click', toggleTheme);
54 |   document.getElementById('theme-toggle-desktop')?.addEventListener('click', toggleTheme);
55 | </script>
```

src/components/SubjectCard.astro
```
1 | ---
2 | interface Props {
3 |   id: number;
4 |   title: string;
5 |   icon: string;
6 |   color: string;
7 |   count?: number;
8 | }
9 | 
10 | const { id, title, icon, color, count = 0 } = Astro.props;
11 | ---
12 | 
13 | <a href={`/subject/${title}-${id}`} class="subject-card bg-white dark:bg-primary-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-primary-200 dark:border-primary-700">
14 |   <div class={`${color} h-2`}></div>
15 |   <div class="p-4">
16 |     <div class="flex justify-between items-start">
17 |       <div class="flex-1">
18 |         <h3 class="font-medium text-lg text-primary-900 dark:text-white">{title}</h3>
19 |         <p class="text-primary-500 dark:text-primary-400 text-sm">{count} recursos</p>
20 |       </div>
21 |       <div class={`${color.replace('bg-', 'text-')} rounded-full p-2 bg-opacity-10`}>
22 |         <span class="material-symbols-outlined">{icon}</span>
23 |       </div>
24 |     </div>
25 |   </div>
26 | </a>
```

src/components/FloatingActionButton.astro
```
1 | ---
2 | import FolderModal from '../components/FolderModal.astro'
3 | import Modal from '../components/Modal.astro'
4 | ---
5 | 
6 | <script>
7 |   // Elementos principales
8 |   const mainButton = document.getElementById('main-action-button');
9 |   const actionMenu = document.getElementById('action-menu');
10 |   const actionMenuBackdrop = document.querySelector('#menu-backdrop');
11 |   const createFolderButton = document.querySelector('#create-folder-button');
12 |   // Contenedor de las opciones (para animar solo este elemento)
13 |   const menuContainer = document.querySelector('#menu-container');
14 |   const boxModal = document.querySelector('#box-modal');
15 | 
16 |   // Función para abrir el menú
17 |   function openMenu() {
18 |     actionMenu.classList.remove('hidden');
19 |     menuContainer.classList.remove('animate-fade-out-down');
20 |     // Forzamos reflow para reiniciar la animación si fuera necesario
21 |     void menuContainer.offsetWidth;
22 |     menuContainer.classList.add('animate-fade-in-up');
23 |   }
24 | 
25 |   // Función para cerrar el menú con animación
26 |   function closeMenu() {
27 |     menuContainer.classList.remove('animate-fade-in-up');
28 |     menuContainer.classList.add('animate-fade-out-down');
29 |     menuContainer.addEventListener('animationend', function handler() {
30 |       actionMenu.classList.add('hidden');
31 |       menuContainer.classList.remove('animate-fade-out-down');
32 |       menuContainer.removeEventListener('animationend', handler);
33 |     });
34 |   }
35 | 
36 |   // Toggle en el botón principal
37 |   mainButton?.addEventListener('click', () => {
38 |     if (actionMenu.classList.contains('hidden')) {
39 |       openMenu();
40 |     } else {
41 |       closeMenu();
42 |     }
43 |   });
44 | 
45 |   // Cerrar el menú al hacer click fuera (en el backdrop)
46 |   actionMenuBackdrop?.addEventListener('click', () => {
47 |     if (!actionMenu.classList.contains('hidden')) {
48 |       closeMenu();
49 |     }
50 |   });
51 | 
52 |   createFolderButton?.addEventListener('click', () => {
53 |     actionMenu?.classList.add('hidden');
54 |     boxModal?.classList.remove('hidden');
55 |     document.body.insertAdjacentHTML('beforeend', '<subject-selector></subject-selector>');
56 |     //const modal = document.createElement('subject-selector');
57 |     //boxModal.appendChild(modal);
58 |     //console.log(modal);
59 |   });
60 | </script>
61 | 
62 | <div class="fixed bottom-8 right-3 sm:right-6 z-40">
63 |   <button id="main-action-button" class="w-14 h-14 z-41 bg-accent-500 hover:bg-accent-700 text-white rounded-full shadow-lg transition-all flex items-center justify-center">
64 |     <span class="material-symbols-outlined text-2xl">add</span>
65 |   </button>
66 |   
67 |   <div id="action-menu" class="hidden">
68 |     <div id="menu-backdrop" class="fixed inset-0 bg-primary-900/30 dark:bg-primary-900/50 z-40"></div>
69 |     <div id="menu-container" class="flex flex-col gap-2 absolute bottom-full mb-2 right-0 z-50 min-w-[180px]">
70 |       <button id="create-article-button" class="opacity-0 [animation:var(--animate-fade-in-up)] [animation-delay:50ms] bg-white dark:bg-primary-800 text-primary-800 dark:text-primary-200 shadow-md px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary-100 dark:hover:bg-primary-700 transition-colors whitespace-nowrap">
71 |         <span class="material-symbols-outlined">article</span>
72 |         <span>Crear artículo</span>
73 |       </button>
74 |       <button id="upload-files-button" class="opacity-0 [animation:var(--animate-fade-in-up)] [animation-delay:100ms] bg-white dark:bg-primary-800 text-primary-800 dark:text-primary-200 shadow-md px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary-100 dark:hover:bg-primary-700 transition-colors whitespace-nowrap">
75 |         <span class="material-symbols-outlined">upload_file</span>
76 |         <span>Subir archivos</span>
77 |       </button>
78 |       <button id="create-folder-button" class="opacity-0 [animation:var(--animate-fade-in-up)] [animation-delay:150ms] bg-white dark:bg-primary-800 text-primary-800 dark:text-primary-200 shadow-md px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary-100 dark:hover:bg-primary-700 transition-colors whitespace-nowrap">
79 |         <span class="material-symbols-outlined">create_new_folder</span>
80 |         <span>Nueva materia</span>
81 |       </button>
82 |     </div>
83 |   </div>
84 |   
85 |   <!-- Upload files modal -->
86 |   <div id="upload-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4">
87 |     <!-- ... contenido del modal ... -->
88 |   </div>
89 |   
90 |   <!-- Create article modal -->
91 |   <div id="article-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4">
92 |     <!-- ... contenido del modal ... -->
93 |   </div>
94 |   <Modal>
95 |   </Modal>
96 | </div>
```

src/components/ResourceItem.astro
```
1 | ---
2 | interface Props {
3 |   title: string;
4 |   type: 'pdf' | 'doc' | 'ppt' | 'img' | 'video' | 'link' | 'note' | 'article';
5 |   size?: string;
6 |   date: string;
7 |   description?: string;
8 |   tags?: string[];
9 |   contentType?: 'file' | 'text';
10 | }
11 | 
12 | const { title, type, size, date, description, tags = [], contentType = 'file' } = Astro.props;
13 | 
14 | const typeIcons = {
15 |   pdf: 'picture_as_pdf',
16 |   doc: 'description',
17 |   ppt: 'slideshow',
18 |   img: 'image',
19 |   video: 'videocam',
20 |   link: 'link',
21 |   note: 'sticky_note_2',
22 |   article: 'article'
23 | };
24 | 
25 | const typeColors = {
26 |   pdf: 'text-red-500',
27 |   doc: 'text-blue-500',
28 |   ppt: 'text-orange-500',
29 |   img: 'text-emerald-500',
30 |   video: 'text-purple-500',
31 |   link: 'text-sky-500',
32 |   note: 'text-yellow-500',
33 |   article: 'text-indigo-500'
34 | };
35 | 
36 | // Convert tags array to comma-separated string for data attribute
37 | const tagsString = tags.join(',');
38 | ---
39 | 
40 | <div class="resource-item flex items-start sm:items-center p-3 hover:bg-primary-100 dark:hover:bg-primary-700 transition-colors cursor-pointer rounded-lg" data-content-type={contentType} data-tags={tagsString}>
41 |   <div class={`${typeColors[type]} flex-shrink-0 mr-3`}>
42 |     <span class="material-symbols-outlined text-xl sm:text-2xl">{typeIcons[type]}</span>
43 |   </div>
44 |   
45 |   <div class="flex-1 min-w-0 w-full">
46 |     <div class="flex flex-wrap items-center gap-1 sm:gap-2">
47 |       <h3 class="text-sm font-medium text-primary-800 dark:text-primary-200 truncate">{title}</h3>
48 |       {contentType === 'text' && 
49 |         <span class="text-xs px-1.5 py-0.5 bg-primary-200 dark:bg-primary-700 text-primary-600 dark:text-primary-300 rounded-sm whitespace-nowrap">Artículo</span>
50 |       }
51 |     </div>
52 |     
53 |     {description && 
54 |       <p class="text-xs text-primary-600 dark:text-primary-400 line-clamp-2 sm:line-clamp-1">{description}</p>
55 |     }
56 |     
57 |     <div class="flex flex-wrap items-center mt-2 gap-1">
58 |       {tags.length > 0 && tags.map(tag => (
59 |         <span class="inline-flex items-center text-xs px-2 py-0.5 bg-accent-500/10 text-accent-500 rounded-full">
60 |           <span class="material-symbols-outlined text-[14px] mr-0.5">tag</span>
61 |           {tag}
62 |         </span>
63 |       ))}
64 |       
65 |       <p class="text-xs text-primary-500 dark:text-primary-400 mt-1 sm:mt-0 flex-grow-0 sm:ml-auto">
66 |         {size && <span class="mr-2">{size}</span>}
67 |         <span>{date}</span>
68 |       </p>
69 |     </div>
70 |   </div>
71 |   
72 |   <div class="flex-shrink-0 flex space-x-1 ml-2">
73 |     {contentType === 'file' && (
74 |       <button class="text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-200 pt-2 px-1 rounded-full hover:bg-primary-200 dark:hover:bg-primary-600 transition-colors">
75 |         <span class="material-symbols-outlined text-sm">download</span>
76 |       </button>
77 |     )}
78 |     <button class="text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-200 pt-2 px-1 rounded-full hover:bg-primary-200 dark:hover:bg-primary-600 transition-colors">
79 |       <span class="material-symbols-outlined text-sm">{contentType === 'file' ? 'visibility' : 'edit'}</span>
80 |     </button>
81 |   </div>
82 | </div>
```

src/components/Modal.astro
```
1 | ---
2 | interface Props {
3 |   component: string;
4 | }
5 | 
6 | const { componentId = '' } = Astro.props;
7 | ---
8 | 
9 | <script>
10 |   const modals = document.querySelectorAll('.modal');
11 | 
12 |   function closeModals() {
13 |     modals.forEach(modal => modal.classList.add('hidden'));
14 |     const modal = document.querySelector('subject-selector');
15 |     if (modal) modal.remove();
16 |   }
17 | 
18 |   document.addEventListener('click', (event) => {
19 |     if (event.target.matches('.modal-close, .modal-backdrop')) {
20 |       closeModals();
21 |     }
22 |   });
23 | </script>
24 | 
25 | <div id="box-modal" class="modal hidden fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-6">
26 |   <div class="modal-backdrop fixed inset-0 bg-primary-900/50"></div>
27 |   <div class="modal-content bg-white dark:bg-primary-800 rounded-lg shadow-xl max-w-md w-full z-10 relative max-h-[90vh] flex flex-col">
28 |     <slot />
29 |   </div>
30 | </div>
```

src/components/FolderModal.astro
```
1 | <subject-selector></subject-selector>
2 | 
3 | <script>
4 |   class SubjectSelector extends HTMLElement {
5 |     constructor() {
6 |       super();
7 |     }
8 | 
9 |     connectedCallback() {
10 |       this.innerHTML = `
11 |         <div class="modal-header p-4 border-b border-primary-200 dark:border-primary-700 flex justify-between items-center">
12 |           <h2 class="font-semibold text-lg text-primary-900 dark:text-white">Nueva materia</h2>
13 |           <button class="modal-close text-primary-500 hover:text-primary-700 dark:hover:text-primary-300">
14 |             <span class="material-symbols-outlined">close</span>
15 |           </button>
16 |         </div>
17 |         <div class="modal-body p-4 overflow-y-auto">
18 |           <div class="mb-4">
19 |             <label class="block text-sm text-primary-700 dark:text-primary-300 mb-2">Nombre de la materia</label>
20 |             <input id="subject-title" type="text" placeholder="Ej: Matemáticas Avanzadas" class="w-full px-3 py-2 bg-white dark:bg-primary-900 border border-primary-300 dark:border-primary-700 rounded-md focus:outline-none focus:ring-1 focus:ring-accent-500">
21 |           </div>
22 |           <div class="mb-4">
23 |             <label class="block text-sm text-primary-700 dark:text-primary-300 mb-2">Icono</label>
24 |             <div class="grid grid-cols-5 gap-2" id="icon-selector">
25 |               <button class="p-2 border border-primary-300 dark:border-primary-700 rounded-md hover:bg-primary-100 dark:hover:bg-primary-700 transition-colors icon-btn active" data-icon="computer">
26 |                 <span class="material-symbols-outlined">computer</span>
27 |               </button>
28 |               <button class="p-2 border border-primary-300 dark:border-primary-700 rounded-md hover:bg-primary-100 dark:hover:bg-primary-700 transition-colors icon-btn" data-icon="calculate">
29 |                 <span class="material-symbols-outlined">calculate</span>
30 |               </button>
31 |               <!-- otros icon-btn... -->
32 |             </div>
33 |           </div>
34 |           <div class="mb-4">
35 |             <label class="block text-sm text-primary-700 dark:text-primary-300 mb-2">Color</label>
36 |             <div class="grid grid-cols-5 gap-2" id="color-selector">
37 |               <button class="p-2 rounded-md bg-blue-500 h-8 color-btn active" data-color="bg-blue-500"></button>
38 |               <button class="p-2 rounded-md bg-emerald-500 h-8 color-btn" data-color="bg-emerald-500"></button>
39 |               <button class="p-2 rounded-md bg-amber-500 h-8 color-btn" data-color="bg-amber-500"></button>
40 |               <button class="p-2 rounded-md bg-purple-500 h-8 color-btn" data-color="bg-purple-500"></button>
41 |               <button class="p-2 rounded-md bg-red-500 h-8 color-btn" data-color="bg-red-500"></button>
42 |             </div>
43 |           </div>
44 |           <div id="subject-feedback" class="mb-4 p-3 rounded-md hidden"></div>
45 |         </div>
46 |         <div class="modal-footer p-4 border-t border-primary-200 dark:border-primary-700 flex justify-end">
47 |           <button class="modal-close px-4 py-2 border border-primary-300 dark:border-primary-700 rounded-md text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors mr-2">
48 |             Cancelar
49 |           </button>
50 |           <button id="create-subject-btn" class="px-4 py-2 bg-accent-500 hover:bg-accent-700 text-white rounded-md transition-colors">
51 |             Crear materia
52 |           </button>
53 |         </div>
54 |       `;
55 | 
56 |       this.selectedIcon = 'computer';
57 |       this.selectedColor = 'bg-blue-500';
58 | 
59 |       this.activeIconBtn = this.querySelector('.icon-btn.active');
60 |       this.activeColorBtn = this.querySelector('.color-btn.active');
61 | 
62 |       // Icon selector event
63 |       this.querySelector('#icon-selector').addEventListener('click', (e) => {
64 |         const button = e.target.closest('.icon-btn');
65 |         if (!button) return;
66 | 
67 |         if (this.activeIconBtn) {
68 |           this.activeIconBtn.classList.remove('active', 'ring-2', 'ring-[#339af0]', 'bg-primary-200', 'dark:bg-primary-700');
69 |         }
70 | 
71 |         button.classList.add('active', 'ring-2', 'ring-[#339af0]', 'bg-primary-200', 'dark:bg-primary-700');
72 |         this.activeIconBtn = button;
73 |         this.selectedIcon = button.dataset.icon || 'computer';
74 |       });
75 | 
76 |       // Color selector event
77 |       this.querySelector('#color-selector').addEventListener('click', (e) => {
78 |         const button = e.target.closest('.color-btn');
79 |         if (!button) return;
80 | 
81 |         if (this.activeColorBtn) {
82 |           this.activeColorBtn.classList.remove('active', 'ring-2', 'ring-white', 'ring-offset-2', 'ring-offset-primary-800');
83 |         }
84 | 
85 |         button.classList.add('active', 'ring-2', 'ring-white', 'ring-offset-2', 'ring-offset-primary-800');
86 |         this.activeColorBtn = button;
87 |         this.selectedColor = button.dataset.color || 'bg-blue-500';
88 |       });
89 |     }
90 |   }
91 | 
92 |   customElements.define('subject-selector', SubjectSelector);
93 | </script>
```

src/layouts/Layout.astro
```
1 | ---
2 | import '../../src/styles/global.css';
3 | import Header from '../components/Header.astro';
4 | import FloatingActionButton from '../components/FloatingActionButton.astro'
5 | 
6 | interface Props {
7 |   title?: string;
8 | }
9 | 
10 | const { title } = Astro.props;
11 | ---
12 | 
13 | <script is:inline>
14 |   document.documentElement.classList.toggle(
15 |     "dark",
16 |     localStorage.theme === "dark" ||
17 |       (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
18 |   );
19 | </script>
20 | 
21 | <!doctype html>
22 | <html lang="en">
23 |   <head>
24 |     <meta charset="UTF-8" />
25 |     <meta name="viewport" content="width=device-width" />
26 |     <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
27 |     <meta name="generator" content={Astro.generator} />
28 |     <link rel="preconnect" href="https://fonts.googleapis.com">
29 |     <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
30 |     <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
31 |     <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
32 |     <title>{title}</title>
33 |   </head>
34 |   <body class="font-sans bg-white text-primary-800 dark:bg-primary-900 dark:text-primary-200 min-h-screen">
35 |     <div class="flex min-h-screen">
36 |       <div class="flex-1 flex flex-col">
37 |         <Header/>
38 |         <main class="flex-1 py-6 px-3 sm:px-6">
39 |           <slot />
40 |         </main>
41 |         <FloatingActionButton />
42 |       </div>
43 |     </div>
44 |   </body>
45 | </html>
46 | 
47 | <style>
48 |   * {
49 |     box-sizing: border-box;
50 |   }
51 | 
52 |   body {
53 |     margin: 0;
54 |     padding: 0;
55 |     transition: background-color 0.3s ease, color 0.3s ease;
56 |   }
57 | </style>
```

src/pages/index.astro
```
1 | ---
2 | import Layout from '../layouts/Layout.astro';
3 | import SubjectCard from '../components/SubjectCard.astro';
4 | 
5 | import { getAllSubjects } from '../services/subjectServices';
6 | // Fetch subjects from Supabase
7 | const subjects = []//await getAllSubjects();
8 | ---
9 | 
10 | <script>
11 |   document.addEventListener('click', (e) => {
12 |     const details = document.getElementById('menu-details');
13 |     if (details && details.hasAttribute('open') && !details.contains(e.target)) {
14 |       details.removeAttribute('open');
15 |     }
16 |   });
17 | </script>
18 | 
19 | <Layout title='Academic Resource Manager'>
20 |   <div class="max-w-6xl mx-auto">
21 |     <div class="flex items-center justify-between mb-6">
22 |       <h1 class="text-xl font-bold text-primary-900 dark:text-white">Mis Materias</h1>
23 |       
24 |       <div class="relative" id="subject-actions">
25 |         <details class="relative group" id="menu-details">
26 |           <summary class="flex p-2 text-primary-500 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-800 rounded-md transition-colors cursor-pointer list-none marker:hidden focus:outline-none [&::-webkit-details-marker]:hidden">
27 |             <span class="material-symbols-outlined">more_vert</span>
28 |           </summary>
29 |           
30 |           <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-primary-800 rounded-md shadow-lg z-10 border border-primary-200 dark:border-primary-700 transition-all duration-150 opacity-0 invisible group-open:opacity-100 group-open:visible">
31 |             <button class="w-full text-left px-4 py-2 text-sm text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-700 transition-colors">
32 |               <span class="material-symbols-outlined text-sm align-middle mr-2">sort</span>
33 |               Ordenar por nombre
34 |             </button>
35 |             <button class="w-full text-left px-4 py-2 text-sm text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-700 transition-colors">
36 |               <span class="material-symbols-outlined text-sm align-middle mr-2">sort</span>
37 |               Ordenar por número de recursos
38 |             </button>
39 |           </div>
40 |         </details>
41 |       </div>
42 |     </div>
43 |     <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
44 |       {subjects.map(subject => (
45 |         <SubjectCard 
46 |           id={subject.id}
47 |           title={subject.title} 
48 |           icon={subject.icon} 
49 |           color={subject.color}
50 |         />
51 |       ))}
52 |     </div>
53 |   </div>
54 | </Layout>
```

src/styles/global.css
```
1 | @import "tailwindcss";
2 | 
3 | @theme {
4 |   --color-primary-50: #f8f9fa;
5 |   --color-primary-100: #f1f3f5;
6 |   --color-primary-200: #e9ecef;
7 |   --color-primary-300: #dee2e6;
8 |   --color-primary-400: #ced4da;
9 |   --color-primary-500: #adb5bd;
10 |   --color-primary-600: #868e96;
11 |   --color-primary-700: #495057;
12 |   --color-primary-800: #343a40;
13 |   --color-primary-900: #212529;
14 |   
15 |   --color-accent-300: #74c0fc;
16 |   --color-accent-500: #339af0;
17 |   --color-accent-700: #1c7ed6;
18 |   
19 |   --font-sans: "Inter", system-ui, sans-serif;
20 |   
21 |   --spacing-sidebar: 240px;
22 |   --animate-fade-in-up: fadeInUp 0.3s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
23 |   --animate-fade-out-down: fadeOutDown 0.3s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
24 |   
25 |   @keyframes fadeInUp {
26 |     0% {
27 |       opacity: 0;
28 |       transform: translateY(15px);
29 |     }
30 |     100% {
31 |       opacity: 1;
32 |       transform: translateY(0);
33 |     }
34 |   }
35 |   
36 |   @keyframes fadeOutDown {
37 |     0% {
38 |       opacity: 1;
39 |       transform: translateY(0);
40 |     }
41 |     100% {
42 |       opacity: 0;
43 |       transform: translateY(15px);
44 |     }
45 |   }
46 | }
47 | 
48 | /* Define la variante dark para que se active cuando el elemento o sus padres tengan la clase 'dark' */
49 | @custom-variant dark (&:where(.dark, .dark *));
```

src/pages/subject/[subject].astro
```
1 | ---
2 | import Layout from '../../layouts/Layout.astro';
3 | import { getSemestersBySubjectId } from '../../services/semesterServices';
4 | import { getFilesBySubjectAndSemester } from '../../services/fileServices';
5 | 
6 | const { subject } = Astro.params;
7 | const [title, id] = subject.split("-");
8 | 
9 | const semesters = await getSemestersBySubjectId(id);
10 | const semestersWithFiles = await Promise.all(
11 |   semesters.map(async (semester) => {
12 |     const resources = await getFilesBySubjectAndSemester(id, semester.id);
13 |     return {
14 |       ...semester,
15 |       resources
16 |     };
17 |   })
18 | );
19 | ---
20 | 
21 | <Layout title={title}>
22 |   <div class="max-w-5xl mx-auto">
23 |     <div class="flex items-center justify-between mb-6">
24 |       <h1 class="text-xl font-bold text-primary-900 dark:text-white">{title}</h1>
25 |       <div class="flex">
26 |         <button id="delete-subject" class="pt-2 px-2 text-primary-500 hover:text-red-500 hover:bg-primary-100 dark:hover:bg-primary-800 rounded-md transition-colors">
27 |           <span class="material-symbols-outlined">delete</span>
28 |         </button>
29 |       </div>
30 |     </div>
31 |   </div>
32 | 
33 |   {semestersWithFiles.map((semester) => (
34 |     <div class="mb-8">
35 |       {semester.resources.length > 0 ? (
36 |         <a href={`/subject/${subject}/semester/${semester.semester_name}-${semester.id}-${id}`} class="block">
37 |           <div class={`semester-header flex items-center justify-between mb-3 p-2 rounded-md cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-800/60 transition-colors`}>
38 |             <div class="flex items-center">
39 |               <div class={`flex items-center justify-center w-7 h-7 rounded-full bg-accent-500/10 text-accent-500 font-medium text-sm mr-2`}>
40 |                 {semester.semester_name.split(' ')[1]}
41 |               </div>
42 |               <h2 class="text-lg font-medium text-primary-900 dark:text-white">{semester.semester_name}</h2>
43 |             </div>
44 |             <span class="text-primary-500 pt-2 dark:text-primary-400">
45 |               <span class="material-symbols-outlined">arrow_forward</span>
46 |             </span>
47 |           </div>
48 |         </a>
49 |       ) : (
50 |         <div class="block cursor-default">
51 |           <div class={`semester-header flex items-center justify-between mb-3 p-2 rounded-md opacity-60 transition-colors`}>
52 |             <div class="flex items-center">
53 |               <div class={`flex items-center justify-center w-7 h-7 rounded-full bg-primary-200/80 dark:bg-primary-700/50 text-primary-500 dark:text-primary-400 font-medium text-sm mr-2`}>
54 |                 {semester.semester_name.split(' ')[1]}
55 |               </div>
56 |               <h2 class="text-lg font-medium text-primary-900 dark:text-white">{semester.semester_name}</h2>
57 |               <span class="ml-2 text-xs text-primary-500 dark:text-primary-400 py-1 px-2 bg-primary-100 dark:bg-primary-700 rounded-md">
58 |                 Vacío
59 |               </span>
60 |             </div>
61 |           </div>
62 |         </div>
63 |       )}
64 | 
65 |       {semester.resources.length > 0 && (
66 |         <div class="bg-white dark:bg-primary-800 rounded-lg border border-primary-200 dark:border-primary-700 divide-y divide-primary-200 dark:divide-primary-700 overflow-hidden">
67 |           {semester.resources.slice(0, 3).map((resource) => (
68 |             <div class="resource-item flex items-center p-3 hover:bg-primary-100 dark:hover:bg-primary-700 transition-colors cursor-pointer">
69 |               <div class={`flex-shrink-0 ${
70 |                 resource.file_type === 'pdf' ? 'text-red-500' : 
71 |                 resource.file_type === 'doc' ? 'text-blue-500' : 
72 |                 resource.file_type === 'note' ? 'text-yellow-500' : 
73 |                 'text-indigo-500'
74 |               }`}>
75 |                 <span class="material-symbols-outlined">
76 |                   {resource.file_type === 'pdf' ? 'picture_as_pdf' : 
77 |                    resource.file_type === 'doc' ? 'description' : 
78 |                    resource.file_type === 'note' ? 'sticky_note_2' : 'article'}
79 |                 </span>
80 |               </div>
81 |               
82 |               <div class="ml-3 flex-1 min-w-0">
83 |                 <h3 class="text-sm font-medium text-primary-800 dark:text-primary-200 truncate">{resource.title}</h3>
84 |                 <p class="text-xs text-primary-500 dark:text-primary-400">
85 |                   {resource.size_bytes && <span class="mr-2">{Math.round(resource.size_bytes / 1024)} KB</span>}
86 |                   <span>{new Date(resource.created_at).toLocaleDateString()}</span>
87 |                 </p>
88 |               </div>
89 |               
90 |               <div class="flex-shrink-0">
91 |                 <button class="text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-200 p-1 rounded-full hover:bg-primary-200 dark:hover:bg-primary-600 transition-colors">
92 |                   <span class="material-symbols-outlined text-sm">download</span>
93 |                 </button>
94 |               </div>
95 |             </div>
96 |           ))}
97 |         </div>
98 |       )}
99 |     </div>
100 |   ))}
101 |   
102 |   <!-- Delete subject confirmation modal -->
103 |   <div id="delete-subject-modal" class="modal hidden fixed inset-0 z-50 flex items-center justify-center p-4">
104 |     <div class="modal-backdrop fixed inset-0 bg-primary-900/50"></div>
105 |     <div class="modal-content bg-white dark:bg-primary-800 rounded-lg shadow-xl max-w-md w-full z-10 relative max-h-[90vh] overflow-y-auto">
106 |       <div class="modal-header p-4 border-b border-primary-200 dark:border-primary-700 flex justify-between items-center">
107 |         <h2 class="font-semibold text-lg text-primary-900 dark:text-white">Eliminar materia</h2>
108 |         <button class="modal-close text-primary-500 hover:text-primary-700 dark:hover:text-primary-300">
109 |           <span class="material-symbols-outlined">close</span>
110 |         </button>
111 |       </div>
112 |       <div class="modal-body p-4">
113 |         <p class="text-primary-700 dark:text-primary-300">
114 |           ¿Estás seguro de que deseas eliminar <span class="font-medium">{title}</span>? Esta acción no se puede deshacer y se perderán todos los archivos asociados.
115 |         </p>
116 |         <div id="delete-feedback" class="mt-3 p-3 rounded-md hidden"></div>
117 |       </div>
118 |       <div class="modal-footer p-4 border-t border-primary-200 dark:border-primary-700 flex justify-end">
119 |         <button class="modal-close px-4 py-2 border border-primary-300 dark:border-primary-700 rounded-md text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors mr-2">
120 |           Cancelar
121 |         </button>
122 |         <button id="confirm-delete" class="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded-md transition-colors">
123 |           Eliminar
124 |         </button>
125 |       </div>
126 |     </div>
127 |   </div>
128 | </Layout>
```

src/pages/subject/[subject]/semester/[semester].astro
```
1 | ---
2 | import Layout from '../../../../layouts/Layout.astro';
3 | import ResourceItem from '../../../../components/ResourceItem.astro';
4 | import { getFilesBySubjectAndSemester } from '../../../../services/fileServices';
5 | 
6 | const { semester } = Astro.params;
7 | const [title, semesterId, subjectId] = semester.split("-");
8 | const files = await getFilesBySubjectAndSemester(subjectId, semesterId);
9 | const parametros = Astro.url.pathname.split("/");
10 | const indice = parametros.findIndex(param => param.startsWith("subject"));
11 | const subject = parametros[indice + 1];
12 | ---
13 | 
14 | <Layout title={title}>
15 |   <div class="max-w-5xl mx-auto">
16 |     <div class="mb-6">
17 |       <a href={`/subject/${subject}`} class="text-accent-500 hover:text-accent-700 transition-colors flex items-center gap-2 mb-2">
18 |         <span class="material-symbols-outlined">arrow_back</span>
19 |         <span class="text-sm">Volver</span>
20 |       </a>
21 |       <h1 class="text-xl font-bold text-primary-900 dark:text-white">
22 |         {subject.split("-")[0]} - {title}
23 |       </h1>
24 |     </div>
25 | 
26 |     {files.length > 0 ? (
27 |       <div class="bg-white dark:bg-primary-800 rounded-lg border border-primary-200 dark:border-primary-700 divide-y divide-primary-200 dark:divide-primary-700 overflow-hidden">
28 |         {files.map(file => (
29 |           <ResourceItem
30 |             title={file.title}
31 |             type={file.file_type || 'note'}
32 |             size={file.size_bytes ? `${Math.round(file.size_bytes / 1024)} KB` : undefined}
33 |             date={new Date(file.created_at).toLocaleDateString()}
34 |             description={file.description || undefined}
35 |             tags={file.tags || []}
36 |             contentType={file.content_type}
37 |           />
38 |         ))}
39 |       </div>
40 |     ) : (
41 |       <></>
42 |     )}
43 |   </div>
44 | </Layout>
```
