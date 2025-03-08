<script>
  let { id } = $props();
  import { isModalVisible } from "../services/shared.js";

  function closeModal() {
    $isModalVisible[id] = false
  }

	$effect(() => {
    document.addEventListener('close-modal', () => {
      closeModal();
    });

    document.addEventListener('click', (event) => {
      if (event.target.matches('.modal-close, .modal-backdrop')) {
        closeModal();
      }
    });
	});
</script>

{#if $isModalVisible[id]}
<div class="w-full h-full fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-6">
  <div class="modal-backdrop fixed inset-0 bg-primary-900/50"></div>
  <div class="modal-content bg-white dark:bg-primary-800 rounded-lg shadow-xl max-w-md w-full z-10 relative max-h-[90vh] flex flex-col">
  <slot />
  </div>
</div>
{/if}
