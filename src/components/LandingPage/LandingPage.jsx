import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  ArrowRight, 
  FileText, 
  Shield, 
  Clock, 
  Users, 
  CheckCircle2, 
  Zap, 
  Globe, 
  Lock,
  PenTool,
  Upload,
  Send,
  Download,
  Star,
  ChevronRight,
  Play
} from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signin');
  };

  const handleLogoClick = () => {
    const username = localStorage.getItem('username');
    if (username) {
      navigate('/home');
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg z-50 h-16 px-6 flex justify-between items-center border-b border-CloudbyzBlue/10">
      <div className="flex items-center space-x-8">
        <img 
          src="/images/cloudbyz.png" 
          alt="Cloudbyz Logo" 
          className="h-10 object-contain cursor-pointer hover:scale-105 transition-transform" 
          onClick={handleLogoClick}
        />
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-700 hover:text-CloudbyzBlue transition-colors font-medium">Features</a>
          <a href="#how-it-works" className="text-gray-700 hover:text-CloudbyzBlue transition-colors font-medium">How It Works</a>
          <a href="#security" className="text-gray-700 hover:text-CloudbyzBlue transition-colors font-medium">Security</a>
        </div>
      </div>
      
      <button 
        onClick={handleGetStarted}
        className="bg-gradient-to-r from-CloudbyzBlue to-CloudbyzBlue/80 hover:from-CloudbyzBlue/90 hover:to-CloudbyzBlue/70 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 hover:scale-105 transform"
      >
        <span>Get Started</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </nav>
  );
};

const FeatureCard = ({ icon: Icon, title, description, color = "CloudbyzBlue" }) => (
  <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
    <div className={`w-16 h-16 bg-gradient-to-br from-${color} to-${color}/80 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
      <Icon className="w-8 h-8 text-white" />
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const StepCard = ({ number, icon: Icon, title, description }) => (
  <div className="flex flex-col items-center text-center group">
    <div className="relative mb-6">
      <div className="w-20 h-20 bg-gradient-to-br from-CloudbyzBlue to-CloudbyzBlue/80 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-10 h-10 text-white" />
      </div>
      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-CloudbyzBlue">
        <span className="text-CloudbyzBlue font-bold text-sm">{number}</span>
      </div>
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
    <p className="text-gray-600 max-w-sm">{description}</p>
  </div>
);

const StatCard = ({ number, label, suffix = "" }) => (
  <div className="text-center">
    <div className="text-4xl md:text-5xl font-bold text-white mb-2">
      {number}{suffix}
    </div>
    <div className="text-white/80 text-lg">{label}</div>
  </div>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGetStarted = () => {
    navigate('/signin');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-CloudbyzBlue/5 via-indigo-50 to-purple-50 pt-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-CloudbyzBlue rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                <div className="inline-flex items-center bg-CloudbyzBlue/10 text-CloudbyzBlue px-4 py-2 rounded-full text-sm font-medium mb-8">
                  <Zap className="w-4 h-4 mr-2" />
                  Trusted by thousands of businesses
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                  Sign Documents
                  <span className="block bg-gradient-to-r from-CloudbyzBlue to-purple-600 bg-clip-text text-transparent">
                    Digitally & Securely
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg">
                  Transform your document workflow with Cloudbyz eSign. Upload, send, sign, and manage documents with enterprise-grade security and legal compliance.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <button 
                    onClick={handleGetStarted}
                    className="bg-gradient-to-r from-CloudbyzBlue to-CloudbyzBlue/80 hover:from-CloudbyzBlue/90 hover:to-CloudbyzBlue/70 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105 transform text-lg"
                  >
                    <span>Start Signing Free</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  
                  <button 
                    onClick={() => scrollToSection('how-it-works')}
                    className="border-2 border-gray-300 hover:border-CloudbyzBlue text-gray-700 hover:text-CloudbyzBlue px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 hover:bg-CloudbyzBlue/5 text-lg"
                  >
                    <Play className="w-5 h-5" />
                    <span>See How It Works</span>
                  </button>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center space-x-8 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span>Bank-level Security</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Legally Binding</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-green-500" />
                    <span>Global Compliance</span>
                  </div>
                </div>
              </div>

              {/* Right Content - Visual */}
              <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                <div className="relative">
                  {/* Main Card */}
                  <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-CloudbyzBlue/10 rounded-xl flex items-center justify-center">
                          <FileText className="w-6 h-6 text-CloudbyzBlue" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">Contract Agreement</h3>
                          <p className="text-sm text-gray-500">Ready for signature</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-gray-500">2 of 3 signed</span>
                      </div>
                    </div>
                    
                    {/* Document Preview */}
                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                      <div className="space-y-3">
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        <div className="flex justify-between items-center mt-6">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-CloudbyzBlue rounded-full flex items-center justify-center">
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-medium">John Doe</span>
                          </div>
                          <div className="text-xs text-gray-500">Signed 2 hours ago</div>
                        </div>
                      </div>
                    </div>
                    
                    <button className="w-full bg-gradient-to-r from-CloudbyzBlue to-CloudbyzBlue/80 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                      Sign Document
                    </button>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-6 -right-6 bg-green-500 text-white p-3 rounded-xl shadow-lg animate-bounce">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  
                  <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                    <div className="flex items-center space-x-3">
                      <Lock className="w-5 h-5 text-CloudbyzBlue" />
                      <div>
                        <div className="text-sm font-semibold text-gray-800">Secure & Encrypted</div>
                        <div className="text-xs text-gray-500">256-bit SSL</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-CloudbyzBlue to-CloudbyzBlue/80 py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard number="99.9" suffix="%" label="Uptime Guarantee" />
            <StatCard number="256" suffix="-bit" label="SSL Encryption" />
            <StatCard number="24/7" label="Support Available" />
            <StatCard number="100" suffix="%" label="Legally Compliant" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need for
              <span className="block text-CloudbyzBlue">Digital Signatures</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Streamline your document workflow with powerful features designed for modern businesses
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Upload}
              title="Easy Document Upload"
              description="Drag and drop PDF documents or browse from your device. Support for multiple file formats with automatic optimization."
            />
            <FeatureCard
              icon={Users}
              title="Multi-Party Signing"
              description="Add multiple signers with custom signing order. Track progress and send automatic reminders to pending signers."
            />
            <FeatureCard
              icon={PenTool}
              title="Digital Signatures"
              description="Create legally binding electronic signatures with multiple signature types including drawn, typed, and uploaded signatures."
            />
            <FeatureCard
              icon={Shield}
              title="Enterprise Security"
              description="Bank-level encryption, audit trails, and compliance with global e-signature laws including eIDAS and ESIGN Act."
            />
            <FeatureCard
              icon={Clock}
              title="Real-Time Tracking"
              description="Monitor document status in real-time. Get instant notifications when documents are viewed, signed, or completed."
            />
            <FeatureCard
              icon={Download}
              title="Document Management"
              description="Organize, search, and manage all your signed documents in one secure location with automatic backup and archiving."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How Cloudbyz eSign Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get documents signed in minutes with our simple 4-step process
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            <StepCard
              number="1"
              icon={Upload}
              title="Upload Document"
              description="Upload your PDF document or create one from scratch using our document builder"
            />
            <StepCard
              number="2"
              icon={Users}
              title="Add Recipients"
              description="Add signers with their email addresses and set the signing order if needed"
            />
            <StepCard
              number="3"
              icon={PenTool}
              title="Place Signature Fields"
              description="Drag and drop signature fields, text boxes, and other form elements where needed"
            />
            <StepCard
              number="4"
              icon={Send}
              title="Send & Track"
              description="Send for signature and track progress in real-time until completion"
            />
          </div>

          {/* CTA in How It Works */}
          <div className="text-center mt-16">
            <button 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-CloudbyzBlue to-CloudbyzBlue/80 hover:from-CloudbyzBlue/90 hover:to-CloudbyzBlue/70 text-white px-10 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 hover:scale-105 transform text-lg mx-auto"
            >
              <span>Try It Free Now</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                Enterprise-Grade
                <span className="block text-CloudbyzBlue">Security & Compliance</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Your documents are protected with the highest security standards and legal compliance frameworks trusted by enterprises worldwide.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-CloudbyzBlue/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Lock className="w-6 h-6 text-CloudbyzBlue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">256-bit SSL Encryption</h3>
                    <p className="text-gray-300">All data is encrypted in transit and at rest using industry-standard encryption protocols.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-CloudbyzBlue/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-CloudbyzBlue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Legal Compliance</h3>
                    <p className="text-gray-300">Compliant with eIDAS, ESIGN Act, UETA, and other global e-signature regulations.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-CloudbyzBlue/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-CloudbyzBlue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Complete Audit Trail</h3>
                    <p className="text-gray-300">Detailed audit logs track every action taken on your documents for legal evidence.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-CloudbyzBlue rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Security Certifications</h3>
                  <p className="text-gray-300">Trusted by enterprises worldwide</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-2xl font-bold text-CloudbyzBlue mb-1">SOC 2</div>
                    <div className="text-sm text-gray-300">Type II Certified</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-2xl font-bold text-CloudbyzBlue mb-1">ISO 27001</div>
                    <div className="text-sm text-gray-300">Certified</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-2xl font-bold text-CloudbyzBlue mb-1">GDPR</div>
                    <div className="text-sm text-gray-300">Compliant</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-2xl font-bold text-CloudbyzBlue mb-1">HIPAA</div>
                    <div className="text-sm text-gray-300">Ready</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-CloudbyzBlue to-CloudbyzBlue/80">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Ready to Transform Your
            <span className="block">Document Workflow?</span>
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Join thousands of businesses who trust Cloudbyz eSign for their digital signature needs. Start signing documents securely today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              onClick={handleGetStarted}
              className="bg-white text-CloudbyzBlue px-10 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 hover:scale-105 transform text-lg"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-2 text-white/90">
              <CheckCircle2 className="w-5 h-5" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <img 
                src="/images/cloudbyz.png" 
                alt="Cloudbyz Logo" 
                className="h-12 object-contain mb-6" 
              />
              <p className="text-gray-400 mb-6 max-w-md">
                Cloudbyz eSign provides secure, legally binding electronic signatures for businesses of all sizes. Transform your document workflow today.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-CloudbyzBlue transition-colors cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-CloudbyzBlue transition-colors cursor-pointer">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-CloudbyzBlue transition-colors cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Product</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Cloudbyz eSign. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;