import React from 'react';
import { HelpCircle, Lock, Shield, FileText, Mail, Phone, MessageCircle } from 'lucide-react';

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

export default HelpAndSupport;