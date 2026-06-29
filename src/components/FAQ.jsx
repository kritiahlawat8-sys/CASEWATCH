import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  const [lang, setLang] = useState('en'); // 'en' or 'hi'
  const [activeCategory, setActiveCategory] = useState('all');
  const [openId, setOpenId] = useState(null);
  const [feedback, setFeedback] = useState({}); // { [faqId]: 'up' | 'down' }

  // Localization Dictionary
  const t = {
    en: {
      title: 'Frequently Asked Questions',
      subtitle: 'Find quick answers to common queries about court tracking, privacy, and legal security.',
      toggleLang: 'हिन्दी',
      categoryAll: 'All',
      categoryCourt: 'Court Tracking',
      categoryPrivacy: 'Security & Privacy',
      categoryFraud: 'Anti-Fraud',
      helpful: 'Was this helpful?'
    },
    hi: {
      title: 'अक्सर पूछे जाने वाले प्रश्न',
      subtitle: 'अदालती ट्रैकिंग, गोपनीयता और कानूनी सुरक्षा के बारे में सामान्य प्रश्नों के त्वरित उत्तर पाएं।',
      toggleLang: 'English',
      categoryAll: 'सभी',
      categoryCourt: 'अदालती ट्रैकिंग',
      categoryPrivacy: 'सुरक्षा और गोपनीयता',
      categoryFraud: 'धोखाधड़ी रोकथाम',
      helpful: 'क्या यह मददगार था?'
    }
  };

  const faqData = [
    // Part 1: Court Tracking & CNR Numbers
    {
      id: 'cnr-meaning',
      category: 'court',
      question: {
        en: 'What is a CNR number, and where can I find it?',
        hi: 'CNR नंबर क्या है, और मैं इसे कहां पा सकता हूं?'
      },
      answer: {
        en: 'A CNR (Case Status Record) number is a unique 16-character alphanumeric code assigned to every case in Indian district and taluka courts. You can find it at the top of court notices, summons, or previous orders (e.g., MHAU010000122026).',
        hi: 'CNR (केस स्टेटस रिकॉर्ड) नंबर एक अनूठा 16-अक्षरों का अल्फ़ान्यूमेरिक कोड है जो भारतीय जिला और तालुका न्यायालयों में हर मामले को दिया जाता है। आप इसे अदालती नोटिस, समन या पिछले आदेशों के शीर्ष पर पा सकते हैं (जैसे, MHAU010000122026)।'
      }
    },
    {
      id: 'real-time-updates',
      category: 'court',
      question: {
        en: "Why isn't my case status updating in real-time?",
        hi: 'मेरे केस का स्टेटस वास्तविक समय (real-time) में अपडेट क्यों नहीं हो रहा है?'
      },
      answer: {
        en: "CaseWatch fetches data directly from the official eCourts services. If a court's local staff hasn't updated the database for that day, the update will show up as soon as they sync their records.",
        hi: 'CaseWatch आधिकारिक ई-कोर्ट सेवाओं से सीधे डेटा प्राप्त करता है। यदि किसी न्यायालय के स्थानीय कर्मचारियों ने उस दिन के लिए डेटाबेस अपडेट नहीं किया है, तो उनके रिकॉर्ड सिंक होते ही अपडेट दिखाई देगा।'
      }
    },
    {
      id: 'ai-summaries',
      category: 'court',
      question: {
        en: 'How does the AI summary of court orders work?',
        hi: 'अदालती आदेशों का एआई (AI) सारांश कैसे काम करता है?'
      },
      answer: {
        en: 'We use Gemini AI to translate complex, jargon-heavy court orders into plain, easy-to-understand summaries in English and Hindi. However, these are strictly for guidance and are marked "for review only."',
        hi: 'हम जटिल, कानूनी शब्दावली वाले अदालती आदेशों का अंग्रेजी और हिंदी में सरल, समझने में आसान सारांश में अनुवाद करने के लिए जेमिनी एआई (Gemini AI) का उपयोग करते हैं। हालांकि, ये केवल मार्गदर्शन के लिए हैं और इन्हें "केवल समीक्षा के लिए" चिह्नित किया गया है।'
      }
    },
    {
      id: 'search-without-cnr',
      category: 'court',
      question: {
        en: "How do I search for my court case if I don't know my CNR number?",
        hi: 'यदि मुझे अपना CNR नंबर नहीं पता है तो मैं अपने कोर्ट केस की खोज कैसे करूं?'
      },
      answer: {
        en: "If you don't have a CNR number, you can look up your case on the official eCourts portal by searching by party name, case number, filing number, advocate name, or FIR number.",
        hi: 'यदि आपके पास CNR नंबर नहीं है, तो आप आधिकारिक ई-कोर्ट पोर्टल पर पार्टी का नाम, केस नंबर, फाइलिंग नंबर, वकील का नाम या प्राथमिकी (FIR) नंबर द्वारा खोजकर अपने केस की जानकारी देख सकते।'
      }
    },
    {
      id: 'next-hearing-date',
      category: 'court',
      question: {
        en: 'What does the "Next Hearing Date" represent?',
        hi: '"अगली सुनवाई की तारीख" (Next Hearing Date) क्या दर्शाती है?'
      },
      answer: {
        en: 'The Next Hearing Date is the scheduled date when your case will next be presented before the judge. This is when the court hears arguments, reviews evidence, or passes necessary orders.',
        hi: 'अगली सुनवाई की तारीख (Next Hearing Date) वह निर्धारित तारीख है जब आपका मामला अगली बार न्यायाधीश के सामने प्रस्तुत किया जाएगा। यह तब होता है जब अदालत दलीलें सुनती है, सबूतों की समीक्षा करती है, या आवश्यक आदेश पारित करती है।'
      }
    },
    {
      id: 'pending-vs-disposed',
      category: 'court',
      question: {
        en: 'What is the difference between a case being "Pending" and "Disposed"?',
        hi: 'केस के "लंबित" (Pending) और "निपटाया गया" (Disposed) होने में क्या अंतर है?'
      },
      answer: {
        en: '"Pending" means your case is currently active and ongoing in the court. "Disposed" means the court has reached a final decision/judgment or the case has been officially closed.',
        hi: '"लंबित" (Pending) का अर्थ है कि आपका मामला वर्तमान में सक्रिय है और अदालत में चल रहा है। "निपटाया गया" (Disposed) का अर्थ है कि अदालत अंतिम निर्णय/फैसले पर पहुंच गई है या मामला आधिकारिक तौर पर बंद कर दिया गया है।'
      }
    },
    {
      id: 'missing-case-details',
      category: 'court',
      question: {
        en: 'What should I do if my case details do not show up on the portal?',
        hi: 'यदि मेरे केस का विवरण पोर्टल पर दिखाई नहीं देता है तो मुझे क्या करना चाहिए?'
      },
      answer: {
        en: 'If your case details are not appearing, double-check that you entered the correct 16-character CNR number without spaces. If it is correct, the case may not have been registered in the digital eCourts system yet, or it might be in a tribunal/state forum that uses a different tracking system.',
        hi: 'यदि आपके केस का विवरण दिखाई नहीं दे रहा है, तो दोबारा जांचें कि आपने बिना स्पेस के सही 16-अक्षरों का CNR नंबर दर्ज किया है। यदि यह सही है, तो हो सकता है कि केस अभी तक डिजिटल ई-कोर्ट सिस्टम में पंजीकृत नहीं हुआ हो, या यह किसी ट्रिब्यूनल/राज्य मंच में हो सकता है जो एक अलग ट्रैकिंग सिस्टम का उपयोग करता है।'
      }
    },

    // Part 2: Privacy, Security & Zero-Login
    {
      id: 'why-no-login',
      category: 'privacy',
      question: {
        en: 'Why does CaseWatch not require a login or account?',
        hi: 'CaseWatch को लॉगिन या खाते की आवश्यकता क्यों नहीं है?'
      },
      answer: {
        en: 'To protect your privacy and ensure the platform is as lightweight as possible. We do not store your search history, CNR numbers, or personal identity on our servers.',
        hi: 'आपकी गोपनीयता की रक्षा करने और यह सुनिश्चित करने के लिए कि प्लेटफ़ॉर्म यथासंभव हल्का रहे। हम अपने सर्वर पर आपका खोज इतिहास, CNR नंबर या व्यक्तिगत पहचान संग्रहीत नहीं करते हैं।'
      }
    },
    {
      id: 'pinned-cases-storage',
      category: 'privacy',
      question: {
        en: 'Where is my pinned case data stored?',
        hi: 'मेरे पिन किए गए केस का डेटा कहां संग्रहीत होता है?'
      },
      answer: {
        en: "Pinned cases are stored locally on your device's browser memory (Local Storage). If you clear your browser cache, the pinned cases will reset.",
        hi: 'पिन किए गए मामले आपके डिवाइस के ब्राउज़र मेमोरी (लोकल स्टोरेज) में स्थानीय रूप से संग्रहीत होते हैं। यदि आप अपने ब्राउज़र कैश को साफ़ करते हैं, तो पिन किए गए मामले रीसेट हो जाएंगे।'
      }
    },
    {
      id: 'is-official-advice',
      category: 'privacy',
      question: {
        en: 'Can I use CaseWatch as official legal advice?',
        hi: 'क्या मैं CaseWatch का उपयोग आधिकारिक कानूनी सलाह के रूप में कर सकता हूँ?'
      },
      answer: {
        en: 'No. CaseWatch is a civic-tech tool designed for informational and guidance purposes only. It is not a substitute for professional legal representation by a qualified advocate.',
        hi: 'नहीं। CaseWatch केवल सूचनात्मक और मार्गदर्शन उद्देश्यों के लिए डिज़ाइन किया गया एक नागरिक-तकनीक (civic-tech) उपकरण है। यह किसी योग्य वकील द्वारा पेशेवर कानूनी प्रतिनिधित्व का विकल्प नहीं है।'
      }
    },
    {
      id: 'history-sharing',
      category: 'privacy',
      question: {
        en: 'Do you share my search history with courts, police, or third parties?',
        hi: 'क्या आप मेरा खोज इतिहास अदालतों, पुलिस या किसी तीसरे पक्ष के साथ साझा करते हैं?'
      },
      answer: {
        en: 'No. Because CaseWatch operates with zero login and processes your session data locally in your browser, we do not have a server database tracking your search history. Your searches are completely private to your device.',
        hi: 'नहीं। चूंकि CaseWatch शून्य लॉगिन के साथ काम करता है और आपके सत्र डेटा को आपके ब्राउज़र में स्थानीय रूप से संसाधित करता है, हमारे पास आपके खोज इतिहास को ट्रैक करने वाला कोई सर्वर डेटाबेस नहीं है। आपकी खोजें आपके डिवाइस के लिए पूरी तरह से निजी हैं।'
      }
    },

    // Part 3: Fraud & Legal Tout Prevention
    {
      id: 'fake-summons',
      category: 'fraud',
      question: {
        en: 'How can I identify a fake court summon or notice?',
        hi: 'मैं नकली अदालती समन या नोटिस की पहचान कैसे कर सकता हूं?'
      },
      answer: {
        en: 'Real summons will always have a CNR number, a QR code (in newer cases), and the official seal of the court. You can cross-verify the CNR number on our homepage. If it doesn\'t show up in official records, exercise caution.',
        hi: 'असली समन में हमेशा एक CNR नंबर, एक क्यूआर (QR) कोड (नए मामलों में), और अदालत की आधिकारिक मुहर होगी। आप हमारे होमपेज पर CNR नंबर को क्रॉस-वेरीफाई कर सकते हैं। यदि यह आधिकारिक रिकॉर्ड में दिखाई नहीं देता है, तो सावधानी बरतें।'
      }
    },
    {
      id: 'demand-bribes',
      category: 'fraud',
      question: {
        en: 'What should I do if an agent or tout demands extra money to speed up my case?',
        hi: 'यदि कोई दलाल या एजेंट मेरे केस को तेज करने के लिए अतिरिक्त पैसे मांगता है तो मुझे क्या करना चाहिए?'
      },
      answer: {
        en: 'Never pay bribes or unofficial commissions to touts. You can report corrupt practices to the Vigilance Department of your state or file a complaint on the central government’s CPGRAMS Portal.',
        hi: 'दलालों को कभी भी रिश्वत या अनौपचारिक कमीशन न दें। आप अपने राज्य के सतर्कता विभाग (Vigilance Department) को भ्रष्ट प्रथाओं की रिपोर्ट कर सकते हैं या केंद्र सरकार के CPGRAMS पोर्टल पर शिकायत दर्ज कर सकते हैं।'
      }
    },
    {
      id: 'verify-lawyer',
      category: 'fraud',
      question: {
        en: 'How do I verify if a lawyer is registered and licensed?',
        hi: 'मैं यह कैसे सत्यापित करूँ कि कोई वकील पंजीकृत और लाइसेंस प्राप्त है या नहीं?'
      },
      answer: {
        en: 'You can verify a lawyer\'s registration on the official website of the Bar Council of India or your respective State Bar Council using their enrollment number.',
        hi: 'आप बार काउंसिल ऑफ इंडिया या अपने संबंधित राज्य बार काउंसिल की आधिकारिक वेबसाइट पर उनके नामांकन (enrollment) नंबर का उपयोग करके किसी वकील के पंजीकरण की पुष्टि कर सकते हैं।'
      }
    },
    {
      id: 'fake-orders',
      category: 'fraud',
      question: {
        en: 'How do I verify if a court order document sent to me is real?',
        hi: 'मुझे भेजा गया अदालती आदेश का दस्तावेज़ असली है या नहीं, इसकी पुष्टि मैं कैसे करूँ?'
      },
      answer: {
        en: 'Every official court order has a unique Case Number or CNR number. You can verify the document\'s validity by searching for that number on our portal or the official eCourts site and comparing the order text. Never rely solely on printed documents provided by unofficial agents.',
        hi: 'प्रत्येक आधिकारिक अदालती आदेश में एक अद्वितीय केस नंबर या CNR नंबर होता है। आप हमारे पोर्टल या आधिकारिक ई-कोर्ट साइट पर उस नंबर को खोजकर और ऑर्डर टेक्स्ट की तुलना करके दस्तावेज़ की वैधता को सत्यापित कर सकते हैं। अनौपचारिक एजेंटों द्वारा प्रदान किए गए मुद्रित दस्तावेजों पर कभी भी पूरी तरह भरोसा न करें।'
      }
    }
  ];

  const handleToggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const handleFeedback = (id, type) => {
    setFeedback((prev) => ({
      ...prev,
      [id]: prev[id] === type ? null : type
    }));
  };

  const filteredFaqs = faqData.filter(
    (faq) => activeCategory === 'all' || faq.category === activeCategory
  );

  return (
    <section className="faq-section" id="faq" aria-labelledby="faq-title">
      <div className="faq-container">
        
        {/* FAQ Header with Language Toggle */}
        <div className="faq-header">
          <div className="faq-header-left">
            <span className="faq-badge">FAQ</span>
            <h2 id="faq-title" className="faq-main-title">{t[lang].title}</h2>
            <p className="faq-subtitle">{t[lang].subtitle}</p>
          </div>
          
          <button 
            className="faq-lang-btn" 
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            aria-label="Switch Language"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M2 12H22" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 2C14.5013 4.73831 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2617 12 22C9.49872 19.2617 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73831 12 2Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            {t[lang].toggleLang}
          </button>
        </div>

        {/* Category Pills */}
        <div className="faq-categories" role="tablist">
          <button
            className={`faq-pill ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => { setActiveCategory('all'); setOpenId(null); }}
            role="tab"
            aria-selected={activeCategory === 'all'}
          >
            {t[lang].categoryAll}
          </button>
          <button
            className={`faq-pill ${activeCategory === 'court' ? 'active' : ''}`}
            onClick={() => { setActiveCategory('court'); setOpenId(null); }}
            role="tab"
            aria-selected={activeCategory === 'court'}
          >
            {t[lang].categoryCourt}
          </button>
          <button
            className={`faq-pill ${activeCategory === 'privacy' ? 'active' : ''}`}
            onClick={() => { setActiveCategory('privacy'); setOpenId(null); }}
            role="tab"
            aria-selected={activeCategory === 'privacy'}
          >
            {t[lang].categoryPrivacy}
          </button>
          <button
            className={`faq-pill ${activeCategory === 'fraud' ? 'active' : ''}`}
            onClick={() => { setActiveCategory('fraud'); setOpenId(null); }}
            role="tab"
            aria-selected={activeCategory === 'fraud'}
          >
            {t[lang].categoryFraud}
          </button>
        </div>

        {/* Accordion Cards */}
        <div className="faq-list">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div 
                key={faq.id} 
                className={`faq-card ${isOpen ? 'open' : ''}`}
                id={`faq-${faq.id}`}
              >
                {/* Accordion Header */}
                <button 
                  className="faq-question-trigger"
                  onClick={() => handleToggle(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  <span className="faq-question-text">{faq.question[lang]}</span>
                  <span className="faq-chevron-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </button>

                {/* Accordion Content */}
                <div 
                  id={`faq-answer-${faq.id}`}
                  className="faq-answer-panel"
                  role="region"
                  style={{
                    maxHeight: isOpen ? '250px' : '0px',
                    opacity: isOpen ? 1 : 0
                  }}
                >
                  <div className="faq-answer-content">
                    <p className="faq-answer-text">{faq.answer[lang]}</p>
                    
                    {/* Card Actions (Helpful?) */}
                    <div className="faq-card-footer">
                      <div className="faq-helpful-box">
                        <span className="faq-helpful-label">{t[lang].helpful}</span>
                        <button 
                          className={`faq-feedback-btn ${feedback[faq.id] === 'up' ? 'active' : ''}`}
                          onClick={() => handleFeedback(faq.id, 'up')}
                          aria-label="Thumb Up"
                        >
                          👍
                        </button>
                        <button 
                          className={`faq-feedback-btn ${feedback[faq.id] === 'down' ? 'active' : ''}`}
                          onClick={() => handleFeedback(faq.id, 'down')}
                          aria-label="Thumb Down"
                        >
                          👎
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FAQ;
