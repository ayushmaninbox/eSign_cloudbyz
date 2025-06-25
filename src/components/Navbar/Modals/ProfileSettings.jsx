import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Save, 
  Upload, 
  Trash2, 
  Eye, 
  EyeOff, 
  User 
} from 'lucide-react';

const ProfileSettings = () => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    bio: '',
    phone: '',
    location: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [userPhoto, setUserPhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Load user data from localStorage
    const username = localStorage.getItem('username') || '';
    const email = localStorage.getItem('useremail') || '';
    const photo = localStorage.getItem('userPhoto');
    const bio = localStorage.getItem('userBio') || '';
    const phone = localStorage.getItem('userPhone') || '';
    const location = localStorage.getItem('userLocation') || '';

    setFormData(prev => ({
      ...prev,
      username,
      fullName: username,
      email,
      bio,
      phone,
      location
    }));
    setUserPhoto(photo);
    setPreviewPhoto(photo);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (!['currentPassword', 'newPassword', 'confirmPassword'].includes(name)) {
      setIsEditing(true);
    }
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

    setFormData(prev => ({
      ...prev,
      username,
      fullName: username,
      email,
      bio,
      phone,
      location
    }));
    setPreviewPhoto(photo);
    setIsEditing(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    setIsChangingPassword(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Password changed successfully');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setIsChangingPassword(false);
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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Profile Information */}
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                placeholder="Enter your email"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                  value={formData.currentPassword}
                  onChange={handleInputChange}
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
                  value={formData.newPassword}
                  onChange={handleInputChange}
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
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
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
    </div>
  );
};

export default ProfileSettings;