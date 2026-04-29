import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  ExternalLink,
  MessageSquare,
  AlertCircle,
  MoreVertical,
  ChevronRight
} from 'lucide-react';

const Prescriptions = () => {
  const [activeFilter, setActiveFilter] = useState('Pending');
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const prescriptions = [
    { id: 'RX-8842', customer: 'Rahul Sharma', date: '12m ago', status: 'Pending', patientName: 'Rahul Sharma', doctorName: 'Dr. S.K. Gupta', qualification: 'MD General Medicine' },
    { id: 'RX-8841', customer: 'Anjali Desai', date: '45m ago', status: 'Pending', patientName: 'Mrs. K. Desai', doctorName: 'Dr. Mehta', qualification: 'MBBS' },
    { id: 'RX-8840', customer: 'Vikram Mehta', date: '2h ago', status: 'Approved', patientName: 'Vikram Mehta', doctorName: 'Dr. J. Singh', qualification: 'BDS' },
    { id: 'RX-8839', customer: 'Sonia Gandhi', date: '5h ago', status: 'Rejected', patientName: 'Sonia Gandhi', doctorName: 'Unknown', qualification: '-' },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-admin-text-primary flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-pink-500" />
            Prescription Portal
          </h2>
          <p className="text-sm text-admin-text-secondary font-medium">Review and verify medical prescriptions uploaded by customers.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-700 rounded-xl border border-pink-100">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs font-bold">6 Pending Reviews</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LIST SECTION */}
        <div className="lg:col-span-4 space-y-4">
          <div className="admin-card p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-secondary" />
              <input type="text" placeholder="Search RX ID or customer..." className="admin-input pl-10" />
            </div>
            <div className="flex gap-2">
              {['Pending', 'Approved', 'Rejected'].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeFilter === f ? 'bg-primary-500 text-white shadow-lg shadow-brand-500/20' : 'bg-slate-50 text-admin-text-secondary hover:bg-slate-100'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {prescriptions.map((rx) => (
              <motion.div
                key={rx.id}
                whileHover={{ x: 4 }}
                onClick={() => setSelectedPrescription(rx)}
                className={`admin-card p-4 cursor-pointer transition-all border-2 ${selectedPrescription?.id === rx.id ? 'border-primary-500 bg-primary-50/30' : 'border-transparent hover:border-slate-200'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-primary-600">{rx.id}</span>
                  <span className="text-[10px] text-admin-text-secondary">{rx.date}</span>
                </div>
                <h4 className="text-sm font-bold text-admin-text-primary">{rx.customer}</h4>
                <div className="flex items-center justify-between mt-3">
                  <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase ${
                    rx.status === 'Pending' ? 'text-amber-600' : 
                    rx.status === 'Approved' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {rx.status === 'Pending' ? <Clock className="w-3.5 h-3.5" /> : 
                     rx.status === 'Approved' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {rx.status}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedPrescription ? (
              <motion.div
                key={selectedPrescription.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="admin-card min-h-[600px] flex flex-col"
              >
                <div className="p-6 border-b border-admin-border flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-bold text-admin-text-primary">Prescription Details</h3>
                      <p className="text-xs text-admin-text-secondary font-medium">Verify the clinical validity of the document.</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="admin-btn-ghost p-2 border border-admin-border rounded-xl">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button className="admin-btn-ghost p-2 border border-admin-border rounded-xl">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0">
                  {/* Left: Metadata */}
                  <div className="p-6 border-r border-admin-border space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold text-admin-text-secondary uppercase tracking-widest">Verification Checklist</h4>
                      {[
                        'Patient name matches account',
                        'Doctor registration number visible',
                        'Prescription is not expired (within 6 months)',
                        'Clear dosage information provided',
                        'Digital signature or physical stamp present'
                      ].map((item, i) => (
                        <label key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer group">
                          <input type="checkbox" className="w-4 h-4 rounded text-primary-500 border-slate-300 focus:ring-primary-500" />
                          <span className="text-xs font-medium text-admin-text-primary group-hover:text-primary-700 transition-colors">{item}</span>
                        </label>
                      ))}
                    </div>

                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 space-y-2">
                      <p className="text-xs font-bold text-blue-900">Doctor Information</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[9px] font-bold text-blue-600 uppercase">Name</p>
                          <p className="text-xs font-bold text-blue-800">{selectedPrescription.doctorName}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-blue-600 uppercase">Reg No</p>
                          <p className="text-xs font-bold text-blue-800">MCI-22485</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Image Preview */}
                  <div className="p-6 bg-slate-50 flex flex-col items-center justify-center gap-4">
                    <div className="w-full aspect-[3/4] bg-white rounded-2xl shadow-inner border border-admin-border overflow-hidden relative group">
                      <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-mono text-xs p-8 text-center">
                        [Prescription Image Placeholder]<br/>Verify clinical signatures and dates before approval.
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="px-6 py-2 bg-white text-admin-text-primary text-xs font-bold rounded-xl shadow-2xl">View Full Scale</button>
                      </div>
                    </div>
                    <div className="flex gap-4 w-full mt-auto">
                      <button className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all flex items-center justify-center gap-2">
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                      <button className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-green-600/20 hover:bg-green-700 transition-all flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Approve
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="admin-card min-h-[600px] flex flex-col items-center justify-center text-center p-12 border-dashed">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                  <ClipboardList className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-xl font-display font-bold text-admin-text-primary mb-2">Select a Prescription</h3>
                <p className="text-admin-text-secondary max-w-sm">Choose a prescription from the list on the left to review the document and verify clinical details.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Prescriptions;
