import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PenTool, Type, FileText, Play, ArrowRight } from "lucide-react";
import Loader from "../ui/Loader";
import Error404 from "../ui/404error";
import Navbar from "../Navbar/Navbar";
import Toast from "../ui/Toast";

// Import modals
import EmailLinkAuthModal from "./SigneeUI_Modals/EmailLinkAuthModal";
import SignatureAuthModal from "./SigneeUI_Modals/SignatureAuthModal";
import TermsAcceptanceBar from "./SigneeUI_Modals/TermsAcceptanceBar";
import SignatureModal from "./SigneeUI_Modals/SignatureModal";
import InitialsModal from "./SigneeUI_Modals/InitialsModal";
import TextModal from "./SigneeUI_Modals/TextModal";

const SigneeUI = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pageUrls, setPageUrls] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [canvasDimensions, setCanvasDimensions] = useState({});
  const [signatureElements, setSignatureElements] = useState([]);
  const [savedSignature, setSavedSignature] = useState(null);
  const [savedInitials, setSavedInitials] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentElementIndex, setCurrentElementIndex] = useState(-1);
  const [signingStarted, setSigningStarted] = useState(false);
  const [showInitialAuthModal, setShowInitialAuthModal] = useState(false);
  const [hasShownInitialAuth, setHasShownInitialAuth] = useState(false);
  const [showTermsBar, setShowTermsBar] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  // Modal states
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showInitialsModal, setShowInitialsModal] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [showSigningAuthModal, setShowSigningAuthModal] = useState(false);
  const [currentElementId, setCurrentElementId] = useState(null);
  const [currentElementType, setCurrentElementType] = useState(null);
  const [pendingSignatureData, setPendingSignatureData] = useState(null);
  const [pendingReason, setPendingReason] = useState("");

  const numPages = pageUrls.length;

  const loadingStates = [
    { text: "Loading document for signing..." },
    { text: "Preparing signature fields..." },
    { text: "Setting up authentication..." },
    { text: "Ready to sign..." },
  ];

  const navigatingStates = [
    { text: "Saving signatures..." },
    { text: "Finalizing document..." },
    { text: "Processing completion..." },
    { text: "Redirecting..." },
  ];

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
  };

  const drawImageOnCanvas = useCallback((canvas, imageUrl, pageIndex) => {
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const container = canvas.parentElement;
      const containerWidth = container.clientWidth;

      // Make canvas fill the entire container width (75% of screen)
      canvas.width = containerWidth;
      const aspectRatio = img.height / img.width;
      canvas.height = containerWidth * aspectRatio;

      // Set canvas display size to match container
      canvas.style.width = "100%";
      canvas.style.height = "auto";

      setCanvasDimensions((prev) => ({
        ...prev,
        [pageIndex]: {
          width: canvas.width,
          height: canvas.height,
        },
      }));

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    img.src = imageUrl;
  }, []);

  useEffect(() => {
    // Clear session storage on page load (simulates page reload behavior)
    sessionStorage.clear();

    // Check authentication status
    const username = localStorage.getItem("username");
    const useremail = localStorage.getItem("useremail");
    const firstTimeUser = localStorage.getItem("firstTimeUser");

    if (username && useremail) {
      setIsAuthenticated(true);
      // Show terms bar only for first time users
      if (firstTimeUser === "true") {
        setShowTermsBar(true);
      } else {
        setTermsAccepted(true);
      }
    } else {
      setIsAuthenticated(false);
      // Show initial auth modal only once when user directly accesses the page
      if (!hasShownInitialAuth) {
        setShowInitialAuthModal(true);
        setHasShownInitialAuth(true);
      }
    }

    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/images");
        if (!response.ok) {
          throw new Error("Server connection failed");
        }

        const data = await response.json();
        setPageUrls(data.images);

        // Initialize signature elements
        const elements = [
          {
            id: "sig-page3-1",
            type: "signature",
            page: 2,
            x: 150,
            y: 400,
            width: 200,
            height: 80,
            signed: false,
          },
          {
            id: "sig-page5-1",
            type: "signature",
            page: 4,
            x: 150,
            y: 300,
            width: 200,
            height: 80,
            signed: false,
          },
          {
            id: "sig-page6-1",
            type: "signature",
            page: 5,
            x: 150,
            y: 200,
            width: 200,
            height: 80,
            signed: false,
          },
          {
            id: "init-page7-1",
            type: "initials",
            page: 6,
            x: 150,
            y: 300,
            width: 80,
            height: 40,
            signed: false,
          },
          {
            id: "text-page8-1",
            type: "text",
            page: 7,
            x: 150,
            y: 250,
            width: 250,
            height: 60,
            signed: false,
          },
        ];

        setSignatureElements(elements);
      } catch (error) {
        console.error("Error fetching data:", error);
        setServerError(true);
      } finally {
        setTimeout(() => setIsLoading(false), 3000);
      }
    };

    fetchData();
  }, [hasShownInitialAuth]);

  // Load saved signatures/initials from session storage
  useEffect(() => {
    const savedSig = sessionStorage.getItem("sessionSignature");
    const savedInit = sessionStorage.getItem("sessionInitials");

    if (savedSig) {
      setSavedSignature(savedSig);
    }

    if (savedInit) {
      setSavedInitials(JSON.parse(savedInit));
    }
  }, []);

  useEffect(() => {
    const initializeCanvases = () => {
      pageUrls.forEach((url, index) => {
        const pageCanvas = document.getElementById(`page-${index}`);
        if (pageCanvas) drawImageOnCanvas(pageCanvas, url, index);
      });
    };

    if (pageUrls.length > 0) {
      setTimeout(initializeCanvases, 100);
    }

    const handleResize = () => {
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(initializeCanvases, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(window.resizeTimeout);
    };
  }, [drawImageOnCanvas, pageUrls]);

  // Update current page based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const mainContainer = document.getElementById("main-container");
      if (!mainContainer) return;

      const containerRect = mainContainer.getBoundingClientRect();
      const containerTop = containerRect.top;
      const containerHeight = containerRect.height;
      const centerY = containerTop + containerHeight / 2;

      // Find which page is closest to the center of the viewport
      
      let closestPage = 1;
      let closestDistance = Infinity;

      for (let i = 1; i <= numPages; i++) {
        const pageElement = document.getElementById(`page-container-${i}`);
        if (pageElement) {
          const pageRect = pageElement.getBoundingClientRect();
          const pageCenter = pageRect.top + pageRect.height / 2;
          const distance = Math.abs(pageCenter - centerY);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestPage = i;
          }
        }
      }

      if (closestPage !== currentPage) {
        setCurrentPage(closestPage);
      }
    };

    const mainContainer = document.getElementById("main-container");
    if (mainContainer) {
      mainContainer.addEventListener("scroll", handleScroll);
      return () => mainContainer.removeEventListener("scroll", handleScroll);
    }
  }, [currentPage, numPages]);

  const handleTermsAccept = () => {
    setTermsAccepted(true);
    setShowTermsBar(false);
    // Mark user as no longer first time
    localStorage.setItem("firstTimeUser", "false");
  };

  const handleInitialAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowInitialAuthModal(false);
    // Check if this is a first time user
    const firstTimeUser = localStorage.getItem("firstTimeUser");
    if (firstTimeUser === "true") {
      setShowTermsBar(true);
    } else {
      setTermsAccepted(true);
    }
  };

  const handleSigningAuthSuccess = () => {
    // If we were in the middle of signing, continue with the process
    if (currentElementType === "signature") {
      if (!savedSignature && pendingSignatureData) {
        setSavedSignature(pendingSignatureData);
        sessionStorage.setItem("sessionSignature", pendingSignatureData);
      }

      setSignatureElements((prev) =>
        prev.map((el) =>
          el.id === currentElementId
            ? {
                ...el,
                signed: true,
                signedAt: new Date().toISOString(),
                reason: pendingReason,
                signatureData: savedSignature || pendingSignatureData,
              }
            : el
        )
      );
    } else if (currentElementType === "initials") {
      if (!savedInitials && pendingSignatureData) {
        setSavedInitials(pendingSignatureData);
        sessionStorage.setItem(
          "sessionInitials",
          JSON.stringify(pendingSignatureData)
        );
      }

      setSignatureElements((prev) =>
        prev.map((el) =>
          el.id === currentElementId
            ? {
                ...el,
                signed: true,
                signedAt: new Date().toISOString(),
                initialsData: savedInitials || pendingSignatureData,
              }
            : el
        )
      );
    }

    setCurrentElementId(null);
    setCurrentElementType(null);
    setPendingSignatureData(null);
    setPendingReason("");
    setShowSigningAuthModal(false);
  };

  const handleElementClick = (elementId, elementType) => {
    const element = signatureElements.find((el) => el.id === elementId);
    if (!element || element.signed) return;

    setCurrentElementId(elementId);
    setCurrentElementType(elementType);

    // Check if this is the first signature/initials element being signed
    const isFirstSignature = elementType === "signature" && !savedSignature;
    const isFirstInitials = elementType === "initials" && !savedInitials;

    // Show appropriate modal based on element type and whether it's the first time
    if (elementType === "signature") {
      // Always show signature modal for signatures (includes reason selection)
      setShowSignatureModal(true);
    } else if (elementType === "initials") {
      if (isFirstInitials) {
        // First initials - show initials modal
        setShowInitialsModal(true);
      } else {
        // Subsequent initials - show auth modal directly (no reason required for initials)
        setShowSigningAuthModal(true);
      }
    } else if (elementType === "text") {
      // Text elements always show text modal (no auth or reason required)
      setShowTextModal(true);
    }
  };

  const handleSignatureSave = (signatureData, reason = null) => {
    setSavedSignature(signatureData);
    setPendingSignatureData(signatureData);
    if (reason) {
      setPendingReason(reason);
    }
    setShowSignatureModal(false);

    // Show auth modal
    setShowSigningAuthModal(true);
  };

  const handleInitialsSave = (initialsData) => {
    setSavedInitials(initialsData);
    setPendingSignatureData(initialsData);
    setShowInitialsModal(false);

    // Show auth modal
    setShowSigningAuthModal(true);
  };

  const handleTextSave = (textData) => {
    // Complete the text element immediately (no auth required)
    setSignatureElements((prev) =>
      prev.map((el) =>
        el.id === currentElementId
          ? {
              ...el,
              signed: true,
              signedAt: new Date().toISOString(),
              textData: textData,
            }
          : el
      )
    );

    setShowTextModal(false);
    setCurrentElementId(null);
    setCurrentElementType(null);
  };

  const handleSigningAuthAuthenticate = () => {
    // For subsequent signatures, use saved signature data
    if (currentElementType === "signature") {
      setSignatureElements((prev) =>
        prev.map((el) =>
          el.id === currentElementId
            ? {
                ...el,
                signed: true,
                signedAt: new Date().toISOString(),
                reason: pendingReason,
                signatureData: savedSignature,
              }
            : el
        )
      );
    } else if (currentElementType === "initials") {
      setSignatureElements((prev) =>
        prev.map((el) =>
          el.id === currentElementId
            ? {
                ...el,
                signed: true,
                signedAt: new Date().toISOString(),
                initialsData: savedInitials,
              }
            : el
        )
      );
    }

    setCurrentElementId(null);
    setCurrentElementType(null);
    setPendingReason("");
    setShowSigningAuthModal(false);
  };

  const scrollToPage = useCallback(
    (pageNum) => {
      const newPageNum = Math.max(1, Math.min(pageNum, numPages));
      const pageElement = document.getElementById(
        `page-container-${newPageNum}`
      );
      if (pageElement) {
        pageElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        setCurrentPage(newPageNum);
      }
    },
    [numPages]
  );

  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = (e) => {
    if (e.type === "blur" || (e.type === "keydown" && e.key === "Enter")) {
      const newPage = parseInt(pageInput, 10);
      if (!isNaN(newPage) && newPage >= 1 && newPage <= numPages) {
        scrollToPage(newPage);
        if (e.key === "Enter" && document.activeElement) {
          document.activeElement.blur();
        }
      } else {
        setPageInput(String(currentPage));
      }
    }
  };

  const navigatePage = (direction) => {
    let newPage = currentPage + direction;
    newPage = Math.max(1, Math.min(newPage, numPages));
    scrollToPage(newPage);
  };

  const handleBack = () => {
    if (location.state?.from === "/manage") {
      navigate("/manage");
    } else if (location.state?.from === "/signsetupui") {
      navigate("/signsetupui");
    } else {
      navigate("/home");
    }
  };

  const handleFinish = async () => {
    setIsNavigating(true);

    try {
      const response = await fetch("http://localhost:5000/api/stats");
      if (!response.ok) {
        throw new Error("Server connection failed");
      }

      await new Promise((resolve) => setTimeout(resolve, 3000));

      navigate("/home", { state: { from: "/signeeui" } });
    } catch (error) {
      console.error("Server error:", error);
      setServerError(true);
    } finally {
      setIsNavigating(false);
    }
  };

  // Navigation logic for Start/Next buttons
  const handleStartSigning = () => {
    setSigningStarted(true);
    setCurrentElementIndex(0);

    // Navigate to the first signature element
    const firstElement = signatureElements[0];
    if (firstElement) {
      scrollToPage(firstElement.page + 1);
    }
  };

  const handleNextElement = () => {
    const nextIndex = currentElementIndex + 1;
    if (nextIndex < signatureElements.length) {
      setCurrentElementIndex(nextIndex);
      const nextElement = signatureElements[nextIndex];
      if (nextElement) {
        scrollToPage(nextElement.page + 1);
      }
    }
  };

  const renderSignatureElement = (element) => {
    if (!canvasDimensions[element.page]) return null;

    const canvasWidth = canvasDimensions[element.page].width;
    const canvasHeight = canvasDimensions[element.page].height;

    const actualX = (element.x / 600) * canvasWidth;
    const actualY = (element.y / 800) * canvasHeight;
    const actualWidth = (element.width / 600) * canvasWidth;
    const actualHeight = (element.height / 800) * canvasHeight;

    const elementIndex = signatureElements.findIndex(
      (el) => el.id === element.id
    );
    const isCurrentElement = elementIndex === currentElementIndex;
    const isNextElement = elementIndex === currentElementIndex + 1;

    const getElementContent = () => {
      if (element.signed) {
        if (element.type === "signature" && element.signatureData) {
          return (
            <img
              src={element.signatureData}
              alt="Signature"
              className="w-full h-full object-contain"
            />
          );
        } else if (element.type === "initials" && element.initialsData) {
          const { text, color, style } = element.initialsData;
          const styleClasses = {
            normal: "font-normal",
            bold: "font-bold",
            italic: "italic",
            "bold-italic": "font-bold italic",
          };

          return (
            <span
              className={`text-lg ${styleClasses[style] || "font-normal"}`}
              style={{ color }}
            >
              {text}
            </span>
          );
        } else if (element.type === "text" && element.textData) {
          const { text, color, bold, italic, underline } = element.textData;
          let className = "text-sm ";
          if (bold) className += "font-bold ";
          if (italic) className += "italic ";

          const style = {
            color,
            textDecoration: underline ? "underline" : "none",
            wordWrap: "break-word",
            overflowWrap: "break-word",
            hyphens: "auto",
          };

          return (
            <div className={className} style={style}>
              {text}
            </div>
          );
        }
      }

      const icons = {
        signature: <PenTool className="w-4 h-4" />,
        initials: <Type className="w-4 h-4" />,
        text: <FileText className="w-4 h-4" />,
      };

      const labels = {
        signature: "Click to Sign",
        initials: "Click for Initials",
        text: "Click to Fill",
      };

      return (
        <div className="flex items-center justify-center space-x-2 text-gray-600">
          {icons[element.type]}
          <span className="text-xs">{labels[element.type]}</span>
        </div>
      );
    };

    // Make all empty fields clickable if authenticated and terms accepted
    const isClickable = !element.signed && termsAccepted && isAuthenticated;

    let borderColor = "border-yellow-400";
    let bgColor = "bg-yellow-50";

    if (element.signed) {
      borderColor = "border-green-400";
      bgColor = "bg-green-50";
    } else if (isCurrentElement && signingStarted) {
      borderColor = "border-blue-500";
      bgColor = "bg-blue-100";
    } else if (isNextElement && signingStarted) {
      borderColor = "border-yellow-400";
      bgColor = "bg-yellow-50";
    }

    return (
      <div
        key={element.id}
        className={`absolute border-2 rounded-lg transition-all duration-200 ${borderColor} ${bgColor} ${
          isClickable ? "cursor-pointer hover:bg-blue-200" : ""
        }`}
        style={{
          left: actualX,
          top: actualY,
          width: actualWidth,
          height: actualHeight,
          zIndex: 10,
        }}
        onClick={() =>
          isClickable && handleElementClick(element.id, element.type)
        }
      >
        <div className="w-full h-full flex items-center justify-center p-2">
          {getElementContent()}
        </div>
      </div>
    );
  };

  // Button logic
  const allElementsSigned = signatureElements.every((el) => el.signed);
  const currentElementSigned =
    currentElementIndex >= 0 && currentElementIndex < signatureElements.length
      ? signatureElements[currentElementIndex].signed
      : false;
  const isLastElement = currentElementIndex === signatureElements.length - 1;

  if (serverError) {
    return <Error404 />;
  }

  if (numPages === 0) {
    return (
      <div className="flex flex-col h-screen bg-slate-100 text-slate-800 font-sans items-center justify-center">
        <Loader loading={isLoading}>{loadingStates}</Loader>

        <Navbar showTabs={false} />
        <p className="text-2xl font-semibold text-slate-600">
          Loading document...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-100 text-slate-800 font-sans min-w-[768px] relative">
      <Loader loading={isLoading}>{loadingStates}</Loader>
      <Loader loading={isNavigating}>{navigatingStates}</Loader>
      <Navbar showTabs={false} />

      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
          position="top-center"
        />
      )}

      {/* Initial Authentication Modal - only show when user directly accesses page */}
      <EmailLinkAuthModal
        isOpen={showInitialAuthModal}
        onClose={() => setShowInitialAuthModal(false)}
        onAuthenticate={handleInitialAuthSuccess}
      />

      {/* Terms Acceptance Bar - only show if authenticated and first time user */}
      {isAuthenticated && showTermsBar && (
        <TermsAcceptanceBar onAccept={handleTermsAccept} />
      )}

      {/* Header - only show if authenticated and apply blur if terms not accepted */}
      {isAuthenticated && (
        <header
          className={`bg-white shadow-sm px-6 py-3 flex items-center fixed left-0 right-0 z-20 border-b border-gray-200 ${
            termsAccepted ? "top-16" : "top-32"
          } ${!termsAccepted ? "blur-sm pointer-events-none" : ""}`}
        >
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

          <div className="flex items-center gap-4 justify-center w-1/3">
            <button
              onClick={() => navigatePage(-1)}
              disabled={currentPage <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200 transition-all duration-200"
              title="Previous Page"
            >
              <span className="text-xl text-slate-600 transform -translate-y-[1px]">
                ‹
              </span>
            </button>
            <input
              type="text"
              value={pageInput}
              onChange={handlePageInputChange}
              onBlur={handlePageInputSubmit}
              onKeyDown={handlePageInputSubmit}
              className="w-12 text-center text-sm bg-white text-slate-700 border border-slate-300 rounded-md py-1.5 focus:outline-none focus:ring-2 focus:ring-CloudbyzBlue focus:border-CloudbyzBlue transition-shadow"
            />
            <span className="px-1 text-sm text-slate-500">of {numPages}</span>
            <button
              onClick={() => navigatePage(1)}
              disabled={currentPage >= numPages}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200 transition-all duration-200"
              title="Next Page"
            >
              <span className="text-xl text-slate-600 transform -translate-y-[1px]">
                ›
              </span>
            </button>
          </div>

          <div className="w-1/3 flex justify-end">
            {/* Always show Finish button, but make it clickable only when all elements are signed */}
            <button
              onClick={allElementsSigned ? handleFinish : undefined}
              disabled={!allElementsSigned}
              className={`px-6 py-2 rounded-lg font-semibold shadow-lg transition-all duration-300 flex items-center space-x-2 ${
                allElementsSigned
                  ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:shadow-xl hover:scale-105 cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <span>Finish</span>
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
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </button>
          </div>
        </header>
      )}

      <div
        className={`flex flex-row flex-grow relative ${
          !isAuthenticated
            ? "blur-sm pointer-events-none"
            : !termsAccepted
            ? "blur-sm pointer-events-none"
            : ""
        }`}
      >
        {/* Left Sidebar - 12.5% with greyish color */}
        <aside
          className={`w-[12.5%] border-r border-gray-200 shadow-sm flex items-center justify-center ${
            isAuthenticated ? (termsAccepted ? "mt-32" : "mt-48") : "mt-16"
          }`}
        >
          {isAuthenticated && termsAccepted && (
            <div className="p-4">
              {!signingStarted ? (
                <button
                  onClick={handleStartSigning}
                  className="bg-gradient-to-r from-CloudbyzBlue to-CloudbyzBlue/80 hover:from-CloudbyzBlue/90 hover:to-CloudbyzBlue/70 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 hover:scale-105"
                >
                  <Play className="w-4 h-4" />
                  <span>Start</span>
                </button>
              ) : (
                // Always show Next button, but disable it when current element is not signed
                <button
                  onClick={handleNextElement}
                  disabled={!currentElementSigned || isLastElement}
                  className={`px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 flex items-center space-x-2 ${
                    currentElementSigned && !isLastElement
                      ? "bg-gradient-to-r from-CloudbyzBlue to-CloudbyzBlue/80 hover:from-CloudbyzBlue/90 hover:to-CloudbyzBlue/70 text-white hover:shadow-xl hover:scale-105"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </aside>

        {/* Main Content - 75% */}
        <main
          id="main-container"
          className={`w-[75%] h-full bg-slate-200 transition-all duration-300 ease-in-out relative ${
            isAuthenticated ? (termsAccepted ? "mt-32" : "mt-48") : "mt-16"
          }`}
          style={{
            maxHeight: isAuthenticated
              ? termsAccepted
                ? "calc(100vh - 128px)"
                : "calc(100vh - 192px)"
              : "calc(100vh - 64px)",
            overflowY: "scroll",
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE and Edge
          }}
        >
          {/* Hide default scrollbar for webkit browsers */}
          <style>{`
            #main-container::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          <div style={{ width: "100%", height: "100%", padding: "24px 0" }}>
            {pageUrls.map((url, index) => (
              <div
                id={`page-container-${index + 1}`}
                key={`page-container-${index + 1}`}
                className="mb-6 relative"
                style={{
                  width: "100%",
                  maxWidth: "100%",
                  margin: "0 auto 3rem auto",
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <div className="w-full h-full relative">
                  <canvas
                    id={`page-${index}`}
                    data-page-number={index + 1}
                    className="shadow-xl cursor-default"
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                    }}
                  />

                  {isAuthenticated &&
                    signatureElements
                      .filter((element) => element.page === index)
                      .map((element) => renderSignatureElement(element))}
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Right Sidebar - 12.5% with greyish color*/}
        <aside
          className={`w-[12.5%] border-l border-gray-200 shadow-sm relative ${
            isAuthenticated ? (termsAccepted ? "mt-32" : "mt-48") : "mt-16"
          }`}
        ></aside>
      </div>

      {/* Modals */}
      <SignatureModal
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSave={handleSignatureSave}
      />

      <InitialsModal
        isOpen={showInitialsModal}
        onClose={() => setShowInitialsModal(false)}
        onSave={handleInitialsSave}
      />

      <TextModal
        isOpen={showTextModal}
        onClose={() => setShowTextModal(false)}
        onSave={handleTextSave}
      />

      <SignatureAuthModal
        isOpen={showSigningAuthModal}
        onClose={() => setShowSigningAuthModal(false)}
        onAuthenticate={handleSigningAuthSuccess}
        fieldType={currentElementType}
        onBackToSignature={() => {
          setShowSigningAuthModal(false);
          setShowSignatureModal(true);
        }}
      />
    </div>
  );
};

export default SigneeUI;