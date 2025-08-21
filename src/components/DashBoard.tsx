import { useEffect, useMemo, useState } from "react";
import {
  Users,
  FileText,
  Clock,
  CheckCircle,
  Loader2,
  PlusCircle,
  ClipboardCopy,
  Check,
  Eye,
  Edit,
} from "lucide-react";
import { Initial } from "./form-sections/initial";
import { useNavigate } from "react-router-dom";

/* ================================
   Types
================================ */
type TaskStatus = "pending" | "completed";

type Patient = {
  id: number;
  full_name: string;
  doctor_id: number;
  functional_status: TaskStatus;
  vitals_status: TaskStatus;
  intake_status: TaskStatus;
};

/* ================================
   UI Atoms
================================ */
const StatusBadge = ({ status }: { status: TaskStatus }) => {
  const cfg: Record<TaskStatus, { Icon: any; bg: string; label: string }> = {
    completed: {
      Icon: CheckCircle,
      bg: "bg-green-100 text-green-800",
      label: "Completed",
    },
    pending: {
      Icon: Clock,
      bg: "bg-yellow-100 text-yellow-800",
      label: "Pending",
    },
  };

  const { Icon, bg, label } = cfg[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${bg}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

const Sidebar = (
    { activeTab, setActiveTab }: 
    { activeTab: "patients" | "initial"; setActiveTab: (t: "patients" | "initial") => void; }
) => {
  const items = [
    { id: "patients" as const, label: "Patients", icon: Users },
    { id: "initial" as const, label: "Initial Form", icon: FileText },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {items.map((m) => {
            const Icon = m.icon;
            const active = activeTab === m.id;
            return (
              <li key={m.id}>
                <button
                  onClick={() => setActiveTab(m.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    active
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {m.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

/* ================================
   Data helpers
================================ */
const shapePatients = (raw: any[], doctorId: number): Patient[] => {
  return (raw as any[]).map((p) => ({
    id: Number(p.id),
    full_name: String(p.name ?? ""),
    doctor_id: doctorId,
    functional_status: p.functionalstatus ? "completed" : "pending",
    vitals_status: p.vitalstatus ? "completed" : "pending",
    intake_status: p.formdata ? "completed" : "pending",
  }));
};

/* ================================
   API
================================ */
const fetchPatients = async (doctorId: number): Promise<Patient[]> => {
  const res = await fetch(`http://localhost:8000/patients?doctor_id=${encodeURIComponent(doctorId)}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Failed to load patients (${res.status})`);
  const json = await res.json();
  return shapePatients(json, doctorId);
};

const createPatient = async (patientName: string, doctorId: number): Promise<any> => {
    const res = await fetch(`http://localhost:8000/patients/create?patient_name=${encodeURIComponent(patientName)}&doctor_id=${encodeURIComponent(doctorId)}`, {
        method: "POST",
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to create patient");
    }
    return await res.json();
}

const PatientCard = ({ patient, onStartIntake, onShareLink, copiedLink, onViewOrEdit }: { patient: Patient, onStartIntake: (id: number) => void, onShareLink: (id: number) => void, copiedLink: number | null, onViewOrEdit: (id: number) => void }) => {
    const navigate = useNavigate();
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col space-y-4 transition-all hover:shadow-md">
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                        <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-gray-800">{patient.full_name}</h4>
                        <p className="text-xs text-gray-500">Patient ID: {patient.id}</p>
                    </div>
                </div>
                {patient.intake_status === 'completed' && (
                    <div className="flex items-center space-x-1 shrink-0">
                        <button onClick={() => onViewOrEdit(patient.id)} className="p-2 rounded-md hover:bg-gray-200 text-gray-500 hover:text-gray-800"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => onViewOrEdit(patient.id)} className="p-2 rounded-md hover:bg-gray-200 text-gray-500 hover:text-gray-800"><Edit className="w-4 h-4" /></button>
                    </div>
                )}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h5 className="font-semibold text-gray-700">Functional Status</h5>
                        <StatusBadge status={patient.functional_status} />
                    </div>
                    {patient.functional_status !== 'completed' && (
                        <div className="flex items-center space-x-2">
                            <button onClick={() => navigate(`/functional-status/${patient.id}`)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold">Fill Form</button>
                            <button onClick={() => onShareLink(patient.id)} className="p-2 rounded-md hover:bg-gray-200">
                                {copiedLink === patient.id ? <Check className="w-4 h-4 text-green-600" /> : <ClipboardCopy className="w-4 h-4 text-gray-500" />}
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center">
                    <div>
                        <h5 className="font-semibold text-gray-700">Vitals</h5>
                        <StatusBadge status={patient.vitals_status} />
                    </div>
                    {patient.vitals_status !== 'completed' && (
                        <button onClick={() => navigate(`/vitals/${patient.id}`)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold">Fill Vitals</button>
                    )}
                </div>

                <div className="flex justify-between items-center">
                    <div>
                        <h5 className="font-semibold text-gray-700">Final Intake</h5>
                        <StatusBadge status={patient.intake_status} />
                    </div>
                    {patient.intake_status !== 'completed' && (
                        <button onClick={() => onStartIntake(patient.id)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold">Start Intake</button>
                    )}
                </div>
            </div>
        </div>
    );
};

const PatientsList = ({ onStartIntake }: { onStartIntake: (patientId: number) => void }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [newPatientName, setNewPatientName] = useState("");
  const [copiedLink, setCopiedLink] = useState<number | null>(null);
  const navigate = useNavigate();

  const doctorId = useMemo(() => {
    const v = typeof window !== "undefined" ? localStorage.getItem("doctorId") : null;
    return v ? Number(v) : 1;
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPatients(doctorId);
      setPatients(data);
    } catch (e: any) {
      setError(e?.message || "Unable to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [doctorId]);

  const handleOnboardPatient = async () => {
      if (!newPatientName.trim()) return;
      try {
        await createPatient(newPatientName, doctorId);
        setNewPatientName("");
        setShowOnboardModal(false);
        load(); // Refresh the list
      } catch (error: any) {
        alert(error.message);
      }
  };

  const handleShareLink = (patientId: number) => {
    const link = `${window.location.origin}/functional-status/${patientId}`;
    navigator.clipboard.writeText(link).then(() => {
        setCopiedLink(patientId);
        setTimeout(() => setCopiedLink(null), 2000);
    });
  };

  const handleViewOrEdit = async (patientId: number) => {
    try {
        localStorage.removeItem('medical-intake-form');
        localStorage.removeItem('medical-intake-draft');
        const res = await fetch(`http://localhost:8000/patients/${patientId}/form-data`);
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.detail || "Failed to fetch form data");
        }
        const data = await res.json();
        localStorage.setItem('medical-intake-form', JSON.stringify(data.formdata));
        navigate('/form');
    } catch (error: any) {
        alert(error.message);
    }
  };

  if (loading) { return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>; }
  if (error) { return <div className="p-8 text-center text-red-600">Error: {error}</div>; }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Patient List</h3>
          <p className="text-sm text-gray-500">Onboard new patients and manage their intake process.</p>
        </div>
        <button
          onClick={() => setShowOnboardModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm font-medium shadow-sm"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Onboard Patient
        </button>
      </div>

      {showOnboardModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                  <h3 className="text-xl font-semibold mb-6">Onboard New Patient</h3>
                  <input
                      type="text"
                      value={newPatientName}
                      onChange={(e) => setNewPatientName(e.target.value)}
                      placeholder="Enter Patient Full Name"
                      className="border p-3 rounded-md w-full mb-6 text-base"
                  />
                  <div className="flex justify-end space-x-4">
                      <button onClick={() => setShowOnboardModal(false)} className="px-6 py-2 rounded-md bg-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-300">Cancel</button>
                      <button onClick={handleOnboardPatient} className="px-6 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">Add Patient</button>
                  </div>
              </div>
          </div>
      )}

      {patients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {patients.map((p) => (
                <PatientCard 
                    key={p.id} 
                    patient={p} 
                    onStartIntake={onStartIntake} 
                    onShareLink={handleShareLink}
                    copiedLink={copiedLink}
                    onViewOrEdit={handleViewOrEdit}
                />
            ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No patients</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by onboarding a new patient.</p>
        </div>
      )}
    </div>
  );
};

/* ================================
   Page
================================ */
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"patients" | "initial">("patients");
  const [selectedPatientForIntake, setSelectedPatientForIntake] = useState<number | null>(null);

  const handleSelectPatientForIntake = (patientId: number) => {
    setSelectedPatientForIntake(patientId);
    setActiveTab('initial');
  };

  const header =
    activeTab === "patients"
      ? { title: "Patients", subtitle: "Manage patient records and documentation" }
      : { title: "Initial Form", subtitle: `Fill out the initial patient intake for patient ${selectedPatientForIntake}` };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{header.title}</h1>
              <p className="text-sm text-gray-500 mt-1">{header.subtitle}</p>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === "patients" ? <PatientsList onStartIntake={handleSelectPatientForIntake} /> : <Initial patientId={selectedPatientForIntake} />}
        </main>
      </div>
    </div>
  );
}