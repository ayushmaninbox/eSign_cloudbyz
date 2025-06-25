import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings as SettingsIcon, 
  LogOut, 
  Camera, 
  Save, 
  X,
  UserCircle,
  HelpCircle,
  ChevronRight,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MessageCircle
} from 'lucide-react';
import Navbar from './Navbar';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const sidebarItems = [
    { id: 'profile', label: 'Profile Settings', icon: UserCircle },
    { id: 'account', label: 'Account Settings', icon: SettingsIcon },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Settings</h2>
        <p className="text-sm text-gray-600 mt-1">Manage your account preferences</p>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                    activeSection === item.id
                      ? 'bg-CloudbyzBlue text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-CloudbyzBlue'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${
                      activeSection === item.id ? 'text-white' : 'text-gray-500 group-hover:text-CloudbyzBlue'
                    }`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${
                    activeSection === item.id ? 'text-white rotate-90' : 'text-gray-400 group-hover:text-CloudbyzBlue'
                  }`} />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

const ProfileSettings = () => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    bio: '',
    phone: '',
    location: ''
  });
  const [userPhoto, setUserPhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Load user data from localStorage
    const username = localStorage.getItem('username') || '';
    const email = localStorage.getItem('useremail') || '';
    const photo = localStorage.getItem('userPhoto');
    const bio = localStorage.getItem('userBio') || '';
    const phone = localStorage.getItem('userPhone') || '';
    const location = localStorage.getItem('userLocation') || '';

    setFormData({
      username,
      fullName: username,
      email,
      bio,
      phone,
      location
    });
    setUserPhoto(photo);
    setPreviewPhoto(photo);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewPhoto(e.target.result);
        setIsEditing(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPreviewPhoto(null);
    setIsEditing(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage
      localStorage.setItem('username', formData.fullName);
      localStorage.setItem('useremail', formData.email);
      localStorage.setItem('userBio', formData.bio);
      localStorage.setItem('userPhone', formData.phone);
      localStorage.setItem('userLocation', formData.location);
      
      if (previewPhoto !== userPhoto) {
        if (previewPhoto) {
          localStorage.setItem('userPhoto', previewPhoto);
        } else {
          localStorage.removeItem('userPhoto');
        }
        setUserPhoto(previewPhoto);
      }
      
      setIsEditing(false);
      
      // Trigger a custom event to update navbar
      window.dispatchEvent(new CustomEvent('userProfileUpdated'));
      
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    const username = localStorage.getItem('username') || '';
    const email = localStorage.getItem('useremail') || '';
    const photo = localStorage.getItem('userPhoto');
    const bio = localStorage.getItem('userBio') || '';
    const phone = localStorage.getItem('userPhone') || '';
    const location = localStorage.getItem('userLocation') || '';

    setFormData({
      username,
      fullName: username,
      email,
      bio,
      phone,
      location
    });
    setPreviewPhoto(photo);
    setIsEditing(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'JD';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-CloudbyzBlue/10 to-CloudbyzBlue/5 px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Profile Settings</h3>
          <p className="text-sm text-gray-600 mt-1">Update your personal information and profile picture</p>
        </div>

        <div className="p-6">
          {/* Profile Photo Section */}
          <div className="flex items-center space-x-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                {previewPhoto ? (
                  <img
                    src={previewPhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-CloudbyzBlue text-white flex items-center justify-center text-xl font-bold">
                    {getInitials(formData.fullName)}
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-CloudbyzBlue text-white rounded-full flex items-center justify-center hover:bg-CloudbyzBlue/90 transition-colors shadow-lg"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Profile Picture</h4>
              <p className="text-sm text-gray-600 mb-4">Upload a new profile picture. Recommended size: 400x400px, max 5MB.</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 px-4 py-2 bg-CloudbyzBlue text-white rounded-lg hover:bg-CloudbyzBlue/90 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Photo</span>
                </button>
                {previewPhoto && (
                  <button
                    onClick={handleRemovePhoto}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={(e) => {
                  handleInputChange(e);
                  setIsEditing(true);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-CloudbyzBlue focus:border-CloudbyzBlue transition-colors"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={(e) => {
                  handleInputChange(e);
                  setIsEditing(true);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-CloudbyzBlue focus:border-CloudbyzBlue transition-colors"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => {
                  handleInputChange(e);
                  setIsEditing(true);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-CloudbyzBlue focus:border-CloudbyzBlue transition-colors"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(e) => {
                  handleInputChange(e);
                  setIsEditing(true);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-CloudbyzBlue focus:border-CloudbyzBlue transition-colors"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={(e) => {
                  handleInputChange(e);
                  setIsEditing(true);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-CloudbyzBlue focus:border-CloudbyzBlue transition-colors"
                placeholder="Enter your location"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={(e) => {
                  handleInputChange(e);
                  setIsEditing(true);
                }}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-CloudbyzBlue focus:border-CloudbyzBlue transition-colors resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 px-6 py-2 bg-CloudbyzBlue text-white rounded-lg hover:bg-CloudbyzBlue/90 transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AccountSettings = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    setIsChangingPassword(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Password Change Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-CloudbyzBlue/10 to-CloudbyzBlue/5 px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Change Password</h3>
          <p className="text-sm text-gray-600 mt-1">Update your account password</p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-CloudbyzBlue focus:border-CloudbyzBlue transition-colors"
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-CloudbyzBlue focus:border-CloudbyzBlue transition-colors"
                  placeholder="Enter new password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-CloudbyzBlue focus:border-CloudbyzBlue transition-colors"
                  placeholder="Confirm new password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="flex items-center space-x-2 px-6 py-2 bg-CloudbyzBlue text-white rounded-lg hover:bg-CloudbyzBlue/90 transition-colors disabled:opacity-50"
            >
              {isChangingPassword ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Changing...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Change Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Account Preferences */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-CloudbyzBlue/10 to-CloudbyzBlue/5 px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Account Preferences</h3>
          <p className="text-sm text-gray-600 mt-1">Manage your account settings</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-800">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <button className="px-4 py-2 bg-CloudbyzBlue text-white rounded-lg hover:bg-CloudbyzBlue/90 transition-colors">
              Enable
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-800">Login Notifications</h4>
              <p className="text-sm text-gray-600">Get notified when someone logs into your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-CloudbyzBlue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-CloudbyzBlue"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-800">Session Timeout</h4>
              <p className="text-sm text-gray-600">Automatically log out after period of inactivity</p>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-CloudbyzBlue focus:border-CloudbyzBlue">
              <option>30 minutes</option>
              <option>1 hour</option>
              <option>2 hours</option>
              <option>Never</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

const HelpAndSupport = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-CloudbyzBlue/10 to-CloudbyzBlue/5 px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Help & Support</h3>
          <p className="text-sm text-gray-600 mt-1">Get help and contact support</p>
        </div>

        <div className="p-6">
          <div className="space-y-8">
            {/* Getting Started */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <HelpCircle className="w-5 h-5 mr-2 text-CloudbyzBlue" />
                Getting Started
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <p className="text-gray-700">
                  Welcome to Cloudbyz eSignature! Here are some quick tips to get you started:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Upload your documents in PDF format for signing</li>
                  <li>Add recipients and configure signing order if needed</li>
                  <li>Place signature fields, initials, and text fields where required</li>
                  <li>Send documents for signature and track progress in real-time</li>
                  <li>Download completed documents from the Manage section</li>
                </ul>
              </div>
            </div>

            {/* Common Questions */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Frequently Asked Questions</h4>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-800 mb-2">How do I create a signature?</h5>
                  <p className="text-gray-600 text-sm">
                    You can create signatures by drawing, typing, or uploading an image. When signing a document, 
                    click on a signature field and choose your preferred method from the signature modal.
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-800 mb-2">Are my documents secure?</h5>
                  <p className="text-gray-600 text-sm">
                    Yes, all documents are encrypted with bank-level security. We use 256-bit SSL encryption 
                    and comply with global e-signature regulations including eIDAS and ESIGN Act.
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-800 mb-2">Can I track document status?</h5>
                  <p className="text-gray-600 text-sm">
                    Absolutely! You can track document status in real-time from the Manage section. 
                    You'll see who has signed, who still needs to sign, and receive notifications for updates.
                  </p>
                </div>
              </div>
            </div>

            {/* Features Overview */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Key Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h5 className="font-medium text-CloudbyzBlue mb-2">Digital Signatures</h5>
                  <p className="text-gray-600 text-sm">
                    Create legally binding electronic signatures with multiple signature types.
                  </p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Multi-Party Signing</h5>
                  <p className="text-gray-600 text-sm">
                    Add multiple signers with custom signing order and automatic reminders.
                  </p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Real-Time Tracking</h5>
                  <p className="text-gray-600 text-sm">
                    Monitor document status and get instant notifications for updates.
                  </p>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4">
                  <h5 className="font-medium text-orange-600 mb-2">Document Management</h5>
                  <p className="text-gray-600 text-sm">
                    Organize and manage all your signed documents in one secure location.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-gradient-to-r from-CloudbyzBlue/5 to-CloudbyzBlue/10 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-CloudbyzBlue" />
                Need More Help?
              </h4>
              <p className="text-gray-700 mb-4">
                If you can't find the answer you're looking for, our support team is here to help. 
                We typically respond within 24 hours during business days.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center space-x-3 bg-white rounded-lg p-4 flex-1">
                  <Mail className="w-5 h-5 text-CloudbyzBlue" />
                  <div>
                    <p className="font-medium text-gray-800">Email Support</p>
                    <a 
                      href="mailto:support@cloudbyz.com" 
                      className="text-CloudbyzBlue hover:text-CloudbyzBlue/80 text-sm"
                    >
                      support@cloudbyz.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 bg-white rounded-lg p-4 flex-1">
                  <Phone className="w-5 h-5 text-CloudbyzBlue" />
                  <div>
                    <p className="font-medium text-gray-800">Phone Support</p>
                    <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-gray-600 text-sm">
                  For any help or support, please contact us at{' '}
                  <a 
                    href="mailto:support@cloudbyz.com" 
                    className="text-CloudbyzBlue hover:text-CloudbyzBlue/80 font-medium"
                  >
                    support@cloudbyz.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Settings = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');

  useEffect(() => {
    // Check authentication
    const username = localStorage.getItem('username');
    if (!username) {
      navigate('/signin');
      return;
    }
  }, [navigate]);

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSettings />;
      case 'account':
        return <AccountSettings />;
      case 'help':
        return <HelpAndSupport />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-CloudbyzBlue/5 via-white to-CloudbyzBlue/10">
      <Navbar showTabs={false} />
      
      <div className="flex pt-16 h-screen">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        
        <div className="flex-1 overflow-y-auto">
          <div className="py-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;