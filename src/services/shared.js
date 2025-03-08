import { writable } from 'svelte/store';

export let subjects = writable([]);
export let semesters = writable([]);
export let resources = writable([]);
export let isModalVisible = writable({});

// Función auxiliar para extraer la ruta del archivo del URL completo
export function getFilePathFromUrl(url){
  try {
    // La URL tiene este formato: https://cmbwtumtfdkybvivxmsx.supabase.co/storage/v1/object/public/files/1741377764737_nhmlc86ix2.md
    // Necesitamos extraer: 1741377764737_nhmlc86ix2.md
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    // El último elemento de pathParts debe ser el nombre del archivo
    return pathParts[pathParts.length - 1];
  } catch (error) {
    console.error("Error parsing file URL:", error);
    return null;
  }
}
