import React, { useState, useRef, Fragment, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import { format } from "date-fns";
import { useNavigate, useLocation } from 'react-router-dom';
import {
  User,
  Search,
  ChevronDown,
  Check,
  Clock,
  AlertTriangle,
  Download,
  RefreshCw,
  Eye,
  FileText,
  ChevronLeft,
  ChevronRight,
  PenTool,
  Bell,
  Plus,
  Upload,
  Inbox,
  Send,
  FileEdit,
  Archive,
  X,
  Calendar,
  Users,
  Building2,
  Shield,
  Clock4,
  ExternalLink,
  Mail,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  DownloadCloudIcon,
  Settings,
  LogOut,
  UserCircle,
  Layers,
  XCircle,
  Trash2
} from "lucide-react";
import Error404 from '../ui/404error';
import Loader from '../ui/Loader';
import Navbar from '../Navbar/Navbar';

// Import modals
import UploadModal from './Manage_Modals/UploadModal';
import ResendModal from './Manage_Modals/ResendModal';
import DocumentPreview from './Manage_Modals/DocumentPreview';
import CancelModal from '../ui/CancelModal';
import DeleteModal from './Manage_Modals/DeleteModal';

const Sidebar = ({ activeSection, setActiveSection, setShowUploadModal }) => {
  const menuItems = [
    { id: "inbox", label: "Inbox", icon: Inbox },
    { id: "sent", label: "Sent", icon: Send },
    { id: "received", label: "Received", icon: Download },
    { id: "drafts", label: "Drafts", icon: FileEdit },
  ];

  const quickViews = [
    { id: "actionRequired", label: "Action Required", icon: AlertCircle },
    { id: "waitingForOthers", label: "Waiting for Others", icon: Clock },
    { id: "completed", label: "Completed", icon: Check },
    { id: "cancelled", label: "Cancelled", icon: XCircle }
  ];

  return (
    <div className="fixed left-0 top-16 bottom-0 w-64 bg-white shadow-sm border-r border-gray-200 z-20">
      <div className="p-4">
        <button
          onClick={() => setShowUploadModal(true)}
          className="w-full bg-CloudbyzBlue hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
        >
          <Plus className="w-4 h-4" />
          <span className="font-semibold tracking-wide">NEW DOCUMENT</span>
        </button>
      </div>

      <div className="px-4">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            ENVELOPES
          </h3>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                  activeSection === item.id
                    ? "bg-blue-50 text-CloudbyzBlue border-r-2 border-CloudbyzBlue"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            QUICK VIEWS
          </h3>
          <nav className="space-y-1">
            {quickViews.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                  activeSection === item.id
                    ? "bg-blue-50 text-CloudbyzBlue border-r-2 border-CloudbyzBlue"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

const StatusIcon = ({ status }) => {
  switch (status) {
    case "Completed":
      return <Check className="w-5 h-5 text-green-500" />;
    case "Sent for signature":
      return <Clock className="w-5 h-5 text-amber-500" />;
    case "Draft":
      return <PenTool className="w-5 h-5 text-blue-500" />;
    case "Cancelled":
      return <XCircle className="w-5 h-5 text-red-500" />;
    default:
      return null;
  }
};

const StatusBar = ({ document }) => {
  const totalSignees = document.Signees.length;
  const signedCount = document.AlreadySigned.length;
  const percentage = totalSignees > 0 ? (signedCount / totalSignees) * 100 : 0;

  return (
    <div className="flex items-center space-x-2">
      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-gray-600">
        {signedCount}/{totalSignees} signed
      </span>
    </div>
  );
};

const AnimatedText = ({ text, maxWidth = "150px" }) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const textRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (textRef.current && containerRef.current) {
      const textWidth = textRef.current.scrollWidth;
      const containerWidth = containerRef.current.clientWidth;
      setShouldAnimate(textWidth > containerWidth);
    }
  }, [text]);

  return (
    <div ref={containerRef} className="overflow-hidden" style={{ maxWidth }}>
      <div
        ref={textRef}
        className={`whitespace-nowrap ${
          shouldAnimate ? "animate-marquee hover:animation-paused" : ""
        }`}
      >
        {text}
      </div>
    </div>
  );
};

const TruncatedText = ({ text, maxLength = 50 }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  if (!text) return <span className="text-gray-400">No reason provided</span>;
  
  const truncatedText = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  const needsTruncation = text.length > maxLength;

  return (
    <div className="relative">
      <div
        className={`text-sm text-gray-700 ${needsTruncation ? 'cursor-help' : ''}`}
        onMouseEnter={() => needsTruncation && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {truncatedText}
      </div>
      
      {showTooltip && needsTruncation && (
        <div className="absolute bottom-full left-0 mb-2 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-50 max-w-xs break-words">
          {text}
          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};

const SigneesList = ({ signees, maxVisible = 2 }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (signees.length === 0)
    return <span className="text-xs text-gray-500">No signees</span>;

  const visibleSignees = signees.slice(0, maxVisible);
  const remainingCount = signees.length - maxVisible;

  return (
    <div className="flex items-center space-x-1">
      <span className="text-xs text-gray-600">
        {visibleSignees.map((s) => s.name.split(" ")[0]).join(", ")}
        {remainingCount > 0 && (
          <span
            className="relative cursor-pointer text-CloudbyzBlue hover:text-blue-800"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {` + ${remainingCount} more`}
            {showTooltip && (
              <div className="absolute bottom-full left-0 mb-2 p-2 bg-black text-white text-xs rounded shadow-lg whitespace-nowrap z-50 max-w-xs">
                {signees
                  .slice(maxVisible, maxVisible + 2)
                  .map((s) => s.name.split(" ")[0])
                  .join(", ")}
                {remainingCount > 2 && "..."}
              </div>
            )}
          </span>
        )}
      </span>
    </div>
  );
};

const Manage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('manage');
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("DateAdded");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [activeSection, setActiveSection] = useState("inbox");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showResendModal, setShowResendModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resendDocument, setResendDocument] = useState(null);
  const [cancelDocument, setCancelDocument] = useState(null);
  const [deleteDocument, setDeleteDocument] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState(false);
  const [notificationUpdate, setNotificationUpdate] = useState(0);
  const itemsPerPage = 10;

  const loadingStates = [
    { text: 'Loading document management...' },
    { text: 'Fetching your documents...' },
    { text: 'Organizing document data...' },
    { text: 'Preparing workspace...' }
  ];

  const currentUser = {
    email: "john.doe@cloudbyz.com",
    id: "us1122334456",
  };

  useEffect(() => {
    // Check authentication
    const username = localStorage.getItem('username');
    if (!username) {
      navigate('/signin');
      return;
    }

    // Check if we came from dashboard with a specific view
    if (location.state?.quickView) {
      setActiveSection(location.state.quickView);
    }

    fetchDocuments();
  }, [navigate, location.state]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/documents/all");
      
      if (!response.ok) {
        throw new Error('Server connection failed');
      }
      
      const data = await response.json();

      const processedDocuments = data.documents.map((doc) => {
        if (doc.Status === "Sent for signature") {
          const totalSignees = doc.Signees.length;
          const signedCount = doc.AlreadySigned.length;

          if (totalSignees > 0 && signedCount === totalSignees) {
            return { ...doc, Status: "Completed" };
          }
        }
        return doc;
      });

      setDocuments(processedDocuments);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setServerError(true);
    } finally {
      setTimeout(() => setLoading(false), 3000);
    }
  };

  const handleDocumentUpdate = (updatedDocument) => {
    setDocuments(prevDocs => 
      prevDocs.map(doc => 
        doc.DocumentID === updatedDocument.DocumentID ? updatedDocument : doc
      )
    );
  };

  const handleDocumentDelete = (documentId) => {
    setDocuments(prevDocs => 
      prevDocs.filter(doc => doc.DocumentID !== documentId)
    );
  };

  const handlePreviewClick = (doc) => {
    const isAuthor =
      doc.AuthorEmail === currentUser.email && doc.AuthorID === currentUser.id;

    if (isAuthor) {
      setPreviewDocument(doc);
    } else {
      alert("Only the author of the document can access the preview.");
    }
  };

  const getAvailableActions = (document) => {
    const isAuthor =
      document.AuthorEmail === currentUser.email &&
      document.AuthorID === currentUser.id;
    const isSignee = document.Signees.some(
      (signee) => signee.email === currentUser.email
    );
    const hasUserSigned = document.AlreadySigned.some(
      (signed) => signed.email === currentUser.email
    );

    const actions = [];

    if (document.Status === "Draft" && isAuthor) {
      actions.push("Setup Sign");
      actions.push("Delete");
    } else if (document.Status === "Sent for signature") {
      if (isAuthor) {
        actions.push("Resend");
        actions.push("Cancel");
      }
      if (isSignee && !hasUserSigned) {
        actions.push("Sign");
      }
    } else if (document.Status === "Completed" && (isAuthor || isSignee)) {
      actions.push("Download");
    }

    // Add Cancel action for Draft and Sent for signature if user is author
    if ((document.Status === "Draft" || document.Status === "Sent for signature") && isAuthor) {
      if (!actions.includes("Cancel")) {
        actions.push("Cancel");
      }
    }

    if (isAuthor) {
      actions.push("Preview");
    }

    return actions;
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const removeNotificationForDocument = async (documentID) => {
    try {
      // Find and remove notification for this document
      const response = await fetch('http://localhost:5000/api/notifications/remove-by-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentID }),
      });

      if (response.ok) {
        // Trigger notification update in navbar
        setNotificationUpdate(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error removing notification:", error);
    }
  };

  const handleActionClick = (action, document) => {
    // Log all action clicks with document details
    console.log(`Action clicked: ${action}`, {
      DocumentID: document.DocumentID,
      DocumentName: document.DocumentName,
      DateAdded: document.DateAdded,
      LastChangedDate: document.LastChangedDate,
      Status: document.Status,
      timestamp: new Date().toISOString()
    });

    if (action === "Setup Sign") {
      navigate('/recipientselection', { state: { from: '/manage' } });
    } else if (action === "Resend") {
      setResendDocument(document);
      setShowResendModal(true);
    } else if (action === "Cancel") {
      setCancelDocument(document);
      setShowCancelModal(true);
    } else if (action === "Delete") {
      setDeleteDocument(document);
      setShowDeleteModal(true);
    } else if (action === "Download") {
      console.log('Download action for document:', [document.DocumentID, document.DocumentName]);
    } else if (action === "Preview") {
      handlePreviewClick(document);
    } else if (action === "Sign") {
      // Remove the notification for this document when signing
      removeNotificationForDocument(document.DocumentID);
      
      // Pass the complete document data through navigation state
      navigate('/signeeui', { 
        state: { 
          from: '/manage',
          documentData: document
        } 
      });
    } else {
      console.log(`Performing ${action} on document:`, document);
    }
  };

  const getFilteredDocuments = () => {
    return documents.filter((doc) => {
      const isAuthor =
        doc.AuthorEmail === currentUser.email &&
        doc.AuthorID === currentUser.id;
      const isSignee = doc.Signees.some(
        (signee) => signee.email === currentUser.email
      );

      if (!isAuthor && !isSignee) {
        return false;
      }

      // Enhanced search to include signee names
      const matchesSearch =
        doc.DocumentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.AuthorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.Signees.some(signee => 
          signee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          signee.email.toLowerCase().includes(searchQuery.toLowerCase())
        );

      switch (activeSection) {
        case "inbox":
          return matchesSearch && doc.Status !== "Cancelled";
        case "sent":
          return matchesSearch && isAuthor && doc.Status !== "Cancelled";
        case "received":
          return matchesSearch && isSignee && doc.Status !== "Cancelled";
        case "drafts":
          return matchesSearch && doc.Status === "Draft";
        case "actionRequired":
          const needsUserSignature = isSignee && !doc.AlreadySigned.some(signed => signed.email === currentUser.email) && doc.Status === 'Sent for signature';
          return matchesSearch && needsUserSignature;
        case "waitingForOthers":
          const isAuthorWaiting = isAuthor && doc.AlreadySigned.length < doc.Signees.length && doc.Status !== 'Completed' && doc.Status !== 'Draft' && doc.Status !== 'Cancelled';
          const hasUserSignedWaiting = doc.AlreadySigned.some(signed => signed.email === currentUser.email) && doc.AlreadySigned.length < doc.Signees.length && doc.Status !== 'Completed' && doc.Status !== 'Cancelled';
          return matchesSearch && (isAuthorWaiting || hasUserSignedWaiting);
        case "completed":
          return matchesSearch && doc.Status === "Completed";
        case "cancelled":
          return matchesSearch && doc.Status === "Cancelled";
        default:
          return matchesSearch && doc.Status !== "Cancelled";
      }
    });
  };

  const filteredAndSortedDocuments = getFilteredDocuments().sort((a, b) => {
    let comparison = 0;
    if (sortField === "LastChangedDate" || sortField === "DateAdded") {
      const dateA = new Date(a[sortField]);
      const dateB = new Date(b[sortField]);
      comparison = dateA.getTime() - dateB.getTime();
    } else if (sortField === "DocumentName") {
      comparison = a.DocumentName.localeCompare(b.DocumentName);
    } else if (sortField === "Status") {
      comparison = a.Status.localeCompare(b.Status);
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const totalPages = Math.ceil(
    filteredAndSortedDocuments.length / itemsPerPage
  );
  const paginatedDocuments = filteredAndSortedDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getSectionTitle = () => {
    switch (activeSection) {
      case "inbox":
        return "Inbox";
      case "sent":
        return "Sent";
      case "received":
        return "Received";
      case "drafts":
        return "Drafts";
      case "actionRequired":
        return "Action Required";
      case "waitingForOthers":
        return "Waiting for Others";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return "Documents";
    }
  };

  const clearQuickView = () => {
    setActiveSection('inbox');
  };

  if (serverError) {
    return <Error404 />;
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-16">
      <Loader loading={loading}>
        {loadingStates}
      </Loader>
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        showTabs={true}
      />
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        setShowUploadModal={setShowUploadModal}
      />

      <div className="ml-64 px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 p-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                {getSectionTitle()}
              </h1>
              <span className="text-sm text-gray-500">
                ({filteredAndSortedDocuments.length} documents)
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search documents, authors, or signees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-80 text-sm focus:outline-none focus:ring-1 focus:ring-CloudbyzBlue focus:border-CloudbyzBlue"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="w-12 px-3 py-3"></th>
                  <th
                    scope="col"
                    className="w-80 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("DocumentName")}
                  >
                    Document Name
                    <ChevronDown
                      className={`inline-block ml-1 w-3 h-3 transform ${
                        sortField === "DocumentName" && sortDirection === "desc"
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </th>
                  <th
                    scope="col"
                    className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("Status")}
                  >
                    Status
                    <ChevronDown
                      className={`inline-block ml-1 w-3 h-3 transform ${
                        sortField === "Status" && sortDirection === "desc"
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </th>
                  <th
                    scope="col"
                    className="w-40 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Author
                  </th>
                  <th
                    scope="col"
                    className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("LastChangedDate")}
                  >
                    Last Change
                    <ChevronDown
                      className={`inline-block ml-1 w-3 h-3 transform ${
                        sortField === "LastChangedDate" &&
                        sortDirection === "desc"
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </th>
                  <th
                    scope="col"
                    className="w-32 px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
                  >
                    {activeSection === "cancelled" ? "Reason" : "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedDocuments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <FileText className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg font-medium">No documents found</p>
                        <p className="text-gray-400 text-sm">
                          {searchQuery || activeSection !== 'inbox'
                            ? 'Try adjusting your search or filters'
                            : 'Upload your first document to get started'
                          }
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedDocuments.map((doc) => (
                    <tr key={doc.DocumentID} className="hover:bg-gray-50">
                      <td className="px-3 py-4 whitespace-nowrap">
                        <StatusIcon status={doc.Status} />
                      </td>
                      <td className="px-3 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          <AnimatedText
                            text={doc.DocumentName}
                            maxWidth="300px"
                          />
                        </div>
                        <div className="mt-1">
                          <SigneesList signees={doc.Signees} />
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div>
                          <span
                            className={`inline-flex text-xs ${
                              doc.Status === "Completed"
                                ? "text-green-800"
                                : doc.Status === "Sent for signature"
                                ? "text-amber-800"
                                : doc.Status === "Cancelled"
                                ? "text-red-800"
                                : "text-blue-800"
                            }`}
                          >
                            {doc.Status}
                          </span>
                          {doc.Status === "Sent for signature" && (
                            <div className="mt-1">
                              <StatusBar document={doc} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        <AnimatedText text={doc.AuthorName} maxWidth="150px" />
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-xs text-gray-500">
                        <div>
                          <div>
                            {format(new Date(doc.LastChangedDate), "MMM d, yyyy")}
                          </div>
                          <div className="text-gray-400">
                            {format(new Date(doc.LastChangedDate), "h:mm a")}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium text-center">
                        {activeSection === "cancelled" ? (
                          <div className="text-sm text-gray-700 max-w-xs">
                            {doc.CancelledReason ? (
                              <div className="text-left">
                                <div className="font-medium text-gray-900 mb-1">
                                  {doc.CancelledReason.name}
                                </div>
                                <TruncatedText 
                                  text={doc.CancelledReason.reason} 
                                  maxLength={30}
                                />
                              </div>
                            ) : (
                              <span className="text-gray-400">No reason provided</span>
                            )}
                          </div>
                        ) : (
                          <div
                            className={`flex items-center justify-center space-x-2 ${
                              isDownloading ? "opacity-50 pointer-events-none" : ""
                            }`}
                          >
                            <Menu as="div" className="relative">
                              <Menu.Button className="text-sm font-medium text-gray-800 border border-gray-300 rounded px-3 py-1.5 flex items-center">
                                Actions <ChevronDown className="ml-1 w-4 h-4" />
                              </Menu.Button>
                              <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                              >
                                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                  {getAvailableActions(doc).map((action) => (
                                    <Menu.Item key={action}>
                                      {({ active }) => (
                                        <button
                                          className={`${
                                            active ? "bg-gray-100" : ""
                                          } block px-4 py-2 text-sm w-full text-left ${
                                            action === "Cancel" || action === "Delete" 
                                              ? "text-red-700" 
                                              : "text-gray-700"
                                          }`}
                                          onClick={() =>
                                            handleActionClick(action, doc)
                                          }
                                        >
                                          {action}
                                        </button>
                                      )}
                                    </Menu.Item>
                                  ))}
                                </Menu.Items>
                              </Transition>
                            </Menu>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {paginatedDocuments.length > 0 && (
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * itemsPerPage + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        currentPage * itemsPerPage,
                        filteredAndSortedDocuments.length
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {filteredAndSortedDocuments.length}
                    </span>{" "}
                    results
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-md border ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    } text-sm font-medium`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-md border ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    } text-sm font-medium`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <UploadModal isOpen={showUploadModal} setIsOpen={setShowUploadModal} />
      <ResendModal
        isOpen={showResendModal}
        setIsOpen={setShowResendModal}
        document={resendDocument}
        onDocumentUpdate={handleDocumentUpdate}
      />
      <CancelModal
        isOpen={showCancelModal}
        setIsOpen={setShowCancelModal}
        document={cancelDocument}
        onDocumentUpdate={handleDocumentUpdate}
      />
      <DeleteModal
        isOpen={showDeleteModal}
        setIsOpen={setShowDeleteModal}
        document={deleteDocument}
        onDocumentDelete={handleDocumentDelete}
      />
      {previewDocument && (
        <DocumentPreview
          isOpen={!!previewDocument}
          setIsOpen={(isOpen) => !isOpen && setPreviewDocument(null)}
          document={previewDocument}
        />
      )}
    </div>
  );
};

export default Manage;