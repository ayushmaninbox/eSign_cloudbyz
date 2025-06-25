import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  CheckCircle2,
  XCircle,
  X,
  MessageSquare,
  Info,
} from "lucide-react";
import Loader from "../../ui/Loader";
import Error404 from "../../ui/404error";
import Navbar from "../../Navbar/Navbar";
import RecipientRow from "./RecipientRow";
import Toast from "../../ui/Toast";

const Recipients = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSignInOrder, setShowSignInOrder] = useState(false);
  const [comments, setComments] = useState("");
  const [recipients, setRecipients] = useState([
    { id: "recipient-1", name: "", email: "", signeeType: "" },
  ]);
  const [users, setUsers] = useState([]);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [serverError, setServerError] = useState(false);

  const signeeTypes = ["Author", "Approver", "Signer", "Reviewer"];

  const loadingStates = [
    { text: "Loading recipient data..." },
    { text: "Fetching user information..." },
    { text: "Preparing signature options..." },
    { text: "Setting up workspace..." },
  ];

  const navigatingStates = [
    { text: "Saving recipient information..." },
    { text: "Validating data..." },
    { text: "Preparing signature setup..." },
    { text: "Loading next step..." },
  ];

  useEffect(() => {
    // Check authentication
    const username = localStorage.getItem("username");
    if (!username) {
      navigate("/signin");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/data");

        if (!response.ok) {
          throw new Error("Server connection failed");
        }

        const data = await response.json();

        setUsers(data.users || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setServerError(true);
      } finally {
        setTimeout(() => setIsLoading(false), 3000);
      }
    };

    fetchData();
  }, [navigate]);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  const recipientColors = [
    "#009edb",
    "#10B981",
    "#F97316",
    "#8B5CF6",
    "#EC4899",
    "#14B8A6",
    "#EF4444",
  ];

  const updateRecipient = (index, newData) => {
    const updatedRecipients = [...recipients];
    updatedRecipients[index] = { ...newData, id: recipients[index].id };
    setRecipients(updatedRecipients);
  };

  const deleteRecipient = (index) => {
    if (recipients.length > 1) {
      const updatedRecipients = recipients.filter((_, i) => i !== index);
      setRecipients(updatedRecipients);
    }
  };

  const addNewRecipient = () => {
    const newId = `recipient-${recipients.length + 1}`;
    setRecipients([
      ...recipients,
      { id: newId, name: "", email: "", signeeType: "" },
    ]);
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("dragIndex", index.toString());
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("dragIndex"), 10);
    if (dragIndex !== targetIndex) {
      const items = Array.from(recipients);
      const [reorderedItem] = items.splice(dragIndex, 1);
      items.splice(targetIndex, 0, reorderedItem);
      setRecipients(items);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleBack = () => {
    // Check if we came from manage page
    if (location.state?.from === "/manage") {
      navigate("/manage");
    } else {
      // Default to home
      navigate("/home");
    }
  };

  // Check if all recipients are either completely filled or completely empty
  const validateRecipients = () => {
    const filledRecipients = [];
    const emptyRecipients = [];
    const partiallyFilledRecipients = [];

    recipients.forEach((recipient, index) => {
      const hasName = recipient.name.trim();
      const hasEmail = recipient.email.trim();
      const hasSigneeType = recipient.signeeType.trim();

      if (hasName && hasEmail && hasSigneeType) {
        filledRecipients.push(index);
      } else if (!hasName && !hasEmail && !hasSigneeType) {
        emptyRecipients.push(index);
      } else {
        partiallyFilledRecipients.push(index);
      }
    });

    return {
      filledRecipients,
      emptyRecipients,
      partiallyFilledRecipients,
      hasValidRecipients: filledRecipients.length > 0,
      hasPartiallyFilled: partiallyFilledRecipients.length > 0
    };
  };

  const validation = validateRecipients();
  const isNextButtonEnabled = validation.hasValidRecipients && !validation.hasPartiallyFilled;

  const handleNext = async () => {
    const validation = validateRecipients();

    if (!validation.hasValidRecipients) {
      showToast(
        "Please add at least one recipient with complete information",
        "error"
      );
      return;
    }

    if (validation.hasPartiallyFilled) {
      showToast(
        "Please complete all recipient fields or delete incomplete recipients",
        "error"
      );
      return;
    }

    // Check for invalid emails in filled recipients
    const filledRecipients = recipients.filter((recipient, index) => 
      validation.filledRecipients.includes(index)
    );

    const hasInvalidEmail = filledRecipients.some(
      (recipient) => recipient.email && !recipient.email.includes("@")
    );

    if (hasInvalidEmail) {
      showToast("Please enter valid email addresses", "error");
      return;
    }

    setIsNavigating(true);

    try {
      // Store only the filled recipients
      localStorage.setItem("recipients", JSON.stringify(filledRecipients));
      localStorage.setItem("signInOrder", JSON.stringify(showSignInOrder));
      localStorage.setItem("comments", comments);

      // Simulate loading time
      await new Promise((resolve) => setTimeout(resolve, 3000));

      console.log("Proceeding with recipients:", filledRecipients);
      console.log("Comments:", comments);
      // Navigate to SignSetupUI
      navigate("/signsetupui");
    } catch (error) {
      console.error("Error saving data:", error);
      setServerError(true);
    } finally {
      setIsNavigating(false);
    }
  };

  if (serverError) {
    return <Error404 />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-CloudbyzBlue/10 via-indigo-50 to-purple-50 pt-14">
      <Loader loading={isLoading}>
        {loadingStates}
      </Loader>
      <Loader loading={isNavigating}>
        {navigatingStates}
      </Loader>

      <Navbar showTabs={false} />

      <header className="bg-gradient-to-r from-CloudbyzBlue/10 via-white/70 to-CloudbyzBlue/10 backdrop-blur-sm shadow-sm px-6 py-3 flex items-center fixed top-16 left-0 right-0 z-20">
        <div className="flex items-center w-1/3">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all duration-200 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back
          </button>
        </div>
        
        <div className="flex-1 text-center">
          <h1 className="text-xl font-semibold text-CloudbyzBlue">
            Setup the Signature
          </h1>
        </div>
        
        <div className="w-1/3 flex justify-end">
          <button
            onClick={handleNext}
            disabled={!isNextButtonEnabled}
            className={`px-6 py-2 rounded-lg font-semibold shadow-lg transition-all duration-300 flex items-center space-x-2 ${
              isNextButtonEnabled
                ? "bg-gradient-to-r from-CloudbyzBlue to-CloudbyzBlue/80 hover:from-CloudbyzBlue/90 hover:to-CloudbyzBlue/70 text-white shadow-CloudbyzBlue/20 hover:scale-105"
                : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
            }`}
          >
            <span>Next</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-24 max-w-5xl">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="signInOrder"
                checked={showSignInOrder}
                onChange={() => setShowSignInOrder(!showSignInOrder)}
                className="rounded border-gray-300 text-CloudbyzBlue focus:ring-CloudbyzBlue"
              />
              <label
                htmlFor="signInOrder"
                className="ml-2 text-sm font-medium text-gray-700"
              >
                Sign in order?
              </label>
            </div>

            {/* Comments Section */}
            <div className="flex items-center space-x-3">
              <label htmlFor="comments" className="text-sm font-medium text-gray-700 flex items-center">
                <MessageSquare className="w-4 h-4 mr-1" />
                Comments:
              </label>
              <div className="relative group">
                <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                  <Info className="w-4 h-4" />
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                  This comment will be same for all signees
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
              <input
                id="comments"
                type="text"
                value={comments}
                onChange={(e) => setComments(e.target.value.slice(0, 100))}
                placeholder="Add comments (optional)"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:border-CloudbyzBlue focus:ring-1 focus:ring-CloudbyzBlue text-sm w-64"
                maxLength={100}
              />
              <div className="text-xs text-gray-500">
                {comments.length}/100
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {recipients.map((recipient, index) => (
              <RecipientRow
                key={recipient.id}
                index={index}
                recipient={recipient}
                updateRecipient={updateRecipient}
                deleteRecipient={deleteRecipient}
                users={users}
                signeeTypes={signeeTypes}
                showOrder={showSignInOrder}
                colors={recipientColors}
                onDragStart={handleDragStart}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                recipients={recipients}
                showToast={showToast}
              />
            ))}
          </div>

          <div className="mt-6">
            <button
              onClick={addNewRecipient}
              className="flex items-center bg-CloudbyzBlue hover:bg-CloudbyzBlue/90 active:bg-CloudbyzBlue text-white px-5 py-2.5 rounded-lg transition-colors shadow-md shadow-CloudbyzBlue/20"
            >
              <Plus size={18} className="mr-2" />
              Add Another Recipient
            </button>
          </div>

          {/* Validation Summary */}
          {validation.hasPartiallyFilled && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center space-x-2 text-amber-800">
                <XCircle className="w-5 h-5" />
                <span className="font-medium">Incomplete Recipients</span>
              </div>
              <p className="text-sm text-amber-700 mt-1">
                Please complete all fields for each recipient or delete incomplete entries to proceed.
              </p>
            </div>
          )}

          {validation.hasValidRecipients && !validation.hasPartiallyFilled && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 text-green-800">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Ready to Proceed</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                {validation.filledRecipients.length} recipient{validation.filledRecipients.length !== 1 ? 's' : ''} ready for signature setup.
              </p>
            </div>
          )}
        </div>
      </main>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};

export default Recipients;