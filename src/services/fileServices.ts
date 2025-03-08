import { supabase, FILES_BUCKET } from '../supabase';
import type { Database } from '../dataTypes';
import { getFilePathFromUrl } from './shared.js'

export type File = Database['public']['Tables']['files']['Row'];

export interface FileWithTags extends File {
  tags: string[];
}

// Get all tags
export async function getAllTags() {
  const { data: tags, error } = await supabase
    .from('tags')
    .select('*');

  if (error) {
    console.error("Error al obtener los tags:", error);
    return null;
  }

  return tags;
}

// Get all files by subject and semester
export async function getFilesBySubjectAndSemester(
  subjectId: number,
  semesterId: number
): Promise<FileWithTags[]> {
  // First get all files
  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('subject_id', subjectId)
    .eq('semester_id', semesterId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching files for subject ${subjectId} and semester ${semesterId}:`, error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Get tags for each file
  const filesWithTags = await Promise.all(
    data.map(async (file) => {
      const { data: tagData, error: tagError } = await supabase
        .from('file_tags')
        .select('tags(name)')
        .eq('file_id', file.id);

      const tags = tagError || !tagData
        ? []
        : tagData.map((t: any) => t.tags?.name).filter(Boolean);

      return {
        ...file,
        tags
      };
    })
  );

  return filesWithTags;
}

export async function createArticleFile(file: {
  title: string;
  description?: string | null;
  content: string;
  subject_id: number;
  semester_id: number;
  tags?: string[];
}): Promise<File | null> {
  const { tags, ...fileData } = file;
  
  try {
    // Insertar el archivo
    const { data: fileDataResponse } = await supabase
      .from('files')
      .insert({
        ...fileData,
        content_type: 'text',
        file_type: 'article'
      })
      .select()
      .single()
      .throwOnError();

    // Si se proporcionan etiquetas
    if (tags && tags.length > 0 && fileDataResponse) {
      // 1. Consultar tags existentes
      let { data: existingTags } = await supabase
        .from('tags')
        .select('id, name')
        .in('name', tags)
        .throwOnError();

      // 2. Determinar qué tags faltan
      const existingTagNames = existingTags.map(tag => tag.name);
      const missingTagNames = tags.filter(tagName => !existingTagNames.includes(tagName));

      // 3. Insertar los tags que no existen aún
      if (missingTagNames.length > 0) {
        const { data: newTags } = await supabase
          .from('tags')
          .insert(
            missingTagNames.map(name => ({ name }))
          )
          .select()
          .throwOnError();

        // Combinar los tags ya existentes con los nuevos
        existingTags = [...existingTags, ...newTags];
      }

      // 4. Crear asociaciones en file_tags
      const tagAssociations = existingTags.map(tag => ({
        file_id: fileDataResponse.id,
        tag_id: tag.id
      }));

      await supabase
        .from('file_tags')
        .insert(tagAssociations)
        .throwOnError();
    }

    return fileDataResponse;
  } catch (error) {
    console.error('Error en createArticleFile:', error);
    return null;
  }
}

export async function uploadFile(
  file: File, 
  fileData: {
    title: string;
    description?: string | null;
    subject_id: number;
    semester_id: number;
    tags?: string[];
  }
): Promise<FileWithTags | null> {
  try {
    // Upload to storage
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const filePath = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

    // Determine file type based on extension
    let fileType = 'other';
    if (fileExt === 'pdf') fileType = 'pdf';
    else if (['doc', 'docx'].includes(fileExt || '')) fileType = 'doc';
    else if (['txt', 'md'].includes(fileExt || '')) fileType = 'note';

    // Upload the file
    const { data: storageData, error: storageError } = await supabase.storage
      .from(FILES_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (storageError) {
      console.error('Error uploading file to storage:', storageError);
      return null;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(FILES_BUCKET)
      .getPublicUrl(filePath);

    // Create database entry
    const { tags, ...restFileData } = fileData;
    const { data, error } = await supabase
      .from('files')
      .insert({
        ...restFileData,
        content_type: 'file',
        file_type: fileType,
        content: publicUrlData.publicUrl,
        size_bytes: file.size
      })
      .select()
      .single()
      .throwOnError();

    // Add tags if provided
    if (tags && tags.length > 0 && data) {
      // 1. Consultar tags existentes
      let { data: existingTags } = await supabase
        .from('tags')
        .select('id, name')
        .in('name', tags)
        .throwOnError();

      // 2. Determinar qué tags faltan
      const existingTagNames = existingTags.map(tag => tag.name);
      const missingTagNames = tags.filter(tagName => !existingTagNames.includes(tagName));

      // 3. Insertar los tags que no existen aún
      if (missingTagNames.length > 0) {
        const { data: newTags } = await supabase
          .from('tags')
          .insert(
            missingTagNames.map(name => ({ name }))
          )
          .select()
          .throwOnError();

        // Combinar los tags ya existentes con los nuevos
        existingTags = [...existingTags, ...newTags];
      }

      // 4. Crear asociaciones en file_tags
      const tagAssociations = existingTags.map(tag => ({
        file_id: data.id,
        tag_id: tag.id
      }));

      await supabase
        .from('file_tags')
        .insert(tagAssociations)
        .throwOnError();
    }

    return { ...data, tags: tags || [] };
  } catch (error) {
    console.error('Error in uploadFile:', error);
    
    // Si el archivo ya se subió pero hubo un error después,
    // intentar eliminar el archivo para no dejar archivos huérfanos
    try {
      if (filePath) {
        await supabase.storage.from(FILES_BUCKET).remove([filePath]);
      }
    } catch (cleanupError) {
      console.error('Error cleaning up file:', cleanupError);
    }
    
    return null;
  }
}

export async function deleteFile(id: number): Promise<boolean> {
  try {
    // Get file information to check if it's a storage file
    const { data, error: fetchError } = await supabase
      .from('files')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error(`Error fetching file ${id}:`, fetchError);
      return false;
    }

    // If file has content that references storage, try to delete the storage file
    if (data && data.content_type === 'file' && data.content) {
      try {
        // Extract correct file path from URL using the same function used in deleteSubject
        const filePath = getFilePathFromUrl(data.content);
        
        if (filePath) {
          const { error: storageError } = await supabase
            .storage
            .from(FILES_BUCKET)
            .remove([filePath]);
            
          if (storageError) {
            console.error(`Error deleting file from storage:`, storageError);
            // Continue with database deletion even if storage deletion fails
          }
        }
      } catch (storageError) {
        console.error(`Error deleting file from storage:`, storageError);
        // Continue with database deletion even if storage deletion fails
      }
    }

    // Delete file from database
    const { error } = await supabase
      .from('files')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting file ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteFile:', error);
    return false;
  }
}
