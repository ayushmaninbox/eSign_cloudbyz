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

// API endpoint to get filtered documents
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

// API endpoint to get document statistics
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});