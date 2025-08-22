import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, UserCircle, Loader2, X, Users, LogOut } from 'lucide-react';

interface Doctor {
  id: number;
  full_name: string;
  clinic_name: string;
  email: string;
}

type Notification = {
    id: number;
    message: string;
    type: "success" | "error";
};

export function AdminDashboard() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorInfo, setDoctorInfo] = useState({
    fullName: '',
    clinicName: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingDoctor, setIsAddingDoctor] = useState(false);
  const [error, setError] = useState('');
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string, type: "success" | "error") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://ceform-api.ezfylr.ai/get-doctors');
      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }
      const data = await response.json();
      setDoctors(data.doctors || []);
    } catch (error) {
      console.error(error);
      setError('Could not load doctors.');
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDoctorInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingDoctor(true);
    setError('');

    try {
      const response = await fetch('https://ceform-api.ezfylr.ai/create-doctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          full_name: doctorInfo.fullName,
          clinic_name: doctorInfo.clinicName,
          email: doctorInfo.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to add doctor');
      }

      addNotification('Doctor added successfully!', 'success');
      setDoctorInfo({ fullName: '', clinicName: '', email: '' });
      setShowAddDoctorModal(false);
      fetchDoctors(); // Refresh the list
    } catch (err: any) {
      addNotification(err.message, 'error');
    } finally {
      setIsAddingDoctor(false);
    }
  };

  if (isLoading && doctors.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
        <div className="fixed top-5 right-5 z-50 space-y-3 max-w-md">
            {notifications.map((n) => (
            <div
                key={n.id}
                className={`p-4 rounded-lg shadow-lg border flex items-start justify-between ${
                n.type === "success" 
                    ? "bg-green-50 border-green-200 text-green-800" 
                    : "bg-red-50 border-red-200 text-red-800"
                }`}>
                <span className="text-sm font-medium pr-2">{n.message}</span>
                <button
                onClick={() =>
                    setNotifications((prev) => prev.filter((item) => item.id !== n.id))
                }
                className="text-current opacity-70 hover:opacity-100 transition-opacity flex-shrink-0"
                >
                <X className="w-4 h-4" />
                </button>
            </div>
            ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Hello Admin</h1>
                <p className="text-gray-600 mt-1">Manage doctors in the system</p>
            </div>
            <div className="flex items-center gap-4">
                <button
                onClick={() => setShowAddDoctorModal(true)}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <PlusCircle className="w-5 h-5 mr-2" />
                Add New Doctor
                </button>
                <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    <LogOut className="w-5 h-5 mr-2" />
                    Logout
                </button>
            </div>
        </div>

        {showAddDoctorModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4">
                <div className="p-8">
                <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <UserCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                    <h3 className="text-2xl font-bold text-gray-900">Add New Doctor</h3>
                    <p className="text-gray-600">Enter doctor information to add them to the system</p>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="Dr. John Doe"
                        required
                        value={doctorInfo.fullName}
                        onChange={handleInputChange}
                        disabled={isAddingDoctor}
                    />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="clinicName">Clinic Name</Label>
                    <Input
                        id="clinicName"
                        name="clinicName"
                        type="text"
                        placeholder="Sunshine Clinic"
                        required
                        value={doctorInfo.clinicName}
                        onChange={handleInputChange}
                        disabled={isAddingDoctor}
                    />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="doctor@example.com"
                        required
                        value={doctorInfo.email}
                        onChange={handleInputChange}
                        disabled={isAddingDoctor}
                    />
                    </div>
                    <div className="flex justify-end space-x-4 mt-8">
                        <button
                        type="button"
                        onClick={() => setShowAddDoctorModal(false)}
                        className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium">
                        Cancel
                        </button>
                        <Button type="submit" disabled={isAddingDoctor} className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center disabled:opacity-50">
                            {isAddingDoctor ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Add Doctor'}
                        </Button>
                    </div>
                </form>
                </div>
            </div>
            </div>
        )}

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        {doctors.length > 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clinic Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {doctors.map((doctor) => (
                            <tr key={doctor.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doctor.full_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.clinic_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="text-center py-32 px-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="mx-auto h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Users className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">No doctors found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Get started by adding your first doctor to the system.
                </p>
                <button
                    onClick={() => setShowAddDoctorModal(true)}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Add Your First Doctor
                </button>
            </div>
        )}
    </div>
  );
}
