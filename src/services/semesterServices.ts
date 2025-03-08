import { supabase } from '../supabase';
import type { Database } from '../dataTypes';

export type Semester = Database['public']['Tables']['semesters']['Row'];

export async function getSemestersBySubjectId(subjectId: number): Promise<Semester[]> {
  const { data, error } = await supabase
    .from('semesters')
    .select('*')
    .eq('subject_id', subjectId);

  if (error) {
    console.error(`Error fetching semesters for subject ${subjectId}:`, error);
    return [];
  }

  return data || [];
}

export async function getSemestersWithFilesBySubjectId(subjectId: number): Promise<SemesterWithFiles[]> {
  const { data, error } = await supabase
    .from('semesters')
    // Limitamos a 4 archivos por semestre
    .select('*, files(*)').limit(4, { foreignTable: 'files' })
    .eq('subject_id', subjectId);

  if (error) {
    console.error(`Error fetching semesters with files for subject ${subjectId}:`, error);
    return [];
  }

  // data se espera que contenga un arreglo de semesters con la propiedad 'files' ya anidada
  return data || [];
}
