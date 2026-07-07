import React from 'react';
import { useParams, Link } from 'react-router-dom';

// The content for all topics is now stored here
const contentData = {
    depression: {
        headerImage: "https://images.pexels.com/photos/236151/pexels-photo-236151.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        title: "Online Counseling for Depression",
        intro: "Depression is far more than just a bad day—it’s a serious medical condition that affects millions. It's a real and treatable illness that can affect anyone, regardless of age, gender, or background.",
        sections: [
            { heading: "Misconceptions vs. Reality", text: "Many people mistakenly view depression as a sign of personal weakness. However, it’s a complex mental health disorder that requires understanding, medical attention, and proper treatment, not just willpower. Breaking down these misconceptions is the first step toward healing." },
            { heading: "Understanding the Condition", text: "Depression is a mood disorder characterized by persistent feelings of sadness, emptiness, and a lack of interest or pleasure in activities. It significantly affects how an individual feels, thinks, and handles daily activities. To be diagnosed, these symptoms must be present for at least two weeks." }
        ],
        symptoms: {
            heading: "Key Symptoms to Recognize",
            types: [
                { title: "Emotional", items: ["Persistent sadness, hopelessness, or emptiness", "Irritability or frustration over small matters"] },
                { title: "Physical", items: ["Changes in appetite or weight", "Sleep disturbances (insomnia or oversleeping)", "Lack of energy and unexplained aches"] },
                { title: "Cognitive", items: ["Trouble concentrating or making decisions", "Difficulty remembering details", "Negative thought patterns"] },
                { title: "Behavioral", items: ["Withdrawing from social interactions", "Loss of interest in hobbies", "Thoughts of death or suicide"] }
            ],
            conclusion: "Understanding these symptoms is crucial. Early recognition and action can lead to effective management and recovery."
        }
    },
    anxiety: {
        headerImage: "https://images.pexels.com/photos/7648434/pexels-photo-7648434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        title: "Online Counseling for Anxiety",
        intro: "Anxiety is a common and natural response to stress, but for many, it can become overwhelming and persistent, affecting daily functioning and quality of life. It manifests through various symptoms and can lead to significant distress when left unaddressed.",
        sections: [
            { heading: "Understanding Anxiety", text: "Anxiety is experienced as a fearful feeling or worry about future events. While it’s natural to feel anxious temporarily in difficult situations, if symptoms persist for more than six months despite all efforts, it may develop into an anxiety disorder." },
            { heading: "How Online Counseling Helps", text: "Counseling provides a personalized understanding of your anxiety, helps you develop coping strategies like mindfulness and cognitive restructuring, and offers a supportive, non-judgmental environment for emotional healing and growth."}
        ],
        symptoms: {
            heading: "Symptoms Of Anxiety",
            types: [
                { title: "Emotional", items: ["Persistent worry or fear about everyday situations", "Feelings of dread without a clear cause", "Irritability or restlessness"] },
                { title: "Physical", items: ["Rapid heartbeat or palpitations", "Sweating and tremors", "Fatigue and trouble sleeping (insomnia)"] },
                { title: "Cognitive", items: ["Difficulty concentrating or mind going blank", "Excessive fears and worries", "Indecisiveness and fear of making the wrong decision"] },
                { title: "Behavioral", items: ["Avoidance of feared situations or events", "Compulsive behaviors or rituals", "Social withdrawal"] }
            ],
            conclusion: "Recognizing these symptoms and their impact on daily life is the first step towards seeking help. With professional support, you can navigate your symptoms effectively and regain control over your life."
        }
    },
    stress: {
        headerImage: "https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        title: "Online Counseling for Stress",
        intro: "Workplace stress is a common issue arising from high workloads, tight deadlines, and a lack of control. Recognizing the signs is crucial for early intervention and maintaining overall well-being.",
        sections: [
            { heading: "Benefits of Online Counseling", text: "Counseling equips you with effective coping mechanisms for managing stress, including time management, problem-solving, and relaxation techniques. It helps you understand and regulate your emotions, increases self-awareness, and aids in establishing a healthier work-life balance." },
        ],
        symptoms: {
            heading: "Symptoms and Signs to Look For",
            types: [
                { title: "Emotional", items: ["Feelings of being overwhelmed or irritable", "Anxiety and mood swings"] },
                { title: "Physical", items: ["Fatigue and trouble sleeping", "Headaches, stomach issues, and muscle tension"] },
                { title: "Cognitive", items: ["Difficulty concentrating or making decisions", "Decrease in creativity and problem-solving"] },
                { title: "Behavioral", items: ["Withdrawal from social or work activities", "Increased absenteeism or reliance on substances"] }
            ],
            conclusion: "Addressing workplace stress is critical for maintaining not only professional efficiency but also your overall health and quality of life."
        }
    }
    // Other topics will show "coming soon"
};

function ConcernPage() {
    const { topic } = useParams();
    const content = contentData[topic];

    if (!content) {
        return (
            <div className="card-panel" style={styles.container}>
                <h1 style={styles.title}>Content Coming Soon</h1>
                <p>Information about "{topic.replace(/-/g, ' ')}" is being prepared. Please check back later.</p>
                <Link to="/" className="button-secondary">Go Back to Home</Link>
            </div>
        );
    }

    return (
        <div>
            <div style={{...styles.header, backgroundImage: `url(${content.headerImage})`}}>
                <div style={styles.headerOverlay}>
                    <h1 style={styles.headerTitle}>{content.title}</h1>
                </div>
            </div>

            <div className="card-panel" style={styles.container}>
                <p style={styles.intro}>{content.intro}</p>
                
                {content.sections && content.sections.map((section, i) => (
                    <div key={i} style={styles.section}>
                        <h2 style={styles.sectionHeading}>{section.heading}</h2>
                        <p style={styles.paragraph}>{section.text}</p>
                    </div>
                ))}

                {content.symptoms && (
                    <div style={styles.section}>
                        <h2 style={styles.sectionHeading}>{content.symptoms.heading}</h2>
                        <div style={styles.symptomsGrid}>
                            {content.symptoms.types.map((symptomType, i) => (
                                <div key={i} style={styles.symptomCard}>
                                    <h3 style={styles.symptomCardTitle}>{symptomType.title}</h3>
                                    <ul style={styles.symptomList}>
                                        {symptomType.items.map((item, j) => <li key={j}>{item}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        <p style={{...styles.paragraph, textAlign: 'center', marginTop: '30px'}}>{content.symptoms.conclusion}</p>
                    </div>
                )}
                
                <div style={{textAlign: 'center', marginTop: '50px'}}>
                    <Link to="/" className="button-secondary">Back to Home</Link>
                </div>
            </div>
        </div>
    );
}

// --- Enhanced Styles with Animations ---
const styles = {
    header: { height: '40vh', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    headerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' },
    headerTitle: { fontSize: '3.5em', color: 'white', fontWeight: '800', textShadow: '0 2px 10px rgba(0,0,0,0.5)', animation: 'fadeInUp 0.8s ease-out' },
    container: { maxWidth: '900px', textAlign: 'left', padding: '60px 40px', margin: '-80px auto 40px auto', position: 'relative', zIndex: 2 },
    intro: { fontSize: '1.3em', color: 'var(--color-text-dark)', lineHeight: '1.7', marginBottom: '40px', textAlign: 'center', fontWeight: '500', animation: 'fadeInUp 0.8s ease-out 0.2s', animationFillMode: 'both' },
    section: { marginTop: '50px', animation: 'fadeInUp 0.8s ease-out 0.4s', animationFillMode: 'both' },
    sectionHeading: { fontSize: '2.2em', color: 'var(--color-primary-dark)', borderBottom: '3px solid var(--color-primary-light)', paddingBottom: '15px', marginBottom: '25px' },
    paragraph: { fontSize: '1.1em', color: 'var(--color-text-medium)', lineHeight: '1.9' },
    symptomsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '30px' },
    symptomCard: { backgroundColor: 'var(--color-background-offwhite)', padding: '30px', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.07)', border: '1px solid var(--color-border-light)' },
    symptomCardTitle: { fontSize: '1.4em', color: 'var(--color-primary-dark)', marginBottom: '15px' },
    symptomList: { paddingLeft: '20px', lineHeight: '1.8', color: 'var(--color-text-medium)' }
};

export default ConcernPage;