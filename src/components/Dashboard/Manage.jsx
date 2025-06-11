import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Upload, 
  ChevronDown,
  Bell,
  HelpCircle,
  User,
  PenTool,
  Send,
  Users,
  TrendingUp,
  Calendar,
  Shield,
  Search,
  Filter,
  MoreVertical,
  Download,
  Eye,
  Edit,
  Trash2,
  Share2,
  Copy,
  Archive,
  Star,
  StarOff,
  X
} from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { format } from 'date-fns';

const Navbar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/${tab}`);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-30 h-16 px-6 flex justify-between items-center border-b-2 border-CloudbyzBlue/10">
      <div className="flex items-center space-x-8">
        <img src="/images/cloudbyz.png" alt="Cloudbyz Logo" className="h-10 object-contain" />
        
        {/* Navigation Tabs */}
        <div className="flex space-x-1">
          <button
            onClick={() => handleTabChange('home')}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'home'
                ? 'bg-CloudbyzBlue text-white shadow-md'
                : 'text-gray-600 hover:text-CloudbyzBlue hover:bg-CloudbyzBlue/5'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleTabChange('manage')}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'manage'
                ? 'bg-CloudbyzBlue text-white shadow-md'
                : 'text-gray-600 hover:text-CloudbyzBlue hover:bg-CloudbyzBlue/5'
            }`}
          >
            Manage
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <span className="text-gray-700 font-medium">John Doe</span>
        <button 
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
        >
          <User className="w-5 h-5 text-slate-600" />
        </button>
      </div>
    </nav>
  );
};

const Sidebar = ({ notifications, markNotificationAsSeen }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleNotificationClick = (notification) => {
    if (notification.type === 'signature_required') {
      markNotificationAsSeen(notification.id);
    }
  };

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg border-r border-gray-200 z-20">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
        </div>
        
        <div className="space-y-3 mb-8">
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-CloudbyzBlue/5 hover:text-CloudbyzBlue rounded-lg transition-colors">
            <Upload className="h-5 w-5" />
            <span>Upload Document</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-CloudbyzBlue/5 hover:text-CloudbyzBlue rounded-lg transition-colors">
            <PenTool className="h-5 w-5" />
            <span>Create Template</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-CloudbyzBlue/5 hover:text-CloudbyzBlue rounded-lg transition-colors">
            <Send className="h-5 w-5" />
            <span>Send for Signature</span>
          </button>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
            <button 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Bell className="h-4 w-4 text-gray-600" />
              {notifications.new.length > 0 && (
                <span className="absolute -mt-2 -mr-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.new.length}
                </span>
              )}
            </button>
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {notifications.new.slice(0, 5).map((notification) => (
              <div 
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className="p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-start space-x-2">
                  {notification.type === 'signature_required' ? (
                    <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">
                      {notification.documentName}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(notification.timestamp), 'MMM dd, HH:mm')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {notifications.new.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No new notifications</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DocumentRow = ({ document, isSelected, onSelect }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState('bottom');
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Sent for signature':
        return 'bg-yellow-100 text-yellow-800';
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateDropdownPosition = () => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 200; // Approximate dropdown height
      
      // Check if there's enough space below
      const spaceBelow = viewportHeight - buttonRect.bottom;
      
      if (spaceBelow < dropdownHeight && buttonRect.top > dropdownHeight) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  };

  const handleDropdownToggle = () => {
    if (!dropdownOpen) {
      calculateDropdownPosition();
    }
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', calculateDropdownPosition);
      window.addEventListener('resize', calculateDropdownPosition);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', calculateDropdownPosition);
      window.removeEventListener('resize', calculateDropdownPosition);
    };
  }, [dropdownOpen]);

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-3 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(document.DocumentID, e.target.checked)}
          className="h-4 w-4 text-CloudbyzBlue focus:ring-CloudbyzBlue border-gray-300 rounded"
        />
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <FileText className="h-5 w-5 text-gray-400 mr-3" />
          <div>
            <div className="text-sm font-medium text-gray-900 max-w-xs truncate" title={document.DocumentName}>
              {document.DocumentName}
            </div>
            <div className="text-sm text-gray-500">
              {document.TotalPages} page{document.TotalPages !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
        {document.AuthorName}
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
        {format(new Date(document.DateAdded), 'MMM dd, yyyy')}
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
        {format(new Date(document.LastChangedDate), 'MMM dd, yyyy')}
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(document.Status)}`}>
          {document.Status}
        </span>
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex -space-x-1">
          {document.Signees.slice(0, 3).map((signee, index) => (
            <div
              key={index}
              className="w-6 h-6 bg-CloudbyzBlue/10 rounded-full flex items-center justify-center text-xs font-medium text-CloudbyzBlue border-2 border-white"
              title={signee.name}
            >
              {signee.name.split(' ').map(n => n[0]).join('')}
            </div>
          ))}
          {document.Signees.length > 3 && (
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white">
              +{document.Signees.length - 3}
            </div>
          )}
        </div>
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium text-center">
        <div className="flex items-center justify-center space-x-2">
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={handleDropdownToggle}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            
            {dropdownOpen && (
              <div 
                ref={dropdownRef}
                className={`absolute right-0 z-50 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 ${
                  dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
                }`}
              >
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                  <Copy className="h-4 w-4" />
                  <span>Duplicate</span>
                </button>
                <hr className="my-1" />
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                  <Archive className="h-4 w-4" />
                  <span>Archive</span>
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

const Manage = () => {
  const [activeTab, setActiveTab] = useState('manage');
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedDocuments, setSelectedDocuments] = useState(new Set());
  const [notifications, setNotifications] = useState({ new: [], seen: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [documentsResponse, notificationsResponse] = await Promise.all([
          fetch('http://localhost:3001/api/documents/all'),
          fetch('http://localhost:3001/api/notifications')
        ]);
        
        const documentsData = await documentsResponse.json();
        const notificationsData = await notificationsResponse.json();
        
        setDocuments(documentsData.documents);
        setFilteredDocuments(documentsData.documents);
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = documents;

    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.DocumentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.AuthorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(doc => doc.Status === statusFilter);
    }

    setFilteredDocuments(filtered);
  }, [documents, searchTerm, statusFilter]);

  const handleDocumentSelect = (documentId, isSelected) => {
    const newSelected = new Set(selectedDocuments);
    if (isSelected) {
      newSelected.add(documentId);
    } else {
      newSelected.delete(documentId);
    }
    setSelectedDocuments(newSelected);
  };

  const markNotificationAsSeen = async (notificationId) => {
    try {
      const response = await fetch('http://localhost:3001/api/notifications/mark-seen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: notificationId }),
      });

      if (response.ok) {
        setNotifications(prev => {
          const notification = prev.new.find(n => n.id === notificationId);
          if (notification) {
            return {
              new: prev.new.filter(n => n.id !== notificationId),
              seen: [notification, ...prev.seen]
            };
          }
          return prev;
        });
      }
    } catch (error) {
      console.error('Error marking notification as seen:', error);
    }
  };

  const statusOptions = ['All', 'Draft', 'Sent for signature', 'Completed'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-CloudbyzBlue/20 border-t-CloudbyzBlue mx-auto mb-4"></div>
          <p className="text-CloudbyzBlue font-medium">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-16">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Sidebar notifications={notifications} markNotificationAsSeen={markNotificationAsSeen} />
      
      <div className="ml-64 px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Document Management</h1>
          <p className="text-gray-600">Manage all your documents in one place</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-CloudbyzBlue focus:border-transparent w-full sm:w-64"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-CloudbyzBlue focus:border-transparent"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-3">
              {selectedDocuments.size > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {selectedDocuments.size} selected
                  </span>
                  <button className="px-3 py-1 text-sm bg-CloudbyzBlue text-white rounded-lg hover:bg-CloudbyzBlue/90">
                    Actions
                  </button>
                </div>
              )}
              <button className="px-4 py-2 bg-CloudbyzBlue text-white rounded-lg hover:bg-CloudbyzBlue/90 flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Upload</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <span className="sr-only">Select</span>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Modified
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Signees
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((document) => (
                  <DocumentRow
                    key={document.DocumentID}
                    document={document}
                    isSelected={selectedDocuments.has(document.DocumentID)}
                    onSelect={handleDocumentSelect}
                  />
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Manage;