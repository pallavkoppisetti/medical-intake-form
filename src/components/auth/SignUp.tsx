import { useState } from 'react';
import { AuthLayout } from './AuthLayout';

export function SignUp() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: string) => (e: { target: { value: any; }; }) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const passwordsMatch = !formData.confirmPassword || formData.password === formData.confirmPassword;

  return (
    <AuthLayout
      title="Create an Account"
      subtitle="Get started with your new account."
    >
      <div className="space-y-6">
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            placeholder="John Doe"
            required
            value={formData.fullName}
            onChange={handleInputChange('fullName')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            required
            value={formData.email}
            onChange={handleInputChange('email')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="password"
            placeholder="••••••••"
            required
            value={formData.password}
            onChange={handleInputChange('password')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="password"
            placeholder="••••••••"
            required
            value={formData.confirmPassword}
            onChange={handleInputChange('confirmPassword')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              !passwordsMatch ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {!passwordsMatch && (
            <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
          )}
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Sign Up
        </button>

        <div className="text-center">
          <span className="text-gray-600">Already have an account? </span>
          <a href="/signin" className="text-blue-600 hover:text-blue-500 font-medium">
            Sign in
          </a>
        </div>
      </div>
    </AuthLayout>
  );
}
