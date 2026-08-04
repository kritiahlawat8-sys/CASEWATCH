import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Chat.css';

// Pre-defined mock responses for realistic legal-tech queries
const PRESETS = {
  pan: {
    query: "Affidavit format for Haryana",
    response: `To apply for a Permanent Account Number (PAN) card in India, follow this step-by-step procedure:

1. **Choose NSDL or UTIITSL Portal**: Applications can be made online via the Protean (formerly NSDL) portal or the UTIITSL website.
2. **Fill Form 49A (for Indian Citizens)**: Select "Form 49A" for Indian citizens or HUFs. Fill out all details including name, date of birth, address, and mobile number.
3. **Submit Supporting Documents**:
   * **Proof of Identity (PoI)**: Aadhaar Card, Passport, Voter ID, or Driving License.
   * **Proof of Address (PoA)**: Aadhaar Card, utility bills (electricity, water, landline), or bank statement.
   * **Proof of Date of Birth (DoB)**: Birth Certificate, Matriculation Certificate, or Passport.
4. **Pay the Fee**: The application fee is ₹107 for dispatch within India, payable via credit card, debit card, net banking, or UPI.
5. **e-Sign via Aadhaar OTP**: If your Aadhaar is linked to your mobile number, you can complete the paperless e-KYC and e-Sign.
6. **Track Application**: A 15-digit acknowledgement number will be generated. You can track the status on the respective portal. The physical card is typically delivered within 15 days, and the e-PAN is emailed in 2-3 days.`
  },
  rent: {
    query: "Steps to register a property",
    response: `A standard rent agreement in India must include specific clauses to be legally binding. Here is the recommended structure:

### Key Sections of a Rent Agreement:
1. **Details of Parties**: Full names, permanent addresses, and Aadhaar/PAN details of both the Landlord (Lessor) and Tenant (Lessee).
2. **Property Description**: Exact location, flat number, floor, and a list of furnishings, fittings, and appliances included.
3. **Tenancy Terms**:
   * **Duration**: Typically 11 months (to avoid mandatory registration under the Registration Act, 1908, though registering is highly recommended for security).
   * **Monthly Rent & Due Date**: Specified amount, date of payment, and mode of payment.
   * **Security Deposit**: Amount deposited and terms of interest-free refund upon termination.
4. **Maintenance & Utility Bills**: Clarification on who pays society maintenance, electricity, water, and internet bills.
5. **Usage Restrictions**: Clauses regarding subletting, commercial use, pets, and alterations to the structure.
6. **Notice Period**: Typically 1-2 months' notice from either party for termination.
7. **Witness Signatures**: Signatures of at least two independent witnesses.

*Note: For tenancies exceeding 12 months, registration of the rent agreement is mandatory at the local Sub-Registrar's office, requiring payment of stamp duty which varies by state.*`
  },
  consumer: {
    query: "Consumer complaint procedure",
    response: `If you have bought a defective product or received deficient service, you can file a complaint under the Consumer Protection Act, 2019. Here are the steps:

1. **Send a Written Notice**: Send a formal notice to the seller or service provider detailing the grievance and giving them 15 days to resolve it or compensate you.
2. **Choose the Right Forum**: Based on the value of goods/services and compensation claimed (Pecuniary Jurisdiction):
   * **District Commission**: Up to ₹50 Lakhs.
   * **State Commission**: Over ₹50 Lakhs to ₹2 Crores.
   * **National Commission (NCDRC)**: Above ₹2 Crores.
3. **Draft the Complaint**: Clearly state the facts, date of purchase, amount paid, deficiency details, and the relief/compensation claimed. Attach invoices, bills, receipts, emails, and photos as evidence.
4. **File Online via e-Daakhil**: The government offers the **e-Daakhil** portal (edaakhil.nic.in) to file complaints online and pay the court fee.
5. **Representing Yourself**: You do not mandatorily need a lawyer; you can argue your own case in the consumer commission.
6. **Resolution Timeline**: The Act specifies that consumer commissions should resolve cases within 3 to 5 months from the date of admission.`
  },
  default: {
    query: "Generic query response",
    response: `Thank you for asking. Based on legal procedures in India:

1. **Verify Official Guidelines**: Always ensure you are checking the latest rules on official Government of India portals (usually ending in \`.gov.in\` or \`.nic.in\`).
2. **Drafting Documents**: Any formal legal document (affidavits, contracts, agreements) must be printed on non-judicial stamp paper of appropriate value based on your state's Stamp Act.
3. **Notarization & Attestation**: Many legal documents require attestation by a Notary Public or an Oath Commissioner to be accepted by courts or authorities.
4. **How CaseWatch Can Assist**: You can check standard formats on our **Documents** section, search for government portal links under **Government Links**, or track any ongoing courtroom filings in real-time under **Track My Case**.

Let me know if you would like me to draft an outline for a specific document or check a particular filing requirement!`
  }
};

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const location = useLocation();
  const hasProcessedQuery = useRef(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const conversationEndRef = useRef(null);

  // Auto-scroll to bottom of the message container
  useEffect(() => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    // Transition input to bottom
    setIsSubmitted(true);

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: textToSend
    };

    // Calculate history BEFORE appending the new message to local state
    const history = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiBase}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          history: history
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponseText = data.response || data.reply || "No response received";

      const duration = Math.max(1, aiResponseText.length * 0.012);

      const aiMessageId = Date.now() + 1;
      const newAiMessage = {
        id: aiMessageId,
        sender: 'ai',
        text: aiResponseText,
        isNew: true, // Used for typewriter CSS animation
        duration: duration
      };

      setMessages((prev) => [...prev, newAiMessage]);
    } catch (error) {
      console.error('Error fetching chat response:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          sender: 'ai',
          text: `Sorry, I encountered an error while processing your request. Please make sure the backend is running at http://localhost:8000 and try again. (Details: ${error.message})`,
          isNew: false
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  const handleChipClick = (query) => {
    handleSendMessage(query);
  };

  const handleResetChat = () => {
    setMessages([]);
    setInputText('');
    setIsTyping(false);
    setIsSubmitted(false);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query && !hasProcessedQuery.current) {
      hasProcessedQuery.current = true;
      setInputText(query);
      handleSendMessage(query);
    }
  }, [location.search]);

  useEffect(() => {
    const handleResetEvent = () => {
      handleResetChat();
    };
    window.addEventListener('reset-chat', handleResetEvent);
    return () => {
      window.removeEventListener('reset-chat', handleResetEvent);
    };
  }, []);

  // Convert markdown-style text from mock replies to clean HTML paragraphs
  const renderFormattedText = (rawText) => {
    return rawText.split('\n\n').map((paragraph, pIndex) => {
      // Headers
      if (paragraph.startsWith('### ')) {
        return <h4 key={pIndex} style={{ margin: '16px 0 8px', color: '#0F2C59', fontSize: '18px', fontWeight: '600' }}>{paragraph.replace('### ', '')}</h4>;
      }
      if (paragraph.startsWith('## ')) {
        return <h3 key={pIndex} style={{ margin: '20px 0 10px', color: '#0F2C59', fontSize: '20px', fontWeight: '700' }}>{paragraph.replace('## ', '')}</h3>;
      }

      // Bullet points
      if (paragraph.includes('\n* ') || paragraph.startsWith('* ') || paragraph.includes('\n- ') || paragraph.startsWith('- ')) {
        const lines = paragraph.split('\n');
        return (
          <ul key={pIndex} style={{ paddingLeft: '20px', margin: '0 0 16px 0' }}>
            {lines.map((line, lIndex) => {
              const cleanLine = line.replace(/^[\s*-]+/, '').trim();
              return <li key={lIndex} dangerouslySetInnerHTML={{ __html: formatInlineStyles(cleanLine) }} />;
            })}
          </ul>
        );
      }

      // Numbered lists
      if (/^\d+\./.test(paragraph) || paragraph.includes('\n1.')) {
        const lines = paragraph.split('\n');
        return (
          <ol key={pIndex} style={{ paddingLeft: '20px', margin: '0 0 16px 0' }}>
            {lines.map((line, lIndex) => {
              const cleanLine = line.replace(/^\d+\.\s*/, '').trim();
              return <li key={lIndex} dangerouslySetInnerHTML={{ __html: formatInlineStyles(cleanLine) }} />;
            })}
          </ol>
        );
      }

      // Regular Paragraph
      return (
        <p
          key={pIndex}
          dangerouslySetInnerHTML={{ __html: formatInlineStyles(paragraph) }}
          style={{ margin: '0 0 16px 0', lineHeight: '1.7' }}
        />
      );
    });
  };

  // Helper for strong text parsing: **text** -> <strong>text</strong>
  const formatInlineStyles = (text) => {
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code style="background: rgba(27, 54, 93, 0.05); padding: 2px 6px; border-radius: 4px; font-family: monospace;">$1</code>');
    return formatted;
  };

  return (
    <div className="chat-page-wrapper">
      <Navbar />

      {/* Main chat column */}
      <main className="chat-main-container">
        
        {/* Empty new-chat state */}
        {!isSubmitted && (
          <div className="chat-welcome-section">
            <h1 className="chat-welcome-heading">How can I help you find a document today?</h1>
            <p className="chat-welcome-subtext">
              Ask about court processes, document formats, filing procedures, or how to track your case in Haryana.
            </p>
          </div>
        )}

        {/* Active conversation messages */}
        {isSubmitted && (
          <div className="chat-conversation-area">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message-row ${msg.sender === 'user' ? 'user-msg' : 'ai-msg'}`}>
                {msg.sender === 'ai' && (
                  <div className="chat-ai-avatar">
                    <img src="/logo.png" alt="CaseWatch AI" />
                  </div>
                )}
                
                {msg.sender === 'user' ? (
                  <div className="chat-user-bubble">
                    {msg.text}
                  </div>
                ) : (
                  <div className="chat-ai-response-container">
                    <div 
                      className={`chat-ai-response-text ${msg.isNew ? 'chat-typewriter-effect' : ''}`}
                      style={msg.isNew ? { "--typewriter-duration": `${msg.duration}s` } : undefined}
                    >
                      {renderFormattedText(msg.text)}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Simulated Shimmer Loader */}
            {isTyping && (
              <div className="chat-message-row ai-msg">
                <div className="chat-ai-avatar">
                  <img src="/logo.png" alt="CaseWatch AI Loading" />
                </div>
                <div className="chat-shimmer-container">
                  <div className="chat-shimmer-line line-1"></div>
                  <div className="chat-shimmer-line line-2"></div>
                  <div className="chat-shimmer-line line-3"></div>
                </div>
              </div>
            )}
            
            <div ref={conversationEndRef} />
          </div>
        )}

        {/* Input area */}
        <div className={`chat-input-outer-container ${isSubmitted ? 'bottom-sticky' : 'centered'}`}>
          <form onSubmit={handleFormSubmit} className="chat-input-pill">
            <span className="chat-input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <input
              type="text"
              className="chat-text-input"
              placeholder="Describe what you need — e.g. rent agreement template"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isTyping}
            />
            <button 
              type="submit" 
              className="chat-send-btn"
              disabled={!inputText.trim() || isTyping}
              title="Send message"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>

          {/* Suggestion Chips */}
          {!isSubmitted && (
            <div className="chat-suggestions-container">
              <button 
                type="button" 
                className="chat-suggestion-chip"
                onClick={() => handleChipClick("Rent agreement format")}
              >
                Rent agreement format
              </button>
              <button 
                type="button" 
                className="chat-suggestion-chip"
                onClick={() => handleChipClick("Documents needed for property registration")}
              >
                Documents needed for property registration
              </button>
              <button 
                type="button" 
                className="chat-suggestion-chip"
                onClick={() => handleChipClick("How to file an FIR in Haryana")}
              >
                How to file an FIR in Haryana
              </button>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
