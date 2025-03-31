import { backendService } from './backend';

export interface StudentInfo {
  name: string;
  studentId: string;
  university: string;
}

export const validateStudentInfo = async (info: StudentInfo): Promise<boolean> => {
  try {
    // First verify with the backend
    const isValid = await backendService.verifyStudent(info);
    
    if (!isValid) {
      return false;
    }
    
    // Store the verified student info
    localStorage.setItem('student_info', JSON.stringify({
      ...info,
      verifiedAt: new Date().toISOString()
    }));
    
    return true;
  } catch (error) {
    console.error('Student verification error:', error);
    return false;
  }
};

export const getVerifiedStudentInfo = (): StudentInfo | null => {
  const info = localStorage.getItem('student_info');
  if (!info) return null;
  
  try {
    return JSON.parse(info);
  } catch {
    return null;
  }
};

export const clearStudentInfo = () => {
  localStorage.removeItem('student_info');
}; 