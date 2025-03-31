import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zkProofService, StudentCredentials } from '../services/zkProof';
import { z } from 'zod';

interface StudentAuthProps {
  onAuthSuccess: (studentData: { name: string; indexNumber: string }) => void;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
});

export const StudentAuth: React.FC<StudentAuthProps> = ({ onAuthSuccess }) => {
  const [name, setName] = useState('');
  const [indexNumber, setIndexNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const credentials: StudentCredentials = { name, indexNumber };
      const response = await zkProofService.verifyStudentCredentials(credentials);
      
      if (response.isValid && response.studentData) {
        onAuthSuccess({
          name: response.studentData.name,
          indexNumber: response.studentData.indexNumber
        });
        navigate('/dashboard');
      } else {
        setError(response.error || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Failed to verify credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Student Authentication
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter your student credentials to verify your identity
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="index-number" className="sr-only">
                Index Number
              </label>
              <input
                id="index-number"
                name="index-number"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Index Number"
                value={indexNumber}
                onChange={(e) => setIndexNumber(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {isLoading ? 'Verifying...' : 'Verify Credentials'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 