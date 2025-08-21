import { useEffect, useState } from "react";
import {
  Users,
  FileText,
  Clock,
  CheckCircle,
  Loader2,
  PlusCircle,
  Check,
  Eye,
  Edit,
  Menu,
  X,
  Send,
} from "lucide-react";
import { Initial } from "./form-sections/initial";
import { useNavigate } from "react-router-dom";

type TaskStatus = "pending" | "completed";

type Patient = {
  id: string;
  first_name: string;
  last_name: string;
  doctor_id: number;
  functional_status: TaskStatus;
  vitals_status: TaskStatus;
  intake_status: TaskStatus;
  document_url_exists: boolean;
};

type Notification = {
  id: number;
  message: string;
  type: "success" | "error";
};

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
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${bg}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

const Sidebar = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
}: {
  activeTab: "patients" | "initial";
  setActiveTab: (t: "patients" | "initial") => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  const items = [
    { id: "patients" as const, label: "Patients", icon: Users },
    { id: "initial" as const, label: "Initial Form", icon: FileText },
  ];

  const handleItemClick = (tab: "patients" | "initial") => {
    setActiveTab(tab);
    if (window.innerWidth < 768) {
      // md breakpoint
      setIsOpen(false);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden text-gray-500 hover:text-gray-800">
          <X className="w-6 h-6" />
        </button>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {items.map((m) => {
            const Icon = m.icon;
            const active = activeTab === m.id;
            return (
              <li key={m.id}>
                <button
                  onClick={() => handleItemClick(m.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    active
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}>
                  <Icon className="w-5 h-5 mr-3" />
                  {m.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white z-40 transform transition-transform md:relative md:translate-x-0 flex flex-col border-r border-gray-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        {sidebarContent}
      </aside>
    </>
  );
};

/* ================================
   Data helpers
================================ */
const shapePatients = (raw: any[], doctorId: number): Patient[] => {
  return (raw as any[]).map((p) => ({
    id: String(p.id),
    first_name: String(p.first_name ?? p.full_name?.split(' ')[0] ?? ""),
    last_name: String(p.last_name ?? p.full_name?.split(' ')[1] ?? ""),
    doctor_id: doctorId,
    functional_status: p.functionalstatus ? "completed" : "pending",
    vitals_status: p.vitalstatus ? "completed" : "pending",
    intake_status: p.formdata ? "completed" : "pending",
    document_url_exists: !!p.document_url,
  }));
};

/* ================================
   API
================================ */
const fetchPatients = async (doctorId: string): Promise<Patient[]> => {
  const res = await fetch(
    `http://ce-backend.eba-prtjiucu.us-east-1.elasticbeanstalk.com/patients?doctor_id=${doctorId}`,
    {
      method: "GET",
      headers: { Accept: "application/json" },
    }
  );
  if (!res.ok) throw new Error(`Failed to load patients (${res.status})`);
  const json = await res.json();
  return shapePatients(json, Number(doctorId));
};

const createPatient = async (
  patientInfo: {
    first_name: string;
    last_name: string;
    dob: string;
    phoneNumber: string;
  },
  doctorId: string
): Promise<any> => {
  const params = new URLSearchParams({
    patient_first_name: patientInfo.first_name,
    patient_last_name: patientInfo.last_name,
    doctor_id: String(doctorId),
    date_of_birth: patientInfo.dob,
    phone_number: patientInfo.phoneNumber,
  });
  const res = await fetch(
    `http://ce-backend.eba-prtjiucu.us-east-1.elasticbeanstalk.com/patients/create?${params.toString()}`,
    {
      method: "POST",
    }
  );
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to create patient");
  }
  return await res.json();
};

const sendFunctionalStatusLink = async (patientId: string): Promise<any> => {
  const res = await fetch(
    `http://ce-backend.eba-prtjiucu.us-east-1.elasticbeanstalk.com/patients/send_functionalStatus_link_to_patient?patient_id=${patientId}`,
    {
      method: "POST",
    }
  );
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to send link");
  }
  return await res.json();
};

const PatientCard = ({
  patient,
  onStartIntake,
  onSendLink,
  onView,
  onEdit,
  sendingLink,
  sentLink,
  viewingDocumentId,
  editingPatientId,
}: {
  patient: Patient;
  onStartIntake: (id: string) => void;
  onSendLink: (id: string) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  sendingLink: string | null;
  sentLink: string | null;
  viewingDocumentId: string | null;
  editingPatientId: string | null;
}) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col space-y-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="font-bold text-lg text-gray-800">{`${patient.first_name} ${patient.last_name}`}</h4>
          </div>
        </div>
        {patient.intake_status === "completed" && (
          <div className="flex items-center space-x-1 shrink-0">
            {patient.document_url_exists && (
              <button
                onClick={() => onView(patient.id)}
                className="p-2 rounded-md hover:bg-gray-200 text-gray-500 hover:text-gray-800"
                disabled={viewingDocumentId === patient.id}>
                {viewingDocumentId === patient.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            )}
            <button
              onClick={() => onEdit(patient.id)}
              className="p-2 rounded-md hover:bg-gray-200 text-gray-500 hover:text-gray-800"
              disabled={editingPatientId === patient.id}>
              {editingPatientId === patient.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Edit className="w-4 h-4" />
              )}
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h5 className="font-semibold text-gray-700">Functional Status</h5>
            <StatusBadge status={patient.functional_status} />
          </div>
          {patient.functional_status !== "completed" && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate(`/functional-status/${patient.id}`)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold">
                Fill Form
              </button>
              <button
                onClick={() => onSendLink(patient.id)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold flex items-center disabled:opacity-50"
                disabled={sendingLink === patient.id || sentLink === patient.id}>
                {sendingLink === patient.id ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : sentLink === patient.id ? (
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {sendingLink === patient.id
                  ? "Sending..."
                  : sentLink === patient.id
                  ? "Sent"
                  : "Send Link"}
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h5 className="font-semibold text-gray-700">Vitals</h5>
            <StatusBadge status={patient.vitals_status} />
          </div>
          {patient.vitals_status !== "completed" && (
            <button
              onClick={() => navigate(`/vitals/${patient.id}`)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold">
              Fill Vitals
            </button>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h5 className="font-semibold text-gray-700">Final Intake</h5>
            <StatusBadge status={patient.intake_status} />
          </div>
          {patient.intake_status !== "completed" && (
            <button
              onClick={() => onStartIntake(patient.id)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold">
              Start Intake
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const PatientsList = ({ onStartIntake }: { onStartIntake: (patientId: string) => void; }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [newPatientInfo, setNewPatientInfo] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    phoneNumber: "",
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isCreatingPatient, setIsCreatingPatient] = useState(false);
  const [sendingLink, setSendingLink] = useState<string | null>(null);
  const [sentLink, setSentLink] = useState<string | null>(null);
  const [viewingDocumentId, setViewingDocumentId] = useState<string | null>(null);
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null);

  const navigate = useNavigate();

  const doctorId = localStorage.getItem("doctorid");

  const addNotification = (message: string, type: "success" | "error") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  const load = async () => {
    if (!doctorId) {
      setLoading(false);
      return;
    }
    try {
      setError(null);
      const data = await fetchPatients(doctorId);
      setPatients(data);
      sessionStorage.setItem(`patients_cache_${doctorId}`, JSON.stringify(data));
    } catch (e: any) {
      setError(e?.message || "Unable to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!doctorId) {
      setLoading(false);
      return;
    }
    const cacheKey = `patients_cache_${doctorId}`;
    const cachedData = sessionStorage.getItem(cacheKey);
    if (cachedData) {
      try {
        setPatients(JSON.parse(cachedData));
        setLoading(false);
      } catch (e) {
        console.error("Failed to parse cached patients", e);
        setLoading(true);
      }
    } else {
      setLoading(true);
    }

    load();
  }, [doctorId]);

  const handlePatientInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPatientInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleOnboardPatient = async () => {
    const { firstName, lastName, dob, phoneNumber } = newPatientInfo;
    if (!firstName || !lastName) {
      addNotification("First Name and Last Name are required.", "error");
      return;
    }
    if (!doctorId) {
      addNotification("Doctor ID not found. Please sign in again.", "error");
      return;
    }
    setIsCreatingPatient(true);
    try {
      await createPatient(
        { first_name: firstName, last_name: lastName, dob, phoneNumber },
        doctorId
      );
      addNotification("Patient created successfully!", "success");
      setNewPatientInfo({ firstName: "", lastName: "", dob: "", phoneNumber: "" });
      setShowOnboardModal(false);
      load(); // Refresh the list
    } catch (error: any) {
      addNotification(error.message, "error");
    } finally {
      setIsCreatingPatient(false);
    }
  };

  const handleSendLink = async (patientId: string) => {
    setSendingLink(patientId);
    try {
      await sendFunctionalStatusLink(patientId);
      addNotification("Functional status link sent successfully.", "success");
      setSentLink(patientId);
      setTimeout(() => setSentLink(null), 2000);
    } catch (error: any) {
      addNotification(error.message, "error");
    } finally {
      setSendingLink(null);
    }
  };

  const handleViewDocument = async (patientId: string) => {
    setViewingDocumentId(patientId);
    try {
      const res = await fetch(`http://ce-backend.eba-prtjiucu.us-east-1.elasticbeanstalk.com/patients/${patientId}/document-url`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to fetch document URL");
      }
      const data = await res.json();
      if (data.url) {
        window.open(data.url, '_blank');
      } else {
        throw new Error("Document URL not found in response.");
      }
    } catch (error: any) {
      addNotification(error.message, "error");
    } finally {
      setViewingDocumentId(null);
    }
  };

  const handleEdit = async (patientId: string) => {
    setEditingPatientId(patientId);
    try {
      localStorage.removeItem("medical-intake-form");
      localStorage.removeItem("medical-intake-draft");
      const res = await fetch(
        `http://ce-backend.eba-prtjiucu.us-east-1.elasticbeanstalk.com/patients/${patientId}/form-data`
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to fetch form data");
      }
      const data = await res.json();
      localStorage.setItem("medical-intake-form", JSON.stringify(data.formdata));
      localStorage.setItem("currentPatientId", patientId);
      navigate("/form");
    } catch (error: any) {
      addNotification(error.message, "error");
    } finally {
      setEditingPatientId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }
  if (error) {
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="fixed top-5 right-5 z-50 space-y-2">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-md shadow-lg flex items-center justify-between ${
              n.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white`}>
            <span>{n.message}</span>
            <button
              onClick={() =>
                setNotifications((prev) => prev.filter((item) => item.id !== n.id))
              }>
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end items-center">
        <button
          onClick={() => setShowOnboardModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm font-medium shadow-sm">
          <PlusCircle className="w-5 h-5 mr-2" />
          Onboard Patient
        </button>
      </div>

      {showOnboardModal && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Onboard New Patient</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={newPatientInfo.firstName}
                    onChange={handlePatientInfoChange}
                    placeholder="John"
                    className="border p-2 rounded-md w-full text-base"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={newPatientInfo.lastName}
                    onChange={handlePatientInfoChange}
                    placeholder="Doe"
                    className="border p-2 rounded-md w-full text-base"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="dob"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  id="dob"
                  value={newPatientInfo.dob}
                  onChange={handlePatientInfoChange}
                  className="border p-2 rounded-md w-full text-base"
                />
              </div>
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={newPatientInfo.phoneNumber}
                  onChange={handlePatientInfoChange}
                  placeholder="(123) 456-7890"
                  className="border p-2 rounded-md w-full text-base"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowOnboardModal(false)}
                className="px-5 py-2 rounded-md bg-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-300">
                Cancel
              </button>
              <button
                onClick={handleOnboardPatient}
                className="px-5 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 flex items-center disabled:opacity-50"
                disabled={isCreatingPatient}>
                {isCreatingPatient && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Add Patient
              </button>
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
              onSendLink={handleSendLink}
              onView={handleViewDocument}
              onEdit={handleEdit}
              sendingLink={sendingLink}
              sentLink={sentLink}
              viewingDocumentId={viewingDocumentId}
              editingPatientId={editingPatientId}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gray-100">
            <Users className="h-8 w-8 text-gray-500" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-800"></h3>
          <p className="mt-2 text-xl text-gray-500">No Patients found</p>
        </div>
      )}
    </div>
  );
};

/* ================================
   Page
================================ */
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"patients" | "initial">(
    "patients"
  );
  const [selectedPatientForIntake, setSelectedPatientForIntake] = useState<
    string | null
  >(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleSelectPatientForIntake = (patientId: string) => {
    setSelectedPatientForIntake(patientId);
    setActiveTab("initial");
  };

  const header =
    activeTab === "patients"
      ? {
          title: "Patients",
          subtitle: "Manage patient records and documentation",
        }
      : {
          title: "Initial Form",
          subtitle: `Fill out the initial patient intake for patient ${selectedPatientForIntake}`,
        };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden mr-4 text-gray-600 hover:text-gray-900">
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {header.title}
                </h1>
                <p className="text-sm text-gray-500 mt-1">{header.subtitle}</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          {activeTab === "patients" ? (
            <PatientsList onStartIntake={handleSelectPatientForIntake} />
          ) : (
            <Initial patientId={selectedPatientForIntake} />
          )}
        </main>
      </div>
    </div>
  );
}