import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import MoodSelector from "../components/MoodSelector";



const concernCardData = {
  depression: {
    title: "Depression",
    description: "Does your life feel impossible & hopeless? You don't have to manage it alone.",
    buttonText: "Start Healing Now",
    image: "https://img.freepik.com/premium-vector/vector-design-depression-icon-style_1134108-77450.jpg?w=740"
  },
  anxiety: {
    title: "Anxiety",
    description: "Chronic worry, mental fatigue, and feeling like your thoughts are always one step ahead of you?",
    buttonText: "Calm Your Mind",
    image: "https://media.istockphoto.com/id/1288872979/vector/anxiety-woman-fears-and-phobias-thoughts-get-confused-and-crushed-isolated-girl-sitting-on.jpg?s=612x612&w=0&k=20&c=WL7W7vD6mgMXcXU1Kt03D3US1ieqAzPYnkLzorRJido="
  },
  stress: {
    title: "Stress",
    description: "Develop coping strategies, reduce tension, and restore balance to your life with expert guidance.",
    buttonText: "Reduce Stress Now",
    image: "https://img.icons8.com/?size=1200&id=hWFYWKVXRAiU&format=jpg"
  }
};

// Data for the new FAQ Section
const faqData = [
    {
        question: "How can MindfulConnect help me?",
        answer: "Our website is full of advice and information to give young people the tools to look after their mental health. We empower parents and professionals to be the best support they can be to the young people in their lives. And we give young people the space and confidence to get their voices heard and change the world we live in. Together, we can create a world where no young person feels alone with their mental health."
    },
    {
        question: "What is mental health?",
        answer: "We all have mental health, just like we all have physical health. It’s about how we think, feel and act. Sometimes we feel well, and sometimes we don’t. When our mental health is good, we feel motivated and able to take on challenges and new experiences. But when our mental health is not so good, we can find it much harder to cope."
    },
    {
        question: "How do I know if I have a 'mental health problem'?",
        answer: "We all have good days and bad days, but when negative thoughts and feelings start to affect your daily life and stop you doing the things you enjoy, or your ability to feel okay, this means you need support with your mental health. For example, nearly everyone gets anxious before an exam, a job interview or a first date. But if you feel anxious all the time and this is stopping you from sleeping well or meeting up with friends, you might need help."
    }
];


// --- Animated Drop Background (Unchanged) ---
const DropBackground = () => {
  const drops = [
    { left: '8vw', size: 100, duration: '12s', color: 'rgba(15, 220, 189, 0.78)', blur: 2 },
    { left: '24vw', size: 80, duration: '16s', color: 'rgba(76, 56, 223, 0.85)', blur: 3 },
    { left: '46vw', size: 90, duration: '22s', color: 'rgba(178, 21, 189, 0.78)', blur: 2 },
    { left: '62vw', size: 80, duration: '20s', color: 'rgba(196, 218, 154, 0.93)', blur: 4 },
    { left: '80vw', size: 70, duration: '18s', color: 'rgba(44, 215, 190, 0.84)', blur: 2 }
  ];
  return (
    <div className="animated-drops-bg">
      {drops.map((d, i) => (
        <div
          key={i}
          className="animated-drop"
          style={{
            left: d.left,
            width: d.size,
            height: d.size,
            background: d.color,
            filter: `blur(${d.blur}px)`,
            animationDuration: d.duration,
            animationDelay: `${i * 2}s`
          }}
        />
      ))}
    </div>
  );
};


// --- Updated Hero Section with Auto-Fade Slider ---
const HeroSection = ({ styles }) => {
  const heroImages = [
    "https://images.pexels.com/photos/5699475/pexels-photo-5699475.jpeg",
    "https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg",
    "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg",
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section className="hero" style={styles.heroContainer}>
      <div style={styles.heroTextContainer} className="hero-text">
        <h1 style={styles.heading} className="hero-heading rainbow-title">
          Your Journey to Mental Wellness Starts Here
        </h1>
        <p style={styles.paragraph} className="hero-sub">
          Connect with trusted, verified counsellors for compassionate support that is confidential, convenient, and centered on you
        </p>
        <div style={{ marginTop: 28 }}>
          <Link to="/find-professional" className="cta primary pulse" style={styles.mainCtaButton}>
            Consult a Counsellor
          </Link>
          <Link to="/assessment" className="cta ghost shimmer" style={{ marginLeft: 12 }}>
            Take the Quick Assessment
          </Link>
        </div>
      </div>

      <div className="hero-image-slider">
        {heroImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt=""
            className={`hero-slide ${index === currentImage ? "active" : ""}`}

          />
        ))}
      </div>
    </section>
  );
};



// --- Card Component (Unchanged) ---
const ConcernDisplayCard = ({ topicKey, styles, index = 0 }) => {
  const concernInfo = concernCardData[topicKey] || {};
  const image = concernInfo.image || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';


  return (
    <article
      className="concern-card-new slide-in"
      style={{ animationDelay: (index * 120) + "ms" }}
      aria-labelledby={`concern-${topicKey}`}
    >
      <div className="concern-media-new">
        <img src={image} alt={concernInfo.title} />
      </div>
      <div className="concern-content-new">
        <h3 id={`concern-${topicKey}`} style={styles.concernDisplayCardTitleNew}>
          {concernInfo.title || topicKey}
        </h3>
        <p style={styles.concernDisplayCardContentNew}>
          {concernInfo.description}
        </p>
        <Link to={`/concern/${topicKey}`} className="concern-arrow-link">
          <span>&rarr;</span>
        </Link>
      </div>
    </article>
  );
};



const CommonConcernsSection = ({ styles }) => {
  const concernKeys = ["depression", "anxiety", "stress"];
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionHeading} className="rainbow-title">
        Mental health concerns we care for
      </h2>
      <p style={styles.sectionSubheading}>
        Explore some of the most common ones below to see how we can support you
      </p>
      <div style={styles.concernCardsGrid} className="concern-grid">
        {concernKeys.map((key, idx) => (
          <ConcernDisplayCard key={key} topicKey={key} styles={styles} index={idx} />
        ))}
      </div>
    </div>
  );
};



// --- "Feel Better" Section (Unchanged) ---
const FeelBetterSection = ({ styles }) => {
    return (
        <section style={styles.feelBetterSection} className="feel-better-section">
            <div style={styles.feelBetterOverlay}></div>
            <h2 style={styles.feelBetterText}>
                We want you to feel better, get better, stay better
            </h2>
        </section>
    );
};


// --- FAQ Item Component ---
const FAQItem = ({ faq, index, isOpen, toggleFAQ }) => (
    <div className="faq-item">
        <button onClick={() => toggleFAQ(index)} className="faq-question">
            {faq.question}
            <span className={`faq-icon ${isOpen ? 'open' : ''}`}></span>
        </button>
        <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
            <p>{faq.answer}</p>
        </div>
    </div>
);

const FAQSection = ({ styles }) => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = index => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div style={styles.section}>
            <h2 style={styles.sectionHeading}>Frequently Asked Questions</h2>
            <div className="faq-container">
                {faqData.map((faq, index) => (
                    <FAQItem key={index} index={index} faq={faq} isOpen={openIndex === index} toggleFAQ={toggleFAQ} />
                ))}
            </div>
        </div>
    );
};


// --- Footer Component (Unchanged) ---
const Footer = ({ styles }) => {
    return (
        <footer style={styles.footer} className="site-footer">
            <div style={styles.footerLinks}>
                <a href="/privacy-policy" style={styles.footerLinkItem}>Privacy Policy</a>
                <a href="/terms-and-conditions" style={styles.footerLinkItem}>Terms & Conditions</a>
            </div>
            <div style={styles.footerDisclaimer}>
                <p><strong>Disclaimer:</strong> MindfulConnect is an informational platform designed to provide resources and support for mental well-being. The content on this site is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or another qualified health provider with any questions you may have regarding a medical condition.</p>
            <p>If you are in a crisis or any other person may be in danger, please do not use this site. Contact a local emergency hotline or visit the nearest emergency room.</p>
            </div>
        </footer>
    );
};



function HomePage() {
  const css = `
  /* --- Hero Image Slider --- */
.hero-image-slider {
  position: relative;
  width: 450px;
  height: 300px;
  border-radius: 16px;
  overflow: hidden;
  flex-shrink: 0;
}
.hero-image-slider img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}
.hero-image-slider img.active {
  opacity: 1;
  z-index: 1;
}

.homepage-bg {
  // backgroundT: linear-gradient(180deg, #8f8fcbff 0%, #4a60a3ff 30%, #7bafd1ff 90%);
  background:#FFFFFF ;
  padding: 40px 20px 80px 20px;
  min-height:100vh;
  position:relative;
  overflow-x:hidden;
  z-index: 0;
}
/* --- Falling drop animation (Unchanged) --- */
.animated-drops-bg {
  position: fixed;
  top:0; left:0; width:100vw; height: 100vh;
  z-index:0; pointer-events:none; overflow:hidden;
}
.animated-drop {
  position:absolute;
  border-radius: 50%;
  animation: dropFall 14s linear infinite;
  opacity:0.66;
}
@keyframes dropFall {
  0% { top: -60px; opacity:0.18; }
  100% { top: 96vh; opacity:0.1; }
}


/* --- Animated blobs and circles (Unchanged) --- */
.animated-bg-elements { position: fixed; inset: 0; width: 100vw; height: 100vh; z-index: 1; pointer-events: none; overflow: hidden; }
.bg-blob { position: absolute; border-radius: 50%; filter: blur(72px); opacity: 0.37; mix-blend-mode: lighten; animation: blobFloat 16s ease-in-out infinite alternate; }
.blob1 { width: 390px; height: 390px; left: -120px; top: 99px; background: radial-gradient(circle farthest-side, #8b7bff 0%, #d6d0ff00 92%); animation-delay: 1.8s; }
.blob2 { width: 205px; height: 205px; right: 15vw; top: 17vh; background: radial-gradient(circle at 60% 80%, #7bd5c8 27%, #fbfbff00 100%); animation-delay: 6.5s; }
.blob3 { width: 290px; height: 290px; right: -80px; bottom: -90px; background: radial-gradient(circle, #ebb2ef 14%, #ffffff00 100%); animation-delay: 8.9s; }
.bg-circle { position: absolute; border-radius: 50%; background: #7bd5c8; opacity: 0.22; filter: blur(22px); animation: floatCircle 24s ease-in-out infinite alternate; }
.circle1 { width: 90px; height: 90px; left: 65vw; top: 12vh; background: #ebb2ef; animation-delay: 2.7s; }
.circle2 { width: 60px; height: 60px; left: 11vw; bottom: 9vh; background: #7bd5c8; animation-delay: 12.5s;}


@keyframes blobFloat { 0% { transform: scale(1) translateY(0) translateX(0);} 31% { transform: scale(1.05) translateY(-11px) translateX(16px);} 61% { transform: scale(0.98) translateY(10px) translateX(-9px);} 100% { transform: scale(1.03) translateY(0) translateX(0);} }
@keyframes floatCircle { 0% { transform: translateY(0) scale(0.96);} 70% { transform: translateY(-18px) scale(1.05);} 100% { transform: translateY(6px) scale(1.01);} }


/* --- General Styles --- */
.hero { position: relative; overflow: visible; border-radius: 22px; background: linear-gradient(85deg,#fff 60%,#d9f4f1 100%); z-index:2;}
.rainbow-title { background: linear-gradient(90deg,#8b7bff,#7bd5c8,#ebb2ef); background-clip: text; -webkit-background-clip: text; color: transparent; font-weight: 800; }
.hero-text { z-index: 2; }
.hero-heading { margin: 0 0 12px 0; animation: fadeInUp 800ms both; color: #3b2b7a }
.hero-sub { margin: 0; opacity: 0.98; color: rgba(15,23,42,0.88); animation: fadeInUp 900ms both; animation-delay: 180ms }
.device-card { border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(16,24,40,0.14); transition: transform 400ms cubic-bezier(.2,.9,.3,1), box-shadow 400ms; will-change: transform, box-shadow;}
.device-card.floaty { animation: floaty 3.2s infinite ease-in-out; }
.device-card img { display:block; width:100%; height:100%; object-fit:cover; transition: filter 0.2s; }
.device-card:hover img { filter: saturate(1.2) brightness(1.07); }
.hero-media .device-card:hover { transform: translateY(-12px) scale(1.03); box-shadow: 0 34px 80px rgba(16,24,40,0.2); }
.cta { display:inline-flex; align-items:center; justify-content:center; min-width:220px; height:52px; padding: 0 30px; border-radius: 999px; text-decoration:none; font-weight:700; font-size:1.07rem; box-sizing:border-box; outline:none; box-shadow: 0 14px 36px rgba(139,123,255,0.11), 0 1.5px 8px #7bd5c883; cursor: pointer; text-shadow: 0 2px 8px rgba(123,209,197,0.07); }
.cta.primary { background: linear-gradient(90deg,#7bd5c8 0%,#8b7bff 97%); color: #fff; border:none; box-shadow: 0 18px 30px rgba(139,123,255,0.13); transition: background 0.23s; }
.cta.primary.pulse { animation: pulse 2.1s infinite alternate; }
@keyframes pulse { 0% { box-shadow: 0 16px 36px #8b7bff60; } 100% { box-shadow: 0 30px 58px #7bd5c860; } }
.cta.ghost { border: 2px solid rgba(139,123,255,0.22); color: #4b399c; background: rgba(255,255,255,0.95); }
.cta.ghost.shimmer { background: linear-gradient(90deg, #ffffff 80%, #d7b3ff 100%); background-size: 200% 100%; animation: shimmer 4s linear infinite; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: 0 0; } }
@keyframes floaty { 0% { transform: translateY(0px) } 50% { transform: translateY(-7px) } 100% { transform: translateY(0px) } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(12px) } to { opacity:1; transform: translateY(0) } }


/* --- Card Styles (Unchanged) --- */
.concern-grid { margin-top: 24px; }
.concern-card-new {
    border-radius: 22px;
    background: #fff;
    box-shadow: 0 8px 30px rgba(210, 215, 230, 0.6);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid #f0eefc;
    transition: transform 300ms ease, box-shadow 300ms ease;
    animation: slideIn 0.6s cubic-bezier(0.42,0,0.58,1) both;
}
.concern-card-new:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 40px rgba(180, 190, 210, 0.7);
}
.concern-media-new {
    width: 100%;
    height: 180px;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fdfcff;
}
.concern-media-new img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}
.concern-content-new {
    padding: 24px;
    position: relative;
    flex-grow: 1;
}
.concern-arrow-link {
    position: absolute;
    right: 24px;
    bottom: 24px;
    font-size: 2rem;
    color: #ff9a8b;
    text-decoration: none;
    transition: transform 0.2s;
}
.concern-arrow-link:hover {
    transform: translateX(5px);
}
@keyframes slideIn { from { opacity:0; transform:translateY(30px) scale(0.98); } to { opacity:1; transform:translateY(0) scale(1); } }

/* --- FAQ Styles --- */
.faq-container { max-width: 800px; margin: 0 auto; text-align: left; }
.faq-item { border-bottom: 1px solid #e0d9ff; }
.faq-question { width: 100%; background: none; border: none; text-align: left; padding: 20px; font-size: 1.1em; font-weight: 600; color: #3b2b7a; cursor: pointer; display: flex; justify-content: space-between; align-items: center; border-radius: 8px; transition: background-color 0.3s; }
.faq-question:hover { background-color: #f7f5ff; }
.faq-icon { width: 10px; height: 10px; border-left: 2px solid #8b7bff; border-bottom: 2px solid #8b7bff; transform: rotate(-45deg); transition: transform 0.3s; }
.faq-icon.open { transform: rotate(135deg); margin-top: -5px;}
.faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.4s ease-out; }
.faq-answer.open { max-height: 300px; }
.faq-answer p { padding: 0 20px 20px 20px; color: #504699; line-height: 1.6; margin: 0; }

@media (max-width:900px) { .hero { padding: 32px 14px } }
@media (max-width:520px) { .cta, .cta.small { min-width: 130px; height:42px; font-size:0.95rem } }
`;


  return (
    <div className="homepage-bg">
      <style>{css}</style>
      <DropBackground />
      <div className="animated-bg-elements">
        <div className="bg-blob blob1"></div>
        <div className="bg-blob blob2"></div>
        <div className="bg-blob blob3"></div>
      </div>
      <HeroSection styles={styles} />
       <div style={{ margin: "60px 0", textAlign: "center" }}>
        <MoodSelector />
      </div>
      <CommonConcernsSection styles={styles} />
      <FeelBetterSection styles={styles} />
      <FAQSection styles={styles} />
      <Footer styles={styles} />
    </div>
  );
}


// --- Styles Object ---
const styles = {
  section: { padding: '80px 40px', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' },
  sectionHeading: { fontSize: '2.8em', marginBottom: '15px', fontWeight: 700, letterSpacing: '0.5px' },
  sectionSubheading: { fontSize: '1.2em', color: '#504699', maxWidth: '700px', margin: '0 auto 40px auto', lineHeight: '1.6' },
  heroContainer: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 40px', maxWidth: '1300px', margin: '40px auto', gap: '40px', flexWrap: 'wrap', background: 'linear-gradient(120deg, #e7edff 0%, #f9fcff 100%)' },
  heroTextContainer: { flex: 1, minWidth: '300px', textAlign: 'left' },
  heading: { fontSize: '3.5em', marginBottom: '20px', lineHeight: '1.2', fontWeight: '800' },
  paragraph: { fontSize: '1.3em', color: '#504699', marginBottom: '40px', lineHeight: '1.7' },
  mainCtaButton: { padding: '18px 40px', fontSize: '1.2em', textDecoration: 'none', fontWeight: 700 },
  heroImageContainer: { flex: 1, minWidth: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  heroImage: { maxWidth: '100%', height: 'auto', borderRadius: '16px', boxShadow: '0 14px 38px rgba(79,123,255,0.14)' },
  concernCardsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '42px', maxWidth: '1100px', margin: '0 auto', paddingTop: '22px' },

  concernDisplayCardTitleNew: { fontSize: '1.75em', fontWeight: '700', marginBottom: '12px', color: '#3b2b7a', lineHeight: '1.18' },
  concernDisplayCardContentNew: { fontSize: '1.05em', color: '#504699', lineHeight: '1.55' },

  feelBetterSection: {
      position: 'relative',
      height: '400px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      color: '#fff',
      backgroundImage: 'url(https://media.gettyimages.com/id/1332167751/photo/university-student-friends-standing-and-talking-in-the-university-campus.jpg?s=612x612&w=0&k=20&c=j7tww5CCXSuelc6h4mQcJfsDABoAgu2kUMj4jZqlqLA=)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      margin: '80px auto',
      maxWidth: '1300px',
      borderRadius: '22px',
      overflow: 'hidden'
  },
  feelBetterOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  feelBetterText: {
      position: 'relative',
      fontSize: '2.8em',
      fontWeight: '700',
      maxWidth: '800px',
      lineHeight: '1.4',
      textShadow: '0 2px 10px rgba(0,0,0,0.5)',
      color: '#fff' // Slogan text color
  },

  footer: {
      padding: '40px 20px',
      marginTop: '60px',
      backgroundColor: '#f8f9fa',
      textAlign: 'center',
      color: '#6c757d',
      borderTop: '1px solid #e7e7e7',
      maxWidth: '1300px',
      margin: '0 auto',
      borderRadius: '22px',
      zIndex: 2,
      position: 'relative',
  },
  footerLinks: {
      marginBottom: '20px',
  },
  footerLinkItem: {
      margin: '0 15px',
      color: '#4b399c',
      textDecoration: 'none',
      fontWeight: '600',
      padding: '8px 16px',
      borderRadius: '20px',
      background: '#fff',
      border: '1px solid #e0d9ff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      transition: 'background 0.2s'
  },
  footerDisclaimer: {
      fontSize: '0.85em',
      maxWidth: '800px',
      margin: '0 auto',
      lineHeight: '1.6'
  }

  

};


export default HomePage;