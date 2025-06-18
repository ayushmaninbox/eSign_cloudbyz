import React from 'react';
import { X } from 'lucide-react';

const TermsAndConditions = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-CloudbyzBlue/10 to-CloudbyzBlue/5 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Terms and Conditions</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure 
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non 
              proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">2. Electronic Signature Services</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, 
              eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam 
              voluptatem quia voluptas sit aspernatur aut odit aut fugit.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti 
              quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia 
              deserunt mollitia animi, id est laborum et dolorum fuga.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">3. User Responsibilities</h3>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
              <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit</li>
              <li>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</li>
              <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco</li>
              <li>Duis aute irure dolor in reprehenderit in voluptate velit esse</li>
              <li>Excepteur sint occaecat cupidatat non proident</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">4. Privacy and Data Protection</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque 
              nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae 
              sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">5. Legal Compliance</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Lorem ipsum dolor 
              sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui 
              dolorem eum fugiat quo voluptas nulla pariatur.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">6. Service Availability</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius 
              modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum 
              exercitationem ullam corporis suscipit laboriosam.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">7. Limitation of Liability</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam 
              nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti 
              quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">8. Intellectual Property</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum 
              facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo 
              minus id quod maxime placeat facere possimus.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">9. Termination</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum 
              necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">10. Governing Law</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut 
              perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
              doloremque laudantium.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">11. Changes to Terms</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. 
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui 
              ratione voluptatem sequi nesciunt.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">12. Contact Information</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius 
              modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 font-medium">Contact Details:</p>
              <p className="text-gray-600">Email: support@cloudbyz.com</p>
              <p className="text-gray-600">Phone: +1 (555) 123-4567</p>
              <p className="text-gray-600">Address: 123 Business Street, Suite 100, City, State 12345</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-CloudbyzBlue text-white rounded-lg hover:bg-CloudbyzBlue/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;