import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Serve static files from PDF_Images directory
const PDF_Images = path.join(process.cwd(), "PDF_Images");
app.use("/PDF_Images", express.static(PDF_Images));

// Read the JSON data
const getDocuments = () => {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'docu-data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error reading documents:', error);
    return { documents: [] };
  }
};

// Write documents data
const saveDocuments = (documentsData) => {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'docu-data.json');
    fs.writeFileSync(dataPath, JSON.stringify(documentsData, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving documents:', error);
    return false;
  }
};

// Read notifications data
const getNotifications = () => {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'notifications.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error reading notifications:', error);
    return { new: [], seen: [] };
  }
};

// Read app data
const getAppData = () => {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'app-data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error reading app data:', error);
    return { users: [], signatureReasons: [], otherReasons: [] };
  }
};

// Read events data
const getEvents = () => {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'events.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error reading events:', error);
    return { events: [] };
  }
};

// Read images data and generate proper URLs
const getImages = () => {
  try {
    const imagesDir = path.join(process.cwd(), 'PDF_Images');
    
    // Check if directory exists
    if (!fs.existsSync(imagesDir)) {
      console.error('PDF_Images directory does not exist');
      return { images: [] };
    }

    // Read all files from PDF_Images directory
    const files = fs.readdirSync(imagesDir);
    
    // Filter for image files and sort them numerically
    const imageFiles = files
      .filter(file => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file))
      .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || '0');
        const numB = parseInt(b.match(/\d+/)?.[0] || '0');
        return numA - numB;
      });

    // Generate URLs for the images
    const images = imageFiles.map(file => `http://localhost:${PORT}/PDF_Images/${file}`);
    
    console.log('Available images:', images);
    return { images };
  } catch (error) {
    console.error('Error reading images:', error);
    return { images: [] };
  }
};

// Write notifications data
const saveNotifications = (notifications) => {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'notifications.json');
    fs.writeFileSync(dataPath, JSON.stringify(notifications, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving notifications:', error);
    return false;
  }
};

// Write app data
const saveAppData = (appData) => {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'app-data.json');
    fs.writeFileSync(dataPath, JSON.stringify(appData, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving app data:', error);
    return false;
  }
};

// Filter documents for John Doe (either author or signee)
const filterDocumentsForJohnDoe = (documents) => {
  return documents.filter(doc => {
    // Check if John Doe is the author
    const isAuthor = doc.AuthorName === 'John Doe';
    
    // Check if John Doe is in the signees list
    const isSignee = doc.Signees.some(signee => signee.name === 'John Doe');
    
    return isAuthor || isSignee;
  });
};

// API endpoint to get filtered documents for Home page
app.get('/api/documents', (req, res) => {
  try {
    const data = getDocuments();
    const filteredDocuments = filterDocumentsForJohnDoe(data.documents);
    res.json({ documents: filteredDocuments });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// API endpoint to get all documents for Manage page
app.get('/api/documents/all', (req, res) => {
  try {
    const data = getDocuments();
    // Filter documents for manage page - only show documents where John Doe is author or signee
    // For drafts, only show if John Doe is the author
    const filteredDocuments = data.documents.filter(doc => {
      const isAuthor = doc.AuthorName === 'John Doe';
      const isSignee = doc.Signees.some(signee => signee.name === 'John Doe');
      
      // If it's a draft and John Doe is not the author, don't show it
      if (doc.Status === 'Draft' && !isAuthor) {
        return false;
      }
      
      return isAuthor || isSignee;
    });
    
    res.json({ documents: filteredDocuments });
  } catch (error) {
    console.error('Error fetching all documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// API endpoint to cancel a document
app.post('/api/documents/:documentId/cancel', (req, res) => {
  try {
    const { documentId } = req.params;
    const { reason, cancelledBy } = req.body;
    
    const data = getDocuments();
    const documentIndex = data.documents.findIndex(doc => doc.DocumentID === documentId);
    
    if (documentIndex === -1) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    const document = data.documents[documentIndex];
    
    // Update document status and add cancellation reason
    data.documents[documentIndex] = {
      ...document,
      Status: 'Cancelled',
      LastChangedDate: new Date().toISOString(),
      CancelledReason: {
        name: cancelledBy,
        reason: reason
      }
    };
    
    if (saveDocuments(data)) {
      res.json(data.documents[documentIndex]);
    } else {
      res.status(500).json({ error: 'Failed to save document changes' });
    }
  } catch (error) {
    console.error('Error cancelling document:', error);
    res.status(500).json({ error: 'Failed to cancel document' });
  }
});

// API endpoint to delete a document
app.delete('/api/documents/:documentId', (req, res) => {
  try {
    const { documentId } = req.params;
    
    const data = getDocuments();
    const documentIndex = data.documents.findIndex(doc => doc.DocumentID === documentId);
    
    if (documentIndex === -1) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Remove the document from the array
    data.documents.splice(documentIndex, 1);
    
    if (saveDocuments(data)) {
      res.json({ success: true, message: 'Document deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete document' });
    }
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

// API endpoint to get document statistics for Home page
app.get('/api/stats', (req, res) => {
  try {
    const data = getDocuments();
    const filteredDocuments = filterDocumentsForJohnDoe(data.documents);
    
    // Calculate statistics
    // Action Required - documents where John Doe hasn't signed yet
    const actionRequired = filteredDocuments.filter(doc => {
      const isSignee = doc.Signees.some(signee => signee.name === 'John Doe');
      const hasAlreadySigned = doc.AlreadySigned.some(signed => signed.name === 'John Doe');
      return isSignee && !hasAlreadySigned && doc.Status === 'Sent for signature';
    }).length;
    
    // Waiting for Others - docs where John has signed and others haven't OR docs where John is author and others haven't finished signing
    const waitingForOthers = filteredDocuments.filter(doc => {
      const isAuthor = doc.AuthorName === 'John Doe';
      const hasJohnSigned = doc.AlreadySigned.some(signed => signed.name === 'John Doe');
      const totalSignees = doc.Signees.length;
      const totalSigned = doc.AlreadySigned.length;
      
      // Case 1: John has signed and others haven't completed
      const johnSignedWaitingForOthers = hasJohnSigned && totalSigned < totalSignees && doc.Status !== 'Completed';
      
      // Case 2: John is author and others haven't finished signing
      const authorWaitingForOthers = isAuthor && totalSigned < totalSignees && doc.Status !== 'Completed' && doc.Status !== 'Draft';
      
      return johnSignedWaitingForOthers || authorWaitingForOthers;
    }).length;
    
    // Drafts - John's draft documents
    const drafts = filteredDocuments.filter(doc => 
      doc.Status === 'Draft' && doc.AuthorName === 'John Doe'
    ).length;
    
    // Completed - documents signed by everyone
    const completed = filteredDocuments.filter(doc => doc.Status === 'Completed').length;
    
    res.json({
      actionRequired,
      waitingForOthers,
      expiringSoon: drafts, // This will be displayed as "Drafts"
      completed
    });
  } catch (error) {
    console.error('Error calculating stats:', error);
    res.status(500).json({ error: 'Failed to calculate statistics' });
  }
});

// API endpoint to get all notifications
app.get('/api/notifications', (req, res) => {
  try {
    const notifications = getNotifications();
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// API endpoint to mark notification as seen
app.post('/api/notifications/mark-seen', (req, res) => {
  try {
    const notifications = getNotifications();
    const { id } = req.body;
    
    const notificationIndex = notifications.new.findIndex(n => n.id === id);
    
    if (notificationIndex !== -1) {
      const [notification] = notifications.new.splice(notificationIndex, 1);
      notifications.seen.push(notification);
      
      if (saveNotifications(notifications)) {
        res.status(200).json({ success: true });
      } else {
        res.status(500).json({ error: 'Failed to save notification update' });
      }
    } else {
      res.status(404).json({ error: 'Notification not found' });
    }
  } catch (error) {
    console.error('Error marking notification as seen:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// API endpoint to remove notification by document ID
app.post('/api/notifications/remove-by-document', (req, res) => {
  try {
    const notifications = getNotifications();
    const { documentID } = req.body;
    
    // Find and remove notifications for this document
    const initialLength = notifications.new.length;
    notifications.new = notifications.new.filter(n => n.documentID !== documentID);
    
    const removedCount = initialLength - notifications.new.length;
    
    if (removedCount > 0) {
      if (saveNotifications(notifications)) {
        res.status(200).json({ success: true, removedCount });
      } else {
        res.status(500).json({ error: 'Failed to save notification update' });
      }
    } else {
      res.status(200).json({ success: true, removedCount: 0 });
    }
  } catch (error) {
    console.error('Error removing notification by document:', error);
    res.status(500).json({ error: 'Failed to remove notification' });
  }
});

// API endpoint to get app data (users and signature reasons)
app.get('/api/data', (req, res) => {
  try {
    const appData = getAppData();
    res.json({
      ...appData,
      signatureReasons: [...appData.signatureReasons],
      otherReasons: appData.otherReasons || []
    });
  } catch (error) {
    console.error('Error fetching app data:', error);
    res.status(500).json({ error: 'Failed to fetch app data' });
  }
});

// API endpoint to add new signature reasons
app.post('/api/reasons', (req, res) => {
  try {
    const { reason, addToSignatureReasons } = req.body;
    const appData = getAppData();
    
    if (addToSignatureReasons) {
      if (!appData.signatureReasons.includes(reason)) {
        appData.signatureReasons.push(reason);
      }
    } else {
      if (!appData.otherReasons) {
        appData.otherReasons = [];
      }
      if (!appData.otherReasons.includes(reason)) {
        appData.otherReasons.push(reason);
      }
    }
    
    if (saveAppData(appData)) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Failed to save reason' });
    }
  } catch (error) {
    console.error('Error saving reason:', error);
    res.status(500).json({ error: 'Failed to save reason' });
  }
});

// API endpoint to delete signature reasons
app.delete('/api/reasons/:reason', (req, res) => {
  try {
    const reasonToDelete = decodeURIComponent(req.params.reason);
    const appData = getAppData();
    
    if (appData.otherReasons) {
      appData.otherReasons = appData.otherReasons.filter(reason => reason !== reasonToDelete);
      if (saveAppData(appData)) {
        res.json({ success: true });
      } else {
        res.status(500).json({ error: 'Failed to delete reason' });
      }
    } else {
      res.json({ success: true });
    }
  } catch (error) {
    console.error('Error deleting reason:', error);
    res.status(500).json({ error: 'Failed to delete reason' });
  }
});

// API endpoint to get all events
app.get('/api/events', (req, res) => {
  try {
    const data = getEvents();
    res.json(data);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// API endpoint to get all images
app.get('/api/images', (req, res) => {
  try {
    const data = getImages();
    res.json(data);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`PDF Images served from: http://localhost:${PORT}/PDF_Images/`);
  
  // Log available images on startup
  const images = getImages();
  console.log(`Found ${images.images.length} images in PDF_Images directory`);
});