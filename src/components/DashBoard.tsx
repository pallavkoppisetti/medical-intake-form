import { useState } from 'react';
import { Users, FileText, Eye, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Initial } from './form-sections/initial';
const RenderInitial = () => (
  <div className="bg-white p-6 rounded-lg border border-gray-200">
    <Initial/>
  </div>
);


// Mock patient data
const mockPatients = [
  {
    id: 1,
    name: "John Smith",
    documentStatus: "completed",
    time: "2025-08-18 09:30 AM",
    documents: ["Medical History", "Lab Results", "Prescription"]
  },
  {
    id: 2,
    name: "Sarah Johnson",
    documentStatus: "pending",
    time: "2025-08-18 10:15 AM",
    documents: ["Initial Assessment"]
  },
  {
    id: 3,
    name: "Michael Brown",
    documentStatus: "processing",
    time: "2025-08-18 11:45 AM",
    documents: ["X-Ray Results", "Blood Work"]
  },
  {
    id: 4,
    name: "Emily Davis",
    documentStatus: "completed",
    time: "2025-08-18 02:20 PM",
    documents: ["Treatment Plan", "Follow-up Notes"]
  },
  {
    id: 5,
    name: "David Wilson",
    documentStatus: "failed",
    time: "2025-08-18 03:00 PM",
    documents: ["Incomplete Form"]
  }
];

// Sidebar Component
type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  
  const menuItems = [
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'initial', label: 'Initial Form', icon: FileText }
  ];

  const handleMenuClick = (itemId: string) => {
    setActiveTab(itemId);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

// Status Badge Component
type StatusType = 'completed' | 'pending' | 'processing' | 'failed';

const StatusBadge = ({ status }: { status: StatusType }) => {
  const statusConfig = {
    completed: {
      icon: CheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      label: 'Completed'
    },
    pending: {
      icon: Clock,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      label: 'Pending'
    },
    processing: {
      icon: AlertCircle,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      label: 'Processing'
    },
    failed: {
      icon: XCircle,
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      label: 'Failed'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
};

// Patients Table Component
type Patient = {
  id: number;
  name: string;
  documentStatus: string;
  time: string;
  documents: string[];
};

const PatientsTable = () => {
  const [, setSelectedPatient] = useState<Patient | null>(null);

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    // In a real app, you might navigate to a patient detail page
    // or open a modal with patient information.
    console.log("Viewing patient:", patient);
  };


  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Patient List</h3>
        <p className="text-sm text-gray-600 mt-1">Manage and view patient documents</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
                <th className="px-8 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient Name
                </th>
                <th className="px-8 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Document Status
                </th>
                <th className="px-8 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
                </th>
                <th className="px-8 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-5 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                  <StatusBadge status={patient.documentStatus as StatusType} />
                </td>
                  <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-500">
                  {patient.time}
                </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                  <button
                    onClick={() => handleViewPatient(patient)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('patients');

  const renderContent = () => {
    switch (activeTab) {
      case 'patients':
        return <PatientsTable />;
      case 'initial':
        return <RenderInitial />;
      default:
        return <PatientsTable />;
    }
  };
  
  const getHeaderText = () => {
    switch (activeTab) {
      case 'patients':
        return { title: 'Patients', subtitle: 'Manage patient records and documentation' };
      case 'initial':
        return { title: 'Initial Form', subtitle: 'Fill out the initial patient intake form' };
      default:
        return { title: 'Patients', subtitle: 'Manage patient records and documentation' };
    }
  };

  const { title, subtitle } = getHeaderText();

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
              <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </header>
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
