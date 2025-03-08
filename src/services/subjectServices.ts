import { supabase, FILES_BUCKET } from '../supabase';
import type { Database } from '../dataTypes';
import { getFilePathFromUrl } from './shared.js'

export type Subject = Database['public']['Tables']['subjects']['Row'];

export async function getAllSubjects(): Promise<Subject[]> {
  const { data, error } = await supabase
    .from('subjects')
    .select('*');

  if (error) {
    console.error('Error fetching subjects:', error);
    return [];
  }

  return data || [];
}

type SubjectWithSemesters = Database['public']['Tables']['subjects']['Row'] & {
  semesters: Database['public']['Tables']['semesters']['Row'][];
};

export async function getAllSubjectsWithSemesters(): Promise<SubjectWithSemesters[]> {
  const { data, error } = await supabase
    .from('subjects')
    .select('*, semesters(*)');

  if (error) {
    console.error('Error fetching subjects with semesters:', error);
    return [];
  }

  return data as SubjectWithSemesters[];
}

export async function getSubjectByTitle(title: string): Promise<Subject | null> {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .ilike('title', title)
    .single();

  if (error) {
    console.error(`Error fetching subject by slug ${title}:`, error);
    return null;
  }

  return data;
}

export async function getSubjectById(id: number): Promise<Subject | null> {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching subject by id ${id}:`, error);
    return null;
  }

  return data;
}

export async function createSubject(subject: {
  title: string;
  icon: string;
  color: string;
}): Promise<Subject | null> {
  try {
    // First, create the subject
    const { data: subjectData, error: subjectError } = await supabase
      .from('subjects')
      .insert(subject)
      .select()
      .single();

    if (subjectError || !subjectData) {
      console.error('Error creating subject:', subjectError);
      return null;
    }

    // Then, create 9 semesters for this subject
    const semestersToCreate = [];
    for (let i = 1; i <= 9; i++) {
      semestersToCreate.push({
        semester_name: `Semestre ${i}`,
        subject_id: subjectData.id
      });
    }

    const { error: semestersError } = await supabase
      .from('semesters')
      .insert(semestersToCreate);

    if (semestersError) {
      console.error('Error creating semesters:', semestersError);
      // We don't return null here because the subject was already created
      // Just log the error and continue
    }

    return subjectData;
  } catch (error) {
    console.error('Error in createSubject:', error);
    return null;
  }
}

export async function updateSubject(
  id: number,
  updates: Partial<Omit<Subject, 'id' | 'created_at' | 'updated_at'>>
): Promise<Subject | null> {
  const { data, error } = await supabase
    .from('subjects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating subject ${id}:`, error);
    return null;
  }

  return data;
}

export async function deleteSubject(id: number): Promise<boolean> {
  try {
    // 1. Obtener todos los archivos asociados al subject
    const { data: files, error: fetchError } = await supabase
      .from('files')
      .select('*')
      .eq('subject_id', id);

    if (fetchError) {
      console.error(`Error fetching files for subject ${id}:`, fetchError);
      return false;
    }

    // 2. Eliminar archivos del bucket de storage (solo los que son de tipo 'file')
    for (const file of files || []) {
      if (file.content_type === 'file' && file.content) {
        // Extraer el path del archivo del URL
        const fileUrl = file.content;
        const filePath = getFilePathFromUrl(fileUrl);
        
        if (filePath) {
          const { error: storageError } = await supabase
            .storage
            .from(FILES_BUCKET)
            .remove([filePath]);
          
          if (storageError) {
            console.error(`Error removing file from storage: ${filePath}`, storageError);
            // Continuar con los siguientes archivos incluso si hay error
          }
        }
      }
    }

    // 3. Eliminar el subject (las tablas relacionadas se eliminarán automáticamente)
    const { error: deleteError } = await supabase
      .from('subjects')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error(`Error deleting subject ${id}:`, deleteError);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Unexpected error deleting subject ${id}:`, error);
    return false;
  }
}
