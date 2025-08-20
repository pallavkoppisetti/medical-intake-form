import { useEffect, useMemo, useState } from "react";
import {
  Users,
  FileText,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2, // Using a different loader icon for buttons
} from "lucide-react";
import { Initial } from "./form-sections/initial";

/* ================================
   Types
================================ */
type StatusType = "completed" | "pending" | "processing" | "failed" | "uploaded";

type Patient = {
  id: number;
  full_name: string;
  doctor_id: number;
  document_s3_url?: string | null;
  document_status: StatusType;
};

/* ================================
   UI Atoms
================================ */
const StatusBadge = ({ status }: { status: StatusType }) => {
  const cfg: Record<
    StatusType,
    { Icon: any; bg: string; fg: string; label: string }
  > = {
    completed: {
      Icon: CheckCircle,
      bg: "bg-green-100",
      fg: "text-green-800",
      label: "Completed",
    },
    pending: {
      Icon: Clock,
      bg: "bg-yellow-100",
      fg: "text-yellow-800",
      label: "Pending",
    },
    processing: {
      Icon: AlertCircle,
      bg: "bg-blue-100",
      fg: "text-blue-800",
      label: "Processing",
    },
    failed: {
      Icon: XCircle,
      bg: "bg-red-100",
      fg: "text-red-800",
      label: "Failed",
    },
    uploaded: {
      Icon: FileText,
      bg: "bg-green-100",
      fg: "text-gray-800",
      label: "Uploaded",
    },
  };

  const { Icon, bg, fg, label } = cfg[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${fg}`}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

const Sidebar = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: "patients" | "initial";
  setActiveTab: (t: "patients" | "initial") => void;
}) => {
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
                  className={`w-full flex items-center px-4 py-3 text-centre rounded-lg transition-colors ${
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
const normalizeStatus = (s: any): StatusType => {
  const v = String(s ?? "").toLowerCase();
  if (
    v === "completed" ||
    v === "pending" ||
    v === "processing" ||
    v === "failed" ||
    v === "uploaded"
  )
    return v;
  return "pending";
};

const shapePatients = (raw: any): Patient[] => {
  const base = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.data)
    ? raw.data
    : Array.isArray(raw?.patients)
    ? raw.patients
    : [];

  if (Array.isArray(base) && base.length > 0 && Array.isArray(base[0])) {
    return (base as any[]).map((p: any[]) => ({
      id: Number(p[0]),
      full_name: String(p[1]),
      doctor_id: Number(p[2]),
      document_s3_url: p[3] ?? null,
      document_status: normalizeStatus(p[4]),
    }));
  }

  return (base as any[]).map((p) => ({
    id: Number(p.id),
    full_name: String(p.full_name ?? p.name ?? ""),
    doctor_id: Number(p.doctor_id),
    document_s3_url: p.document_s3_url ?? null,
    document_status: normalizeStatus(p.document_status),
  }));
};

/* ================================
   API
================================ */
const fetchPatients = async (doctorId: number): Promise<Patient[]> => {
  const res = await fetch(
    `http://localhost:8000/patients?doctor_id=${encodeURIComponent(doctorId)}`,
    {
      method: "GET",
      headers: { Accept: "application/json" },
    }
  );
  if (!res.ok) throw new Error(`Failed to load patients (${res.status})`);
  const json = await res.json();
  return shapePatients(json);
};

const PatientsTable = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingDocId, setViewingDocId] = useState<number | null>(null);

  const doctorId = useMemo(() => {
    const v = typeof window !== "undefined" ? localStorage.getItem("doctorId") : null;
    return v ? Number(v) : 1; // fallback
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId]);

  /**
   * NEW: Handles fetching the secure, pre-signed URL from the backend
   * and opening it in a new tab.
   */
  const handleViewDocument = async (patientId: number) => {
    setViewingDocId(patientId);
    try {
      const res = await fetch(`http://localhost:8000/patients/${patientId}/document-url`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Could not fetch the document link.");
      }
      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank", "noopener,noreferrer"); // Open the secure URL
      }
    } catch (error: any) {
      console.error("Failed to get pre-signed URL", error);
      window.alert(`Error: ${error.message || "Could not open the document."}`);
    } finally {
      setViewingDocId(null);
    }
  };


  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <span className="ml-2 text-gray-600">Loading patients…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error loading patients
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={load}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg text-centre border border-gray-200">
      <div className="px-6 py-4 border-b text-centre border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Patient List</h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage and view patient documents
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">Doctor ID: {doctorId}</span>
          <button
            onClick={load}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {patients.length === 0 ? (
        <div className="p-800  text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Patients Found
          </h3>
          <p className="text-gray-600">
            No patients are currently assigned to this doctor.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-centre text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Patient Name
                </th>
                <th className="px-6 py-4 text-centre text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Document Status
                </th>
                <th className="px-6 py-4 text-centre text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-4 text-centre text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
                <th className="px-6 py-4 text-centre text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Edit
                </th>
                
              </tr>
            </thead>
            <tbody className="bg-white text-center  divide-gray-200">
              {patients.map((p) => {
                const isViewing = viewingDocId === p.id;
                return (
                  <tr key={p.id} className="hover:bg-gray-50  transition-colors">
                    <td className="px-6 py-10  whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {p.full_name}
                      </div>
                    </td>
                    <td className="px-6 py-4  whitespace-nowrap">
                      <StatusBadge status={p.document_status} />
                    </td>
                    <td className="px-6 py-4  whitespace-nowrap text-sm">
                      {p.document_s3_url ? (
                        <span className="text-gray-700">Available</span>
                      ) : (
                        <span className="text-gray-400">Not uploaded</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-centre whitespace-nowrap">
                      <button
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                        disabled={!p.document_s3_url || isViewing}
                        onClick={() => handleViewDocument(p.id)}
                      >
                        {isViewing ? (
                           <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                           <Eye className="w-4 h-4 mr-2" />
                        )}
                        {isViewing ? "Opening..." : "View Document"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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

  const header =
    activeTab === "patients"
      ? {
          title: "Patients",
          subtitle: "Manage patient records and documentation",
        }
      : {
          title: "Initial Form",
          subtitle: "Fill out the initial patient intake form",
        };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {header.title}
              </h1>
              <p className="text-sm text-gray-600 mt-1">{header.subtitle}</p>
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

        {/* Main */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === "patients" ? <PatientsTable /> : <Initial/>}
        </main>
      </div>
    </div>
  );
}