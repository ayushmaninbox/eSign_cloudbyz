import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Clock,
  AlertCircle,
  CheckCircle2,
  User,
  PenTool,
} from "lucide-react";
import Loader from "../ui/Loader";
import Error404 from "../ui/404error";
import Navbar from "../Navbar/Navbar";
import HomeUpload from "./Dashboard_Modals/HomeUpload";

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  const [stats, setStats] = useState({
    actionRequired: 0,
    waitingForOthers: 0,
    expiringSoon: 0,
    completed: 0,
  });
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState(false);

  const loadingStates = [
    { text: "Loading your dashboard..." },
    { text: "Fetching documents..." },
    { text: "Checking server status..." },
    { text: "Preparing your workspace..." },
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
        const [statsResponse, documentsResponse] = await Promise.all([
          fetch("http://localhost:5000/api/stats"),
          fetch("http://localhost:5000/api/documents"),
        ]);

        if (!statsResponse.ok || !documentsResponse.ok) {
          throw new Error("Server connection failed");
        }

        const statsData = await statsResponse.json();
        const documentsData = await documentsResponse.json();

        setStats(statsData);
        setDocuments(documentsData.documents);
      } catch (error) {
        console.error("Error fetching data:", error);
        setServerError(true);
      } finally {
        setTimeout(() => setLoading(false), 3000);
      }
    };

    fetchData();
  }, [navigate]);

  const handleStatCardClick = (statType) => {
    let quickView = "";
    switch (statType) {
      case "actionRequired":
        quickView = "actionRequired";
        break;
      case "waitingForOthers":
        quickView = "waitingForOthers";
        break;
      case "expiringSoon":
        quickView = "drafts";
        break;
      case "completed":
        quickView = "completed";
        break;
      default:
        return;
    }

    navigate("/manage", { state: { quickView } });
  };

  if (serverError) {
    return <Error404 />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-CloudbyzBlue/5 via-white to-CloudbyzBlue/10 font-sans">
      <Loader loading={loading}>{loadingStates}</Loader>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showTabs={true}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-CloudbyzBlue to-CloudbyzBlue/80 rounded-3xl shadow-2xl mb-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10"></div>
          <div className="relative px-8 py-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <User className="h-12 w-12 text-white" />
                </div>
                <div>
                  <div className="text-white/80 text-sm mb-2 font-medium">
                    Welcome back,
                  </div>
                  <div className="text-white text-3xl font-bold mb-1">
                    {localStorage.getItem("username") || "John Doe"}
                  </div>
                  <div className="text-white/70 text-base">
                    {localStorage.getItem("useremail") ||
                      "john.doe@cloudbyz.com"}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white/80 text-sm font-medium">
                  Dashboard Overview
                </div>
                <div className="text-white/60 text-sm">Last 6 Months</div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <button
                onClick={() => handleStatCardClick("actionRequired")}
                className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/25 transition-all duration-300 hover:scale-105 border border-white/20 cursor-pointer"
              >
                <AlertCircle className="h-8 w-8 text-white mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-2">
                  {stats.actionRequired}
                </div>
                <div className="text-white/80 text-sm font-medium">
                  Action Required
                </div>
              </button>
              <button
                onClick={() => handleStatCardClick("waitingForOthers")}
                className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/25 transition-all duration-300 hover:scale-105 border border-white/20 cursor-pointer"
              >
                <Clock className="h-8 w-8 text-white mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-2">
                  {stats.waitingForOthers}
                </div>
                <div className="text-white/80 text-sm font-medium">
                  Waiting for Others
                </div>
              </button>
              <button
                onClick={() => handleStatCardClick("expiringSoon")}
                className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/25 transition-all duration-300 hover:scale-105 border border-white/20 cursor-pointer"
              >
                <PenTool className="h-8 w-8 text-white mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-2">
                  {stats.expiringSoon}
                </div>
                <div className="text-white/80 text-sm font-medium">Drafts</div>
              </button>
              <button
                onClick={() => handleStatCardClick("completed")}
                className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/25 transition-all duration-300 hover:scale-105 border border-white/20 cursor-pointer"
              >
                <CheckCircle2 className="h-8 w-8 text-white mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-2">
                  {stats.completed}
                </div>
                <div className="text-white/80 text-sm font-medium">
                  Completed
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <HomeUpload />
      </main>
    </div>
  );
};

export default Home;