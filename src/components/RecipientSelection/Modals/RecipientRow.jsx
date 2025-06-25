import React, { useState, useEffect, useRef } from "react";
import {
  User,
  ChevronDown,
  Trash2,
  GripVertical,
  FileText,
  Mail,
} from "lucide-react";

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
              placeholder="Select signee role"
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

export default RecipientRow;