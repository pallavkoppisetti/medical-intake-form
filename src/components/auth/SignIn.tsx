import { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { useNavigate } from 'react-router-dom';

export function SignIn() {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleInputChange = (field: string) => (e: { target: { value: any; }; }) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleCheckboxChange = (e: { target: { checked: any; }; }) => {
    setFormData(prev => ({
      ...prev,
      rememberMe: e.target.checked
    }));
  };

  return (
    <AuthLayout
      title="Sign In"
      subtitle="Welcome back! Please sign in to your account."
    >
      <div className="space-y-6">
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
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-700">Remember me</label>
          </div>
          <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
            Forgot password?
          </a>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Sign In
        </button>

        <div className="text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <a href="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
            Sign up
          </a>
        </div>
      </div>
    </AuthLayout>
  );
}