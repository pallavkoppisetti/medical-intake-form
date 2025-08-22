import { useEffect, useMemo, useRef, useState } from "react";
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

  X,
  Send,
  UserCircle,
  Calendar,
  Phone,
  FilePenLine,
  HeartPulse,
  Search,
  LogOut,
} from "lucide-react";
import { Initial } from "./form-sections/initial";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

// ================================
// Types
// ================================

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

// ================================
// UI bits
// ================================

const StatusBadge = ({ status }: { status: TaskStatus }) => {
  const cfg: Record<
    TaskStatus,
    { Icon: React.ComponentType<{ className?: string }>; bg: string; text: string; label: string }
  > = {
    completed: {
      Icon: CheckCircle,
      bg: "bg-emerald-50 border-emerald-200",
      text: "text-emerald-700",
      label: "Completed",
    },
    pending: {
      Icon: Clock,
      bg: "bg-amber-50 border-amber-200",
      text: "text-amber-700",
      label: "Pending",
    },
  };

  const { Icon, bg, text, label } = cfg[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${bg} ${text}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
};

const ActionButton = ({ 
  onClick, 
  disabled, 
  loading, 
  variant = "primary",
  size = "sm",
  children,
  tooltip
}: {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "xs";
  children: React.ReactNode;
  tooltip?: string;
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    xs: "p-2 text-xs"
  };

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 border border-gray-300",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}
      title={tooltip}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
    </button>
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
  const navigate = useNavigate();
  const items = [
    { id: "patients" as const, label: "Patients", icon: Users },
    { id: "initial" as const, label: "Initial Form", icon: FileText },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleItemClick = (tab: "patients" | "initial") => {
    setActiveTab(tab);
    if (typeof window !== "undefined" && window.innerWidth < 768) {
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
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
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

// ================================
// Data helpers
// ================================

const toTask = (v: unknown): TaskStatus => (v ? "completed" : "pending");

const safeName = (raw: any): { first: string; last: string } => {
  const first = String(
    raw?.first_name ?? raw?.firstname ?? raw?.full_name?.split(" ")?.[0] ?? ""
  );
  const last = String(
    raw?.last_name ?? raw?.lastname ?? raw?.full_name?.split(" ")?.[1] ?? ""
  );
  return { first, last };
};

const shapePatients = (raw: unknown, doctorId: number): Patient[] => {
  const arr = Array.isArray(raw) ? raw : (raw as any)?.patients ?? [];
  return arr.map((p: any) => {
    const { first, last } = safeName(p);
    return {
      id: String(p.id ?? p.patient_id ?? crypto.randomUUID()),
      first_name: first,
      last_name: last,
      doctor_id: doctorId,
      functional_status: toTask(
        p.functionalstatus ?? p.functional_status ?? p.functionalStatus
      ),
      vitals_status: toTask(p.vitalstatus ?? p.vitals_status ?? p.vitalsStatus),
      intake_status: toTask(p.formdata ?? p.form_data ?? p.intake_status),
      document_url_exists: Boolean(p.document_url ?? p.documentUrl),
    };
  });
};

// ================================
// API
// ================================

const API_BASE = "https://ceform-api.ezfylr.ai";

const fetchJSON = async (input: RequestInfo, init?: RequestInit) => {
  const res = await fetch(input, {
    headers: { Accept: "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    let detail = "";
    try {
      const err = await res.json();
      detail = err?.detail || JSON.stringify(err);
    } catch {
      // ignore
    }
    throw new Error(detail || `Request failed (${res.status})`);
  }
  // Some endpoints may return empty bodies on 204; guard it
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

const fetchPatients = async (doctorId: string): Promise<Patient[]> => {
  const json = await fetchJSON(`${API_BASE}/patients?doctor_id=${doctorId}`);
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
  // The backend expects query params; keep that, but send proper headers
  const params = new URLSearchParams({
    patient_first_name: patientInfo.first_name,
    patient_last_name: patientInfo.last_name,
    doctor_id: String(doctorId),
    date_of_birth: patientInfo.dob,
    phone_number: patientInfo.phoneNumber,
  });
  return fetchJSON(`${API_BASE}/patients/create?${params.toString()}`, {
    method: "POST",
  });
};

const sendFunctionalStatusLink = async (patientId: string): Promise<any> => {
  return fetchJSON(
    `${API_BASE}/patients/send_functionalStatus_link_to_patient?patient_id=${patientId}`,
    { method: "POST" }
  );
};

// ================================
// Patients List
// ================================

const PatientsList = ({
  onStartIntake,
}: {
  onStartIntake: (patientId: string) => void;
}) => {
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
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const doctorId = useMemo(() => localStorage.getItem("doctorid"), []);

  const addNotification = (message: string, type: "success" | "error") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const load = async () => {
    if (!doctorId) {
      setLoading(false);
      setError("Doctor ID not found. Please sign in again.");
      return;
    }
    try {
      setError(null);
      const data = await fetchPatients(doctorId);
      if (mountedRef.current) {
        setPatients(data);
        sessionStorage.setItem(`patients_cache_${doctorId}`, JSON.stringify(data));
      }
    } catch (e: any) {
      if (mountedRef.current) setError(e?.message || "Unable to load patients");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    if (!doctorId) {
      setLoading(false);
      setError("Doctor ID not found. Please sign in again.");
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

    // fire and forget
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // very light client-side validation
    const phoneOk = /[0-9()+\-\s]{7,}/.test(phoneNumber || "");
    if (phoneNumber && !phoneOk) {
      addNotification("Please enter a valid phone number.", "error");
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
      await load(); // Refresh the list
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
      window.setTimeout(() => setSentLink(null), 2000);
    } catch (error: any) {
      addNotification(error.message, "error");
    } finally {
      setSendingLink(null);
    }
  };

  const handleViewDocument = async (patientId: string) => {
    setViewingDocumentId(patientId);
    try {
      const data = await fetchJSON(`${API_BASE}/patients/${patientId}/document-url`);
      const url = (data as any)?.url;
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
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
      const data = await fetchJSON(`${API_BASE}/patients/${patientId}/form-data`);
      const formdata = (data as any)?.formdata ?? (data as any)?.form_data ?? data;
      localStorage.setItem("medical-intake-form", JSON.stringify(formdata || {}));
      localStorage.setItem("currentPatientId", patientId);
      navigate("/form");
    } catch (error: any) {
      addNotification(error.message, "error");
    } finally {
      setEditingPatientId(null);
    }
  };

  const filteredPatients = patients.filter(p =>
    `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading patients...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-32 px-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-100 mb-4">
          <X className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Patients</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={load}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
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

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600 mt-1">Manage patient records and medical intakes</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
            />
          </div>
          <button
            onClick={() => setShowOnboardModal(true)}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <PlusCircle className="w-5 h-5 mr-2" />
            Add New Patient
          </button>
        </div>
      </div>

      {showOnboardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <UserCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Add New Patient</h3>
                  <p className="text-gray-600">Enter patient information to get started</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={newPatientInfo.firstName}
                      onChange={handlePatientInfoChange}
                      placeholder="John"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={newPatientInfo.lastName}
                      onChange={handlePatientInfoChange}
                      placeholder="Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={newPatientInfo.dob}
                    onChange={handlePatientInfoChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={newPatientInfo.phoneNumber}
                    onChange={handlePatientInfoChange}
                    placeholder="(123) 456-7890"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={() => setShowOnboardModal(false)}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium">
                  Cancel
                </button>
                <button
                  onClick={handleOnboardPatient}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center disabled:opacity-50"
                  disabled={isCreatingPatient}>
                  {isCreatingPatient && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Add Patient
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredPatients.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead >
                <tr className="bg-gray-50 text-center border-b p-10 border-gray-200">
                  <th className="px-8 py-4 mt-10  text-xs font-medium text-gray-500 uppercase">
                    Patient
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Functional Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vitals
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Final Intake
                  </th>
                  <th className="px-8 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPatients.map((patient, index) => (
                  <tr key={patient.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="px-8 py-6">
                      <div>
                        <div className="text-lg font-semibold text-gray-900 mb-1">
                          {patient.first_name} {patient.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {patient.id.slice(0, 8)}...
                        </div>
                      </div>
                    </td>
                  
                    <td className="px-6 py-5 align-middle">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={patient.functional_status} />
                        
                        {patient.functional_status !== "completed" && (
                          <>
                            <ActionButton
                              onClick={() => navigate(`/functional-status/${patient.id}`)}
                              variant="secondary"
                              size="xs"
                              tooltip="Fill out the functional status form now"
                            >
                              <FilePenLine className="w-4 h-4" />
                            </ActionButton>

                            <ActionButton
                              onClick={() => handleSendLink(patient.id)}
                              variant="secondary"
                              size="xs"
                              disabled={sendingLink === patient.id || sentLink === patient.id}
                              loading={sendingLink === patient.id}
                              tooltip="Send a secure link to the patient"
                            >
                              {sentLink === patient.id ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Send className="w-4 h-4" />
                              )}
                            </ActionButton>
                          </>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-6 align-middle">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={patient.vitals_status} />
                        {patient.vitals_status !== "completed" && (
                          <ActionButton
                            onClick={() => navigate(`/vitals/${patient.id}`)}
                            variant="secondary"
                            size="xs"
                            tooltip="Fill Vitals"
                          >
                            <HeartPulse className="w-4 h-4" />
                          </ActionButton>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-6 align-middle">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={patient.intake_status} />
                        {patient.intake_status !== "completed" && (
                          <ActionButton
                            onClick={() => onStartIntake(patient.id)}
                            variant="secondary"
                            size="xs"
                            tooltip="Start Intake"
                          >
                            <FileText className="w-4 h-4" />
                          </ActionButton>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2">
                        {patient.intake_status === "completed" && patient.document_url_exists && (
                          <ActionButton
                            onClick={() => handleViewDocument(patient.id)}
                            variant="ghost"
                            size="xs"
                            loading={viewingDocumentId === patient.id}
                            tooltip="View document"
                          >
                            <Eye className="w-4 h-4" />
                          </ActionButton>
                        )}
                        {patient.intake_status === "completed" && (
                          <ActionButton
                            onClick={() => handleEdit(patient.id)}
                            variant="ghost"
                            size="xs"
                            loading={editingPatientId === patient.id}
                            tooltip="Edit intake"
                          >
                            <Edit className="w-4 h-4" />
                          </ActionButton>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-32 px-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="mx-auto h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Users className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">No patients yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Get started by adding your first patient to begin managing their medical records and intake forms.
          </p>
          <button
            onClick={() => setShowOnboardModal(true)}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Your First Patient
          </button>
        </div>
      )}
    </div>
  );
};


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

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className=" overflow-y-auto p-4 sm:p-8 bg-gray-50">
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