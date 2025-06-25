import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  ChevronDown,
  Trash2,
  GripVertical,
  FileText,
  Mail,
  Plus,
  CheckCircle2,
  XCircle,
  X,
  MessageSquare,
  Info,
} from "lucide-react";
import Loader from "../ui/Loader";
import Error404 from "../ui/404error";
import Navbar from "../Navbar/Navbar";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
        className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm ${
          type === "success"
            ? "bg-emerald-50/90 text-emerald-800"
            : "bg-red-50/90 text-red-800"
        }`}
      >
        {type === "success" ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        ) : (
          <XCircle className="w-5 h-5 text-red-500" />
        )}
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 p-1 hover:bg-black/5 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

const RecipientRow = ({
  index,
  recipient,
  updateRecipient,
  deleteRecipient,
  users,
  showOrder,
  colors,
  signeeTypes,
  onDragStart,
  onDrop,
  onDragOver,
  recipients,
  showToast,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showSigneeTypeDropdown, setShowSigneeTypeDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserIndex, setSelectedUserIndex] = useState(-1);
  const [selectedSigneeTypeIndex, setSelectedSigneeTypeIndex] = useState(-1);
  const [dropdownDirection, setDropdownDirection] = useState({
    user: "down",
    signeeType: "down",
  });

  const userInputRef = useRef(null);
  const userDropdownRef = useRef(null);
  const signeeTypeInputRef = useRef(null);
  const signeeTypeDropdownRef = useRef(null);
  const selectedUserRef = useRef(null);
  const selectedSigneeTypeRef = useRef(null);

  const filteredUsers = users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const getInitials = (name) => {
    if (!name) return "";
    const names = name.split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  // Check dropdown positioning
  const checkDropdownPosition = (inputRef, type) => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      // If there's not enough space below (less than 250px) and more space above, open upward
      const shouldOpenUpward = spaceBelow < 250 && spaceAbove > spaceBelow;

      setDropdownDirection((prev) => ({
        ...prev,
        [type]: shouldOpenUpward ? "up" : "down",
      }));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target) &&
        userInputRef.current &&
        !userInputRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
        setSelectedUserIndex(-1);
      }
      if (
        signeeTypeDropdownRef.current &&
        !signeeTypeDropdownRef.current.contains(event.target) &&
        signeeTypeInputRef.current &&
        !signeeTypeInputRef.current.contains(event.target)
      ) {
        setShowSigneeTypeDropdown(false);
        setSelectedSigneeTypeIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedUserRef.current && userDropdownRef.current) {
      const dropdownRect = userDropdownRef.current.getBoundingClientRect();
      const selectedRect = selectedUserRef.current.getBoundingClientRect();

      if (selectedRect.bottom > dropdownRect.bottom) {
        userDropdownRef.current.scrollTop +=
          selectedRect.bottom - dropdownRect.bottom;
      } else if (selectedRect.top < dropdownRect.top) {
        userDropdownRef.current.scrollTop -=
          dropdownRect.top - selectedRect.top;
      }
    }
  }, [selectedUserIndex]);

  useEffect(() => {
    if (selectedSigneeTypeRef.current && signeeTypeDropdownRef.current) {
      const dropdownRect = signeeTypeDropdownRef.current.getBoundingClientRect();
      const selectedRect = selectedSigneeTypeRef.current.getBoundingClientRect();

      if (selectedRect.bottom > dropdownRect.bottom) {
        signeeTypeDropdownRef.current.scrollTop +=
          selectedRect.bottom - dropdownRect.bottom;
      } else if (selectedRect.top < dropdownRect.top) {
        signeeTypeDropdownRef.current.scrollTop -=
          dropdownRect.top - selectedRect.top;
      }
    }
  }, [selectedSigneeTypeIndex]);

  const handleUserKeyDown = (e) => {
    if (!showUserDropdown || filteredUsers.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedUserIndex((prev) =>
          prev < filteredUsers.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedUserIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedUserIndex >= 0) {
          handleUserSelect(filteredUsers[selectedUserIndex]);
        } else {
          const matchedUser = users.find(
            (user) => user.name.toLowerCase() === searchTerm.toLowerCase()
          );
          if (matchedUser) {
            handleUserSelect(matchedUser);
          }
        }
        break;
      default:
        break;
    }
  };

  const handleSigneeTypeKeyDown = (e) => {
    if (!showSigneeTypeDropdown || signeeTypes.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedSigneeTypeIndex((prev) =>
          prev < signeeTypes.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedSigneeTypeIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedSigneeTypeIndex >= 0) {
          handleSigneeTypeSelect(signeeTypes[selectedSigneeTypeIndex]);
        }
        break;
      default:
        break;
    }
  };

  const handleUserSelect = (user) => {
    const isDuplicate = recipients.some(
      (r, i) => i !== index && r.email === user.email
    );

    if (isDuplicate) {
      showToast("This email is already in use by another recipient", "error");
      return;
    }

    updateRecipient(index, {
      ...recipient,
      name: user.name,
      email: user.email,
    });
    setShowUserDropdown(false);
    setSearchTerm("");
    setSelectedUserIndex(-1);
  };

  const handleSigneeTypeSelect = (signeeType) => {
    updateRecipient(index, { ...recipient, signeeType });
    setShowSigneeTypeDropdown(false);
    setSelectedSigneeTypeIndex(-1);
  };

  const handleUserInputChange = (e) => {
    const value = e.target.value;
    
    // Check if user is trying to exceed 25 characters
    if (value.length > 25) {
      showToast("Maximum 25 characters allowed for name", "error");
      return;
    }
    
    setSearchTerm(value);
    setSelectedUserIndex(-1);

    // Check for duplicates when manually typing
    const matchingUser = users.find(
      (user) =>
        user.email.toLowerCase() === recipient.email.toLowerCase() &&
        recipients.some((r, i) => i !== index && r.email === user.email)
    );

    if (matchingUser) {
      showToast("This email is already in use by another recipient", "error");
      return;
    }

    updateRecipient(index, { ...recipient, name: value });
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;

    // Check if user is trying to exceed 50 characters
    if (value.length > 50) {
      showToast("Maximum 50 characters allowed for email", "error");
      return;
    }

    // Check for duplicates when manually typing email
    const isDuplicate = recipients.some(
      (r, i) => i !== index && r.email === value
    );

    if (isDuplicate) {
      showToast("This email is already in use by another recipient", "error");
      return;
    }

    updateRecipient(index, { ...recipient, email: value });
  };

  const handleUserDropdownToggle = () => {
    checkDropdownPosition(userInputRef, "user");
    setShowUserDropdown(true);
  };

  const handleSigneeTypeDropdownToggle = () => {
    checkDropdownPosition(signeeTypeInputRef, "signeeType");
    setShowSigneeTypeDropdown(true);
  };

  return (
    <div
      className="relative mb-4 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-visible transition-all hover:shadow-xl cursor-move"
      style={{
        zIndex: showUserDropdown || showSigneeTypeDropdown ? 50 - index : 10,
      }}
      draggable={showOrder}
      onDragStart={(e) => onDragStart(e, index)}
      onDrop={(e) => onDrop(e, index)}
      onDragOver={onDragOver}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl"
        style={{ backgroundColor: colors[index % colors.length] }}
      />

      <div className="flex items-center px-6 py-4">
        {showOrder && (
          <div className="flex items-center mr-3">
            <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-700">
              {index + 1}
            </span>
            <GripVertical size={18} className="ml-2 text-gray-400" />
          </div>
        )}

        {/* Signee Type Dropdown - First */}
        <div className="relative flex-1 min-w-0 mr-2">
          <div
            ref={signeeTypeInputRef}
            className="flex items-center border border-gray-200 rounded-lg px-3 py-2.5 focus-within:border-CloudbyzBlue focus-within:ring-1 focus-within:ring-CloudbyzBlue bg-white transition-all h-12"
            onClick={handleSigneeTypeDropdownToggle}
          >
            <FileText size={18} className="text-gray-500 mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Select signee type"
              className="flex-1 outline-none text-sm min-w-0 truncate cursor-pointer"
              value={recipient.signeeType}
              readOnly
              onClick={handleSigneeTypeDropdownToggle}
              onKeyDown={handleSigneeTypeKeyDown}
            />
            <ChevronDown
              size={16}
              className="text-gray-500 flex-shrink-0 ml-2"
            />
          </div>

          {showSigneeTypeDropdown && (
            <div
              ref={signeeTypeDropdownRef}
              className={`absolute z-[60] w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto ${
                dropdownDirection.signeeType === "up"
                  ? "bottom-full mb-1"
                  : "top-full mt-1"
              }`}
            >
              {signeeTypes.map((signeeType, i) => (
                <div
                  key={i}
                  ref={selectedSigneeTypeIndex === i ? selectedSigneeTypeRef : null}
                  className={`px-4 py-2 hover:bg-CloudbyzBlue/10 cursor-pointer ${
                    selectedSigneeTypeIndex === i ? "bg-CloudbyzBlue/10" : ""
                  }`}
                  onClick={() => handleSigneeTypeSelect(signeeType)}
                  onMouseEnter={() => setSelectedSigneeTypeIndex(i)}
                >
                  <span className="text-sm">{signeeType}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Name Dropdown - Second */}
        <div className="relative flex-1 min-w-0 mr-2">
          <div
            ref={userInputRef}
            className="flex items-center border border-gray-200 rounded-lg px-3 py-2.5 focus-within:border-CloudbyzBlue focus-within:ring-1 focus-within:ring-CloudbyzBlue bg-white transition-all h-12"
            onClick={handleUserDropdownToggle}
          >
            <User size={18} className="text-gray-500 mr-2 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <input
                type="text"
                placeholder="Select or type a name"
                className="w-full outline-none text-sm min-w-0 truncate"
                value={searchTerm || recipient.name}
                onChange={handleUserInputChange}
                onFocus={handleUserDropdownToggle}
                onKeyDown={handleUserKeyDown}
                maxLength={25}
              />
            </div>
            <ChevronDown
              size={16}
              className="text-gray-500 flex-shrink-0 ml-2"
            />
          </div>

          {showUserDropdown && (
            <div
              ref={userDropdownRef}
              className={`absolute z-[60] w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto ${
                dropdownDirection.user === "up"
                  ? "bottom-full mb-1"
                  : "top-full mt-1"
              }`}
            >
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, i) => (
                  <div
                    key={i}
                    ref={selectedUserIndex === i ? selectedUserRef : null}
                    className={`px-4 py-2 hover:bg-CloudbyzBlue/10 cursor-pointer flex items-center ${
                      selectedUserIndex === i ? "bg-CloudbyzBlue/10" : ""
                    }`}
                    onClick={() => handleUserSelect(user)}
                    onMouseEnter={() => setSelectedUserIndex(i)}
                  >
                    <div className="w-8 h-8 rounded-full bg-CloudbyzBlue/20 text-CloudbyzBlue flex items-center justify-center mr-3 flex-shrink-0">
                      {getInitials(user.name)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium truncate">
                        {user.name}
                      </span>
                      <span className="text-xs text-gray-500 truncate">
                        {user.email}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No users found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Email Input - Third */}
        <div className="relative flex-1 min-w-0">
          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2.5 bg-white h-12">
            <Mail size={18} className="text-gray-500 mr-2 flex-shrink-0" />
            <input
              type="email"
              value={recipient.email}
              onChange={handleEmailChange}
              placeholder="Enter email"
              className={`flex-1 outline-none text-sm min-w-0 truncate ${
                recipient.email && !recipient.email.includes("@")
                  ? "text-red-500"
                  : ""
              }`}
              maxLength={50}
            />
          </div>
        </div>

        <button
          className="ml-2 text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg flex-shrink-0"
          onClick={() => deleteRecipient(index)}
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

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

  // Check if at least one recipient has valid data with signee type
  const hasValidRecipient = recipients.some(
    (recipient) =>
      recipient.name.trim() && 
      recipient.email.trim() && 
      recipient.signeeType.trim()
  );

  // Check if ALL recipients with name and email also have a signee type
  const allRecipientsHaveSigneeType = recipients.every(
    (recipient) => {
      // If recipient has name or email, they must also have a signee type
      if (recipient.name.trim() || recipient.email.trim()) {
        return recipient.name.trim() && recipient.email.trim() && recipient.signeeType.trim();
      }
      // Empty recipients are allowed
      return true;
    }
  );

  const isNextButtonEnabled = hasValidRecipient && allRecipientsHaveSigneeType;

  const handleNext = async () => {
    if (!hasValidRecipient) {
      showToast(
        "Please add at least one recipient with complete information including signee type",
        "error"
      );
      return;
    }

    if (!allRecipientsHaveSigneeType) {
      showToast(
        "All recipients must have a name, email, and signee type",
        "error"
      );
      return;
    }

    const hasInvalidEmail = recipients.some(
      (recipient) => recipient.email && !recipient.email.includes("@")
    );

    if (hasInvalidEmail) {
      showToast("Please enter valid email addresses", "error");
      return;
    }

    setIsNavigating(true);

    try {
      // Store recipients, sign in order preference, and comments in localStorage for SignSetupUI
      const validRecipients = recipients.filter(
        (recipient) =>
          recipient.name.trim() &&
          recipient.email.trim() &&
          recipient.signeeType.trim()
      );

      localStorage.setItem("recipients", JSON.stringify(validRecipients));
      localStorage.setItem("signInOrder", JSON.stringify(showSignInOrder));
      localStorage.setItem("comments", comments);

      // Simulate loading time
      await new Promise((resolve) => setTimeout(resolve, 3000));

      console.log("Proceeding with recipients:", recipients);
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

const RecipientSelection = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Recipients />
    </div>
  );
};

export default RecipientSelection;