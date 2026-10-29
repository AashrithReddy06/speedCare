import React, { useState, useRef } from 'react';
import axios from 'axios';

const predefinedTechniques = {
  "burn": "Cool the burn with cool or lukewarm water for 20 minutes. Do not use ice or creams. Cover the burn with a sterile bandage or clean cloth. Seek medical help for severe burns.",
  "bleeding": "Apply firm, direct pressure to the wound with a clean cloth. Elevate the injured area if possible. Do not remove the cloth if it becomes soaked; add more on top. Call 108 if the bleeding is severe or won't stop.",
  "choking": "Perform the Heimlich maneuver: Stand behind the person, place your arms around their waist, and give quick upward thrusts just above their navel until the object is dislodged.",
  "fainting": "Lay the person on their back. Elevate their legs above heart level if possible. Loosen tight clothing. If they don't regain consciousness quickly, call emergency services.",
  "fracture": "Immobilize the injured area. Do not try to realign the bone. Apply a cold pack wrapped in cloth to reduce swelling. Keep the person calm and seek medical attention.",
  "heart attack": "1. Have the person sit down, rest, and try to keep calm.\n2. Loosen tight clothing.\n3. If they are not allergic, give them an aspirin to chew.\n4. Call 108 immediately.",
  "cpr": "Place the heel of one hand on the center of the chest, place the other hand on top, and push hard and fast (100-120 compressions per minute). Allow the chest to fully recoil between compressions.",
  "seizure": "Ease the person to the floor. Turn them gently onto one side to keep the airway clear. Clear the area of hard or sharp objects. Put something soft and flat under their head. Do not put anything in their mouth.",
  "snake bite": "Keep the person calm and still. Keep the bitten area below the level of the heart. Remove any tight clothing or jewelry near the bite. Seek immediate medical attention. Do not try to suck the venom out."
};
const API_URL = process.env.REACT_APP_API_URL || "https://backend-m450.onrender.com";

function PedestrianDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [medications, setMedications] = useState([]);
  const [predefinedResults, setPredefinedResults] = useState([]);
  
  // Chat States
  const [messages, setMessages] = useState([
    { text: "Hello! I am your AI Emergency Assistant. I can help provide instructions if no verified methods are found.", sender: "bot" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [detectedTablets, setDetectedTablets] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef(null);

  // Common medication keywords to detect in AI response
  const medKeywords = ["aspirin", "paracetamol", "ibuprofen", "cetirizine", "antacid", "digene", "gelusil", "loperamide", "benadryl", "betadine", "epipen"];

   const triggerAI = async (query, imageBase64 = null) => {
    const userMsg = { text: query, sender: "user", image: imageBase64 };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    if (imageBase64) setIsScanning(true);
    setDetectedTablets([]);
    try {
      const res = await axios.post(`${API_URL}/api/chat`, { 
        message: query,
        image: imageBase64
      });
      const aiResponse = res.data;
      setMessages(prev => [...prev, { text: aiResponse, sender: "bot" }]);

      // Detect medications in the AI response
      const lowerAI = aiResponse.toLowerCase();
      const foundMeds = medKeywords.filter(med => lowerAI.includes(med));
      
      if (foundMeds.length > 0) {
        // Fetch specific details for these medications from our DB
        const tabletDetails = [];
        for (const medName of foundMeds) {
          try {
            const medRes = await axios.get(`${API_URL}/api/medications/search?situation=${medName}`);
            if (medRes.data.length > 0) {
              tabletDetails.push(...medRes.data);
            }
          } catch (err) {
            console.error("Error fetching med detail:", medName);
          }
        }
        // Deduplicate and set
        const uniqueMeds = Array.from(new Set(tabletDetails.map(m => m.id)))
          .map(id => tabletDetails.find(m => m.id === id));
        setDetectedTablets(uniqueMeds);
      }

    } finally {
      setIsTyping(false);
      setIsScanning(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;
    
    // Reset states
    setDetectedTablets([]);
    setPredefinedResults([]);
    setMedications([]);

    // Check Predefined
    const query = searchTerm.toLowerCase();
    const foundPredefined = [];
    Object.keys(predefinedTechniques).forEach(key => {
      if (query.includes(key) || key.includes(query)) {
        foundPredefined.push({ situation: key, method: predefinedTechniques[key] });
      }
    });
    setPredefinedResults(foundPredefined);

    // Check DB
    try {
      const res = await axios.get(`${API_URL}/api/medications/search?situation=${searchTerm}`);
      setMedications(res.data);
      
      // If nothing found in predefined and DB, trigger AI automatically
      if (foundPredefined.length === 0 && res.data.length === 0) {
        triggerAI("How to treat: " + searchTerm);
      }
    } catch (err) {
      console.error(err);
      alert('Error searching for medications');
    }
  };

   const handleAIQuery = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() && !selectedImage) return;
    
    const userMessage = chatInput;
    const imageData = selectedImage;
    
    setChatInput('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    
    await triggerAI(userMessage, imageData);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const findNearestHospitals = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        window.open(`https://www.google.com/maps/search/hospitals/@${lat},${lng},14z/data=!3m1!4b1`, '_blank');
      }, () => {
        window.open('https://www.google.com/maps/search/hospitals', '_blank');
      });
    } else {
      window.open('https://www.google.com/maps/search/hospitals', '_blank');
    }
  };

  return (
    <div>
      <div className="welcome-header" style={{ marginBottom: '1.5rem' }}>
        <h1>Pedestrian Dashboard 🚶</h1>
        <p>Find immediate help for an injured person before the ambulance arrives.</p>
        
        {/* Quick Actions Base */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <a href="tel:108" className="btn btn-danger" style={{display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem'}}>
            🚨 Call 108 Emergency
          </a>
          <button onClick={findNearestHospitals} className="btn " style={{display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', background: '#e6f2ff', borderColor: 'var(--primary)', color: 'var(--primary)'}}>
            🏥 Find Nearest Hospital
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Local Medication Search */}
        <div style={{ flex: '1 1 400px' }}>
          <div className="card">
            <h3>Search Treatments</h3>
            <p className="text-muted mb-3">Search predefined knowledge and verified doctor treatments.</p>
            <form style={{ display: 'flex', gap: '1rem' }} onSubmit={handleSearch}>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. burn, bleeding..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">Search</button>
            </form>

            <div className="results-grid">
              {predefinedResults.length === 0 && medications.length === 0 && detectedTablets.length === 0 ? (
                <p className="text-muted mt-4">No specific local treatments matched your query. Use the AI Assistant for more info.</p>
              ) : (
                <>
                  {predefinedResults.map((med, index) => (
                    <div key={'pre-'+index} style={{ borderLeft: '4px solid var(--primary)', padding: '1rem', background: 'var(--secondary)', borderRadius: '0 8px 8px 0', marginTop: '1rem' }}>
                      <span className="badge" style={{background: 'var(--primary)', color: 'white'}}>SpeedCare Certified Standard</span>
                      <p style={{marginTop: '0.5rem', fontWeight: 600, textTransform: 'capitalize'}}>{med.situation}</p>
                      <p><strong>First Aid:</strong> {med.method}</p>
                    </div>
                  ))}

                  {/* Show detected tablets from AI or Search results */}
                  {[...medications, ...detectedTablets].map((med, index) => (
                    <div key={'db-'+index} style={{ borderLeft: '4px solid var(--success)', padding: '1rem', background: '#e8f5e9', borderRadius: '0 8px 8px 0', marginTop: '1rem' }}>
                      <span className="badge" style={{background: 'var(--success)', color: 'white'}}>Recommended Tablet / Medication</span>
                      <p style={{marginTop: '0.5rem'}}><strong>Needed for:</strong> {med.situation}</p>
                      <p><strong>Dose/Details:</strong> {med.medicationDetails}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        {/* AI Assistant Chatbot */}
        <div style={{ flex: '1 1 400px' }}>
          <div className="chat-container">
            <div className="chat-header">
              🤖 Emergency AI Assistant
            </div>
            <div className="chat-messages" style={{scrollBehavior: 'smooth'}}>
               {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.sender}`}>
                  {msg.image && (
                    <div className={isScanning && idx === messages.length - 1 ? "scanning-container" : ""}>
                      {isScanning && idx === messages.length - 1 && <div className="scanning-line"></div>}
                      <img src={msg.image} alt="Injury" style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '0.5rem' }} />
                    </div>
                  )}
                  {msg.text}
                </div>
              ))}
              {isTyping && <div className="message bot text-muted">AI is analyzing...</div>}
              
              {/* Highlight detected tablets inside chat for immediate access */}
              {!isTyping && detectedTablets.length > 0 && (
                <div className="message bot" style={{ border: '2px dashed var(--success)', background: '#f1f8e9' }}>
                  <strong>💊 Relevant Tablets Found:</strong>
                  <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem' }}>
                    {detectedTablets.map((t, i) => (
                      <li key={i}>{t.medicationDetails}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
             <form className="chat-input-area" onSubmit={handleAIQuery}>
              <button 
                type="button" 
                onClick={() => fileInputRef.current.click()}
                className="pulse"
                style={{ background: '#eee', color: '#333', padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Capture Injury Image"
              >
                📷
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept="image/*" 
                capture="environment"
                onChange={handleImageChange}
              />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {selectedImage && (
                  <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
                    <img src={selectedImage} alt="Selected" style={{ height: '40px', borderRadius: '4px' }} />
                    <button 
                      type="button"
                      onClick={() => setSelectedImage(null)}
                      style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', borderRadius: '50%', width: '15px', height: '15px', fontSize: '10px', padding: 0, border: 'none' }}
                    >
                      ×
                    </button>
                  </div>
                )}
                <input 
                  type="text" 
                  placeholder={selectedImage ? "Describe the injury (optional)..." : "Ask Gemini AI for instructions..."}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
              </div>
              <button type="submit">Ask AI</button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default PedestrianDashboard;
