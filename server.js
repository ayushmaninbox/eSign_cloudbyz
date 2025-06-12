import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

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
    res.json(data);
  } catch (error) {
    console.error('Error fetching all documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// API endpoint to get document statistics for Home page
app.get('/api/stats', (req, res) => {
  try {
    const data = getDocuments();
    const filteredDocuments = filterDocumentsForJohnDoe(data.documents);
    
    // Calculate statistics
    const actionRequired = filteredDocuments.filter(doc => {
      const isSignee = doc.Signees.some(signee => signee.name === 'John Doe');
      const hasAlreadySigned = doc.AlreadySigned.some(signed => signed.name === 'John Doe');
      return isSignee && !hasAlreadySigned && (doc.Status === 'Sent for signature' || doc.Status === 'Draft');
    }).length;
    
    const waitingForOthers = filteredDocuments.filter(doc => {
      const hasJohnSigned = doc.AlreadySigned.some(signed => signed.name === 'John Doe');
      const totalSignees = doc.Signees.length;
      const totalSigned = doc.AlreadySigned.length;
      return hasJohnSigned && totalSigned < totalSignees && doc.Status !== 'Completed';
    }).length;
    
    const expiringSoon = 0; // No expiry data in the JSON
    
    const completed = filteredDocuments.filter(doc => doc.Status === 'Completed').length;
    
    res.json({
      actionRequired,
      waitingForOthers,
      expiringSoon,
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});