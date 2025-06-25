import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Send, 
  Download, 
  Trash2, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  PenTool,
  Users,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import Loader from '../ui/Loader';
import Error404 from '../ui/404error';
import Navbar from '../Navbar/Navbar';
import DocumentPreview from './Modals/DocumentPreview';
import ResendModal from './Modals/ResendModal';

const Manage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('manage');
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const [showResendModal, setShowResendModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [serverError, setServerError] = useState(false);

  const loadingStates = [
    { text: 'Loading documents...' },
    { text: 'Fetching document status...' },
    { text: 'Preparing management interface...' },
    { text: 'Setting up workspace...' }
  ];

  useEffect(() => {
    // Check authentication
    const username = localStorage.getItem('username');
    if (!username) {
      navigate('/signin');
      return;
    }

    const fetchDocuments = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/documents/all');
        if (!response.ok) {
          throw new Error('Server connection failed');
        }
        
        const data = await response.json();
        setDocuments(data.documents);
        setFilteredDocuments(data.documents);
      } catch (error) {
        console.error('Error fetching documents:', error);
        setServerError(true);
      } finally {
        setTimeout(() => setLoading(false), 3000);
      }
    };

    fetchDocuments();
  }, [navigate]);

  // Handle quick view from Home page stats
  useEffect(() => {
    if (location.state?.quickView) {
      setStatusFilter(location.state.quickView);
    }
  }, [location.state]);

  // Filter documents based on search and status
  useEffect(() => {
    let filtered = documents;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.DocumentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.AuthorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.Signees.some(signee => 
          signee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          signee.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      const currentUser = localStorage.getItem('username') || 'John Doe';
      
      filtered = filtered.filter(doc => {
        switch (statusFilter) {
          case 'actionRequired':
            // Documents where John Doe needs to sign
            const isSignee = doc.Signees.some(signee => signee.name === currentUser);
            const hasAlreadySigned = doc.AlreadySigned.some(signed => signed.name === currentUser);
            return isSignee && !hasAlreadySigned && doc.Status === 'Sent for signature';
            
          case 'waitingForOthers':
            // Documents where John has signed or is author, waiting for others
            const hasJohnSigned = doc.AlreadySigned.some(signed => signed.name === currentUser);
            const isAuthor = doc.AuthorName === currentUser;
            const totalSignees = doc.Signees.length;
            const totalSigned = doc.AlreadySigned.length;
            
            const johnSignedWaitingForOthers = hasJohnSigned && totalSigned < totalSignees && doc.Status !== 'Completed';
            const authorWaitingForOthers = isAuthor && totalSigned < totalSignees && doc.Status !== 'Completed' && doc.Status !== 'Draft';
            
            return johnSignedWaitingForOthers || authorWaitingForOthers;
            
          case 'drafts':
            return doc.Status === 'Draft' && doc.AuthorName === currentUser;
            
          case 'completed':
            return doc.Status === 'Completed';
            
          default:
            return true;
        }
      });
    }

    setFilteredDocuments(filtered);
  }, [documents, searchTerm, statusFilter]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Draft':
        return <PenTool className="w-4 h-4 text-gray-500" />;
      case 'Sent for signature':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'Completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Sent for signature':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Completed':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleDocumentAction = (action, document) => {
    switch (action) {
      case 'view':
        setSelectedDocument(document);
        setShowDocumentPreview(true);
        break;
      case 'sign':
        navigate('/signeeui');
        break;
      case 'resend':
        setSelectedDocument(document);
        setShowResendModal(true);
        break;
      case 'download':
        console.log('Download document:', document.DocumentName);
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete "${document.DocumentName}"?`)) {
          console.log('Delete document:', document.DocumentName);
        }
        break;
      case 'edit':
        navigate('/signsetupui', { state: { from: '/manage' } });
        break;
      default:
        break;
    }
  };

  const handleResend = (recipients) => {
    console.log('Resending to:', recipients);
    // Here you would typically make an API call to resend the document
  };

  const getActionButtons = (document) => {
    const currentUser = localStorage.getItem('username') || 'John Doe';
    const isAuthor = document.AuthorName === currentUser;
    const isSignee = document.Signees.some(signee => signee.name === currentUser);
    const hasAlreadySigned = document.AlreadySigned.some(signed => signed.name === currentUser);
    const needsToSign = isSignee && !hasAlreadySigned && document.Status === 'Sent for signature';

    const buttons = [];

    // View button - always available
    buttons.push(
      <button
        key="view"
        onClick={() => handleDocumentAction('view', document)}
        className="flex items-center space-x-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
        title="View document"
      >
        <Eye className="w-4 h-4" />
        <span>View</span>
      </button>
    );

    // Sign button - if user needs to sign
    if (needsToSign) {
      buttons.push(
        <button
          key="sign"
          onClick={() => handleDocumentAction('sign', document)}
          className="flex items-center space-x-1 px-3 py-1.5 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors font-medium"
          title="Sign document"
        >
          <PenTool className="w-4 h-4" />
          <span>Sign</span>
        </button>
      );
    }

    // Edit button - for drafts by author
    if (document.Status === 'Draft' && isAuthor) {
      buttons.push(
        <button
          key="edit"
          onClick={() => handleDocumentAction('edit', document)}
          className="flex items-center space-x-1 px-3 py-1.5 text-sm text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-md transition-colors"
          title="Edit document"
        >
          <PenTool className="w-4 h-4" />
          <span>Edit</span>
        </button>
      );
    }

    // Resend button - for authors of sent documents
    if (document.Status === 'Sent for signature' && isAuthor) {
      buttons.push(
        <button
          key="resend"
          onClick={() => handleDocumentAction('resend', document)}
          className="flex items-center space-x-1 px-3 py-1.5 text-sm text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-md transition-colors"
          title="Resend document"
        >
          <Send className="w-4 h-4" />
          <span>Resend</span>
        </button>
      );
    }

    // Download button - for completed documents
    if (document.Status === 'Completed') {
      buttons.push(
        <button
          key="download"
          onClick={() => handleDocumentAction('download', document)}
          className="flex items-center space-x-1 px-3 py-1.5 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors"
          title="Download document"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
      );
    }

    return buttons;
  };

  const getSigningProgress = (document) => {
    const totalSignees = document.Signees.length;
    const signedCount = document.AlreadySigned.length;
    const percentage = totalSignees > 0 ? (signedCount / totalSignees) * 100 : 0;

    return (
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[60px]">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-xs text-gray-600 whitespace-nowrap">
          {signedCount}/{totalSignees}
        </span>
      </div>
    );
  };

  if (serverError) {
    return <Error404 />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-CloudbyzBlue/5 via-white to-CloudbyzBlue/10 font-sans">
      <Loader loading={loading}>
        {loadingStates}
      </Loader>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} showTabs={true} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Management</h1>
          <p className="text-gray-600">Manage and track all your documents in one place</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search documents, authors, or recipients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-CloudbyzBlue focus:border-CloudbyzBlue transition-colors"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter by status:</span>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-CloudbyzBlue focus:border-CloudbyzBlue transition-colors"
              >
                <option value="all">All Documents</option>
                <option value="actionRequired">Action Required</option>
                <option value="waitingForOthers">Waiting for Others</option>
                <option value="drafts">Drafts</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <FileText className="w-12 h-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                        <p className="text-gray-500">
                          {searchTerm || statusFilter !== 'all' 
                            ? 'Try adjusting your search or filter criteria.'
                            : 'Upload your first document to get started.'
                          }
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map((document) => (
                    <tr key={document.DocumentID} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-CloudbyzBlue/10 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-CloudbyzBlue" />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {document.DocumentName}
                            </div>
                            <div className="text-sm text-gray-500">
                              by {document.AuthorName} • {document.TotalPages} page{document.TotalPages !== 1 ? 's' : ''}
                            </div>
                            <div className="flex items-center mt-1 space-x-2">
                              <Users className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {document.Signees.length} recipient{document.Signees.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(document.Status)}`}>
                          {getStatusIcon(document.Status)}
                          <span>{document.Status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {document.Status === 'Draft' ? (
                          <span className="text-sm text-gray-500">Not sent</span>
                        ) : (
                          getSigningProgress(document)
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {format(new Date(document.LastChangedDate), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(document.LastChangedDate), 'h:mm a')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getActionButtons(document)}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Summary */}
        {filteredDocuments.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Showing {filteredDocuments.length} of {documents.length} documents
            </p>
          </div>
        )}
      </main>

      {/* Modals */}
      <DocumentPreview
        isOpen={showDocumentPreview}
        onClose={() => setShowDocumentPreview(false)}
        pdfUrl={null}
        showNextButton={false}
      />

      <ResendModal
        isOpen={showResendModal}
        onClose={() => setShowResendModal(false)}
        document={selectedDocument}
        onResend={handleResend}
      />
    </div>
  );
};

export default Manage;