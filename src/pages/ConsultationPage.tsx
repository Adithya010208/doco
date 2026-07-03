/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent, Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Stethoscope, Mic, MicOff, Play, Pause, RefreshCw, 
  Check, FileText, FilePlus, AlertTriangle, ShieldAlert, 
  ShieldCheck, Info, UserCheck, Calendar, Activity, Heart, 
  Trash2, Plus, Sparkles, Send, FileSignature, HelpCircle, ArrowRight
} from 'lucide-react';
import { Patient, PageId } from '../types';

interface ConsultationPageProps {
  patients: Patient[];
  setPatients: Dispatch<SetStateAction<Patient[]>>;
  selectedPatient: Patient | null;
  setSelectedPatient: (patient: Patient | null) => void;
  onNavigate?: (page: PageId) => void;
  autoStartRecording?: boolean;
}

// ----------------- MOCK DATA SCENARIOS -----------------
interface DialogueTurn {
  speaker: 'Doctor' | 'Patient' | 'AI Annotation';
  text: string;
  time: string;
}

interface MockScenario {
  patientId: string;
  scenarioName: string;
  transcript: DialogueTurn[];
  suggestedSoap: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  suggestedPrescriptions: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    refills: number;
  }[];
  suggestedReferral: {
    specialty: string;
    reason: string;
    urgency: 'Routine' | 'Urgent' | 'Immediate';
  } | null;
  suggestedFollowUp: {
    timeframe: string;
    recommendations: string[];
  };
}

const MOCK_SCENARIOS: Record<string, MockScenario> = {
  'pat-001': {
    patientId: 'pat-001',
    scenarioName: 'Cardiovascular Hypertension & Palpitations Evaluation',
    transcript: [
      { speaker: 'Doctor', text: "Hello Robert, good to see you again. How have you been feeling since we increased your Lisinopril to 20mg daily last month?", time: "00:02" },
      { speaker: 'Patient', text: "Hello, Dr. Chen. My blood pressure at home has been much more controlled, usually around 130 over 80. However, I've had these brief, uncomfortable thumping sensations in my chest over the last week.", time: "00:15" },
      { speaker: 'Doctor', text: "I see. Let's do a physical exam. Your heart rate is stable at 72 beats per minute, but I can hear occasional premature beats. Have these thumps been accompanied by any shortness of breath, dizziness, or chest tightness?", time: "00:32" },
      { speaker: 'Patient', text: "No, no dizziness or breathing issues. Just a sudden 'skipped beat' feeling that lasts for a second, mostly when I am resting in the evening.", time: "00:48" },
      { speaker: 'AI Annotation', text: "[Vitals Logged] BP: 138/85 mmHg, HR: 72 bpm, SpO2: 98% on room air. EKG log checks reveal benign premature ventricular contractions (PVCs).", time: "00:58" },
      { speaker: 'Doctor', text: "Your lipid panel shows LDL is still slightly elevated at 115 mg/dL. Given these palpitations and the blood pressure, I'd like to maintain Atorvastatin but add a low-dose beta-blocker. Let's start you on Metoprolol Succinate 25mg once daily.", time: "01:12" },
      { speaker: 'Patient', text: "Okay, doctor. Will that help with the thumping feelings?", time: "01:25" },
      { speaker: 'Doctor', text: "Yes, Metoprolol will stabilize your sinus pace and calm down those extra beats. We will check an EKG again in four weeks.", time: "01:38" }
    ],
    suggestedSoap: {
      subjective: "Patient is a 64-year-old male with a history of chronic hypertension and hyperlipidemia. He reports compliance with Lisinopril 20mg and Atorvastatin 20mg. He notes home blood pressure readings are stable (avg 130/80). He presents today complaining of new-onset intermittent 'thumping' palpitations over the past 7 days, occurring primarily at rest in the evenings. Denies chest pain, shortness of breath, syncope, or orthopnea.",
      objective: "Vitals: BP 138/85 mmHg, HR 72 bpm, RR 14 bpm, Temp 98.4°F, SpO2 98% on room air. Cardio: S1, S2 audible with occasional irregular beats. No murmurs or gallops. Lungs: Clear to auscultation bilaterally. Extremities: No peripheral edema. Lab Panel: Lipid profile total cholesterol 210 mg/dL, LDL 115 mg/dL (slightly elevated), HbA1c 5.8%.",
      assessment: "1. Stage 1 Hypertension - Controlled on Lisinopril 20mg daily.\n2. Premature Ventricular Contractions (PVCs) - Mild, benign, symptomatic, causing transient palpitations.\n3. Hyperlipidemia - Borderline control, continue lipid containment strategy.",
      plan: "1. Add Beta-Blocker therapy: Metoprolol Succinate 25mg orally once daily (QD) to address PVC symptoms and assist with arterial wall pressure.\n2. Continue Lisinopril 20mg QD and Atorvastatin 20mg QD.\n3. Instructed patient to avoid excessive caffeine, alcohol, and high-sodium meals.\n4. Follow-up clinic appointment scheduled in 4 weeks for repeat EKG and compliance audit."
    },
    suggestedPrescriptions: [
      { name: 'Metoprolol Succinate', dosage: '25mg', frequency: 'Once daily (QD)', duration: '30 Days', refills: 2 },
      { name: 'Lisinopril', dosage: '20mg', frequency: 'Once daily (QD)', duration: '90 Days', refills: 3 },
      { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily (QD) at bedtime', duration: '90 Days', refills: 3 }
    ],
    suggestedReferral: null,
    suggestedFollowUp: {
      timeframe: '4 Weeks',
      recommendations: [
        'Perform repeat resting EKG in clinic.',
        'Record home blood pressure readings twice daily (morning & night).',
        'Avoid high caffeine triggers and maintain mild cardio rehab exercises.'
      ]
    }
  },
  'pat-002': {
    patientId: 'pat-002',
    scenarioName: 'Post-Myocardial Infarction 6-Week Recovery Assessment',
    transcript: [
      { speaker: 'Doctor', text: "Hi Eleanor, congratulations on completing your 6-week cardiac rehab program! How is your stamina feeling?", time: "00:03" },
      { speaker: 'Patient', text: "Thank you, Dr. Chen. I feel remarkably better. I can walk for 30 minutes on a flat surface without any tightness or breathing trouble.", time: "00:14" },
      { speaker: 'Doctor', text: "That is spectacular news. Your vitals today look optimal: blood pressure is 118 over 72, and heart rate is resting nicely at 68 bpm.", time: "00:30" },
      { speaker: 'Patient', text: "I've been very careful with my medications. I take Metoprolol, Clopidogrel, and Aspirin every single morning.", time: "00:45" },
      { speaker: 'AI Annotation', text: "[Allergy Guard Enabled] Patient has a documented history of 'Mild GI distress with Aspirin'. No active angioedema or bleeding signs noted today.", time: "00:55" },
      { speaker: 'Doctor', text: "Your echocardiogram shows excellent healing, with an ejection fraction of 52%. We should keep you on your current Dual Antiplatelet Therapy (DAPT) with Clopidogrel and Aspirin 81mg for at least a full year post-stenting. But since you have mild GI distress with Aspirin, remember to take it with meals.", time: "01:15" },
      { speaker: 'Patient', text: "I always take it right after breakfast, which seems to keep my stomach completely settled.", time: "01:28" },
      { speaker: 'Doctor', text: "Perfect. We'll do a routine follow-up check in 3 months.", time: "01:40" }
    ],
    suggestedSoap: {
      subjective: "Patient is a 45-year-old female presenting for her 6-week post-myocardial infarction evaluation. She successfully completed her phase II cardiac rehabilitation program. Reports excellent tolerance, walking 30 minutes daily without dyspnea, orthopnea, or angina. Compliant with Metoprolol, Clopidogrel, and Aspirin 81mg. Notes mild, stable GI sensitivity to Aspirin which is fully mitigated by taking the medication with breakfast.",
      objective: "Vitals: BP 118/72 mmHg, HR 68 bpm, SpO2 99%, Temp 98.2°F, Weight 142 lbs. Cardio: Regular rate and rhythm. No murmurs. Surgical stenting wounds fully healed with no local tenderness. Extremities: Warm, dry, with no pedal edema. Echocardiogram (from archive): LVEF stable at 52% with slight akinesis of the anteroseptal wall.",
      assessment: "1. Coronary Artery Disease (CAD) - Post-AMI (Anterior Myocardial Infarction) with PCI to LAD (May 2026). Healing appropriately, stable clinical recovery.\n2. Left Ventricular Systolic Dysfunction - NYHA Class I, LVEF 52%.\n3. Aspirin-induced GI distress - Fully controlled with food intake.",
      plan: "1. Continue Dual Antiplatelet Therapy (DAPT): Clopidogrel (Plavix) 75mg QD and Aspirin Enteric Coated 81mg QD for 12 months post-procedure.\n2. Maintain Metoprolol Succinate 25mg QD for neurohormonal blockade and cardioprotection.\n3. Reinforce taking Aspirin with a substantial meal to avoid gastric mucosal irritation.\n4. Scheduled 3-month clinic follow-up for lipid and renal assessment."
    },
    suggestedPrescriptions: [
      { name: 'Metoprolol Succinate', dosage: '25mg', frequency: 'Once daily (QD)', duration: '90 Days', refills: 3 },
      { name: 'Clopidogrel (Plavix)', dosage: '75mg', frequency: 'Once daily (QD)', duration: '90 Days', refills: 3 },
      { name: 'Aspirin Enteric Coated', dosage: '81mg', frequency: 'Once daily (QD) after meals', duration: '90 Days', refills: 3 }
    ],
    suggestedReferral: null,
    suggestedFollowUp: {
      timeframe: '3 Months',
      recommendations: [
        'Monitor stool consistency and report any dark tarry stools immediately (bleeding check).',
        'Continue low-fat, low-cholesterol Mediterranean diet.',
        'Engage in regular aerobic exercise (30-45 minutes brisk walking daily).'
      ]
    }
  },
  'pat-003': {
    patientId: 'pat-003',
    scenarioName: 'Type 2 Diabetes Control & Hyperlipidemia Audit',
    transcript: [
      { speaker: 'Doctor', text: "Good morning Marcus, great news on your lab reports today. Your HbA1c is down to 6.9%, which means your diabetes is under tight control!", time: "00:03" },
      { speaker: 'Patient', text: "That's fantastic, Dr. Chen. The Metformin 1000mg twice daily has been working, and I have been diligent with carbohydrate restriction.", time: "00:15" },
      { speaker: 'Doctor', text: "Your effort is clearly paying off. However, your lipid panel shows LDL is still high at 130 mg/dL and total cholesterol is 224 mg/dL.", time: "00:32" },
      { speaker: 'Patient', text: "I see. I'm currently on Atorvastatin 20mg. Should we change that?", time: "00:44" },
      { speaker: 'Doctor', text: "Yes. Given your diabetic status, we target a much stricter LDL level, ideally under 70 mg/dL. I want to step up your Atorvastatin dosage from 20mg to 40mg once daily at bedtime to aggressively lower that risk.", time: "01:05" },
      { speaker: 'Patient', text: "Will there be any side effects with 40mg?", time: "01:18" },
      { speaker: 'Doctor', text: "Most patients tolerate it very well, but let me know if you experience any unusual muscle aches or weakness.", time: "01:30" }
    ],
    suggestedSoap: {
      subjective: "Patient is a 52-year-old male with Type 2 Diabetes and Hyperlipidemia. He reports strict adherence to low-carbohydrate nutritional therapy and Metformin. Denies polyuria, polydipsia, or hypoglycemic tremors. Reports taking Atorvastatin 20mg nightly without muscular side effects.",
      objective: "Vitals: BP 134/82 mmHg, HR 74 bpm, Temp 98.6°F, Weight 215 lbs. Labs: HbA1c down to 6.9% (improved from 7.8%). Lipid Panel: Total Cholesterol 224 mg/dL, Triglycerides 185 mg/dL, LDL 130 mg/dL (uncontrolled). Renal panel: Creatinine 0.9 mg/dL, eGFR 84 mL/min/1.73m² (stable, within range for high-dose Metformin).",
      assessment: "1. Type 2 Diabetes Mellitus - Under excellent metabolic control (HbA1c < 7.0%).\n2. Hyperlipidemia - Under-controlled on Atorvastatin 20mg; higher-intensity statin therapy required given co-existing diabetes cardiorisk.",
      plan: "1. Increase statin intensity: Upgrade Atorvastatin to 40mg orally once daily (QD) at bedtime.\n2. Maintain Metformin HCl 1000mg twice daily (BID) with meals.\n3. Instructed patient on muscle ache warnings (myalgia check) and safety guidelines.\n4. Repeat lipid panel and liver function tests in 8 weeks."
    },
    suggestedPrescriptions: [
      { name: 'Metformin HCl', dosage: '1000mg', frequency: 'Twice daily (BID) with meals', duration: '90 Days', refills: 3 },
      { name: 'Atorvastatin', dosage: '40mg', frequency: 'Once daily (QD) at bedtime', duration: '90 Days', refills: 3 }
    ],
    suggestedReferral: {
      specialty: 'Nutrition & Dietetics',
      reason: 'Structured medical nutrition therapy for diabetic metabolic regulation and hyperlipidemia diet containment.',
      urgency: 'Routine'
    },
    suggestedFollowUp: {
      timeframe: '8 Weeks',
      recommendations: [
        'Repeat fasting lipid panel and basic metabolic panel.',
        'Log fasting blood glucose levels twice weekly (target < 130 mg/dL).',
        'Maintain low glycemic food choices.'
      ]
    }
  },
  'pat-004': {
    patientId: 'pat-004',
    scenarioName: 'Orthostatic Tachycardia Autonomic Review',
    transcript: [
      { speaker: 'Doctor', text: "Hello Clara. Your clinical log shows some severe morning tachycardia and lightheadedness. Let's review what's happening.", time: "00:03" },
      { speaker: 'Patient', text: "Yes, Dr. Chen. When I first stand up in the morning, my heart rates leaps up from 70 straight to 125 beats per minute. I feel so dizzy, like the room is spinning.", time: "00:15" },
      { speaker: 'Doctor', text: "Your tilt table test was strongly positive for Postural Orthostatic Tachycardia Syndrome, or POTS. Your sitting blood pressure today is low-normal at 102 over 64 mmHg.", time: "00:35" },
      { speaker: 'Patient', text: "The Fludrocortisone and Midodrine help slightly, but the tachycardia flares make me feel exhausted.", time: "00:48" },
      { speaker: 'Doctor', text: "Understood. Since beta-blockers might drop your blood pressure further, I want to add Ivabradine 5mg twice daily. It works directly on the sinus node to slow your heart rate down without reducing your systemic blood pressure.", time: "01:08" },
      { speaker: 'Patient', text: "That sounds very promising. Are there any restrictions?", time: "01:20" },
      { speaker: 'Doctor', text: "Yes, you must continue wearing compression stockings (30-40 mmHg), consume 3 liters of water, and add 6 grams of sodium daily to maintain blood volume.", time: "01:38" }
    ],
    suggestedSoap: {
      subjective: "Patient is a 29-year-old female presenting with severe morning lightheadedness, orthostatic dizziness, and palpitations. Diagnosed with POTS (Postural Orthostatic Tachycardia Syndrome) via positive Tilt Table Study. Currently on Midodrine 5mg TID and Fludrocortisone 0.1mg daily. Reports frequent orthostatic spikes up to 125-130 bpm upon standing, significantly limiting daily activities.",
      objective: "Vitals: BP 102/64 mmHg (sitting), HR 78 bpm (sitting), Temp 98.1°F, SpO2 99%, Weight 121 lbs. Orthostatic vitals: Standing HR increased to 118 bpm (+40 bpm increase within 3 minutes of standing) without orthostatic hypotension.",
      assessment: "1. Postural Orthostatic Tachycardia Syndrome (POTS) - Severely symptomatic, refractory to dual-agent pressor/volume expansion therapy.\n2. Chronic Constitutional Hypotension - Controlled with Midodrine.",
      plan: "1. Add sinus-node inhibitor: Ivabradine 5mg orally twice daily (BID) to control standing tachycardia without compromising systemic blood pressure.\n2. Continue Midodrine 5mg TID and Fludrocortisone 0.1mg QD.\n3. Instructed to consume 3-3.5 liters of fluids daily and ingest 6 grams of sodium daily.\n4. Recommend high-grade medical compression stockings (30-40 mmHg) up to the waist."
    },
    suggestedPrescriptions: [
      { name: 'Ivabradine', dosage: '5mg', frequency: 'Twice daily (BID)', duration: '30 Days', refills: 2 },
      { name: 'Midodrine HCl', dosage: '5mg', frequency: 'Three times daily (TID)', duration: '60 Days', refills: 3 },
      { name: 'Fludrocortisone', dosage: '0.1mg', frequency: 'Once daily (QD)', duration: '60 Days', refills: 3 }
    ],
    suggestedReferral: {
      specialty: 'Autonomic Neurology',
      reason: 'Advanced autonomic function assessment and sympathetic reflex mapping for POTS refractory symptoms.',
      urgency: 'Routine'
    },
    suggestedFollowUp: {
      timeframe: '2 Weeks',
      recommendations: [
        'Log standing and sitting heart rates twice daily.',
        'Ensure fluid goals (3L/day) are tracked using a digital water bottle.',
        'Engage in recumbent exercise (rowing or stationary cycling) for 20 minutes daily.'
      ]
    }
  },
  'pat-005': {
    patientId: 'pat-005',
    scenarioName: 'Dilated Cardiomyopathy Congestive Heart Failure Flare-Up',
    transcript: [
      { speaker: 'Doctor', text: "Harvey, I saw your urgent appointment request and the weight warning from your home scale log. How are you feeling today?", time: "00:02" },
      { speaker: 'Patient', text: "Not good, Dr. Chen. I am quite short of breath today, even just resting on the sofa. I noticed my ankles are swollen, and I've put on over 3 pounds since Wednesday.", time: "00:15" },
      { speaker: 'Doctor', text: "Let me check. Your blood oxygen saturation is slightly lower at 94% on room air, and your heart rate is rapid at 88 beats per minute. I can hear crackles at the bases of your lungs.", time: "00:34" },
      { speaker: 'Patient', text: "Is this a fluid build-up from my cardiomyopathy?", time: "00:44" },
      { speaker: 'Doctor', text: "Yes, this represents a mild congestive heart failure flare-up. Your heart is having trouble keeping up with fluid filtration. Your BNP level of 1200 pg/mL is also critically elevated.", time: "01:05" },
      { speaker: 'Patient', text: "Should I go to the hospital?", time: "01:15" },
      { speaker: 'Doctor', text: "We can try to manage this at home first to avoid hospitalization. I want you to double your Furosemide (Lasix) dose from 40mg to 80mg daily for the next 3 days to aggressively flush out the extra fluid. Also, remember you are highly allergic to Lisinopril, which is why we must never use regular ACE inhibitors.", time: "01:35" },
      { speaker: 'Patient', text: "Okay, I will double my water pill starting today. I'll also limit my fluids strictly to 1.5 liters a day as we discussed.", time: "01:48" },
      { speaker: 'Doctor', text: "Perfect. We will have our nurse call you tomorrow morning to check your weight.", time: "01:58" }
    ],
    suggestedSoap: {
      subjective: "Patient is a 41-year-old male with dilated cardiomyopathy and NYHA Class III Congestive Heart Failure. Presents with acute dyspnea at rest, progressive bilateral lower extremity edema (2+), and a rapid weight gain of 3.2 lbs over 48 hours. Patient is compliant with Entresto 49/51mg and Spironolactone 25mg. Strict fluid compliance had recently slipped. Highly allergic to Lisinopril (ACE-I) causing prior severe angioedema.",
      objective: "Vitals: BP 108/60 mmHg, HR 88 bpm (sinus tachycardia), RR 20 bpm, SpO2 94% on room air, Temp 97.9°F, Weight 198 lbs (up from 195 lbs baseline). Pulmonary: Mild bilateral basilar crackles audible. Extremities: 2+ pitting pedal edema to mid-shin bilaterally. Labs (Archive): BNP 1200 pg/mL (elevated), Creatinine 1.4 mg/dL.",
      assessment: "1. Acute Decompensated Heart Failure (ADHF) - NYHA Class III, secondary to Dilated Cardiomyopathy. Triggered by mild dietary sodium slip/fluid retention.\n2. Severe Lisinopril Angioedema Allergy - Contraindicates ACE inhibitor therapy.",
      plan: "1. Intensely diuresis patient: Double oral Furosemide (Lasix) to 80mg once daily (QD) for 3 days, then return to 40mg baseline. monitor weights.\n2. Maintain Sacubitril/Valsartan (Entresto) 49/51mg twice daily (BID) and Spironolactone 25mg daily.\n3. Enforce strict 1.5-liter fluid restriction and sodium restriction under 1500mg daily.\n4. Scheduled urgent phone-nurse check-in tomorrow morning. If weight does not decrease or dyspnea worsens, proceed to ER."
    },
    suggestedPrescriptions: [
      { name: 'Furosemide (Lasix)', dosage: '81mg', frequency: '80mg once daily (QD) for 3 days, then return to 40mg daily', duration: '30 Days', refills: 1 },
      { name: 'Sacubitril/Valsartan (Entresto)', dosage: '49/51mg', frequency: 'Twice daily (BID)', duration: '90 Days', refills: 3 },
      { name: 'Spironolactone', dosage: '25mg', frequency: 'Once daily (QD)', duration: '90 Days', refills: 3 }
    ],
    suggestedReferral: {
      specialty: 'Advanced Heart Failure Cardiology Specialist',
      reason: 'Urgent evaluation for progressive dilated cardiomyopathy left ventricular dysfunction and consideration of cardiac resynchronization therapy.',
      urgency: 'Urgent'
    },
    suggestedFollowUp: {
      timeframe: '48 Hours',
      recommendations: [
        'Report immediate morning weight log. Alert clinic if weight increases further.',
        'Adhere to strict 1.5 Liter total fluid container limitation.',
        'Rest with head elevated on 2-3 pillows.'
      ]
    }
  }
};

export default function ConsultationPage({
  patients,
  setPatients,
  selectedPatient,
  setSelectedPatient,
  onNavigate,
  autoStartRecording = false
}: ConsultationPageProps) {
  
  // 1. ACTIVE PATIENT & SCENARIO SELECTION
  const [activePatient, setActivePatient] = useState<Patient>(selectedPatient || patients[0]);
  const activeScenario = MOCK_SCENARIOS[activePatient.id] || MOCK_SCENARIOS['pat-001'];

  // Sync selected patient if changed outside
  useEffect(() => {
    if (selectedPatient) {
      setActivePatient(selectedPatient);
    }
  }, [selectedPatient]);

  // Handle auto-starting the consultation dialogue session
  useEffect(() => {
    if (autoStartRecording && activePatient) {
      setIsRecording(true);
      if (visibleTranscript.length === 0) {
        const scenario = MOCK_SCENARIOS[activePatient.id] || MOCK_SCENARIOS['pat-001'];
        setVisibleTranscript([scenario.transcript[0]]);
        setTranscriptProgress(1);
      }
    }
  }, [autoStartRecording, activePatient]);

  const handlePatientSelect = (patientId: string) => {
    const pat = patients.find(p => p.id === patientId);
    if (pat) {
      setActivePatient(pat);
      setSelectedPatient(pat);
      // Reset consultation state
      setIsRecording(false);
      setRecordingSeconds(0);
      setTranscriptProgress(0);
      setVisibleTranscript([]);
      setSoapSubjective('');
      setSoapObjective('');
      setSoapAssessment('');
      setSoapPlan('');
      setNewPrescriptions([]);
      setReferralLetter(null);
      setMedicalCertificate(null);
      setDiagnosis('');
      setFollowUpTimeframe('2 Weeks');
      setFollowUpNotes('');
      setSoapGenerated(false);
      setRxGenerated(false);
    }
  };

  // 2. SPEECH RECORDING & TRANSCRIPTION ANIMATION STATES
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [transcriptProgress, setTranscriptProgress] = useState(0); // Index of dialogue shown
  const [visibleTranscript, setVisibleTranscript] = useState<DialogueTurn[]>([]);
  const [isGeneratingSoap, setIsGeneratingSoap] = useState(false);
  const [soapGenerated, setSoapGenerated] = useState(false);
  const [isGeneratingRx, setIsGeneratingRx] = useState(false);
  const [rxGenerated, setRxGenerated] = useState(false);

  // 3. EDITABLE CLINICAL OUTPUTS
  const [soapSubjective, setSoapSubjective] = useState('');
  const [soapObjective, setSoapObjective] = useState('');
  const [soapAssessment, setSoapAssessment] = useState('');
  const [soapPlan, setSoapPlan] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  
  // Prescription creator
  const [newPrescriptions, setNewPrescriptions] = useState<{
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    refills: number;
  }[]>([]);

  // Manual medication adder
  const [manualMedName, setManualMedName] = useState('');
  const [manualMedDosage, setManualMedDosage] = useState('');
  const [manualMedFreq, setManualMedFreq] = useState('');
  const [manualMedDuration, setManualMedDuration] = useState('30 Days');
  const [manualMedRefills, setManualMedRefills] = useState(2);

  // Document states
  const [referralLetter, setReferralLetter] = useState<{
    specialty: string;
    reason: string;
    urgency: string;
    date: string;
    signedBy: string;
    referenceHash: string;
  } | null>(null);

  const [medicalCertificate, setMedicalCertificate] = useState<{
    patientName: string;
    patientId: string;
    age: number;
    gender: string;
    restDays: number;
    reason: string;
    restrictions: string;
    date: string;
    signedBy: string;
    referenceHash: string;
  } | null>(null);

  // Follow-up Recommendations
  const [followUpTimeframe, setFollowUpTimeframe] = useState('2 Weeks');
  const [followUpNotes, setFollowUpNotes] = useState('');

  // Premium Custom Alert & Confirm state
  const [customModalAlert, setCustomModalAlert] = useState<{
    title: string;
    message: string;
    type: 'warning' | 'info' | 'success';
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
  } | null>(null);

  // 4. ANIMATION TIMER FOR LIVE RECORDING
  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
        
        // Feed transcript turns incrementally to simulate real-time typing
        const fullTranscript = activeScenario.transcript;
        if (transcriptProgress < fullTranscript.length) {
          // Add a line of dialog roughly every 6-8 seconds
          if (recordingSeconds > 0 && recordingSeconds % 6 === 0) {
            setVisibleTranscript(prev => [...prev, fullTranscript[transcriptProgress]]);
            setTranscriptProgress(p => p + 1);
          }
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording, recordingSeconds, transcriptProgress, activeScenario]);

  // Handle Quick Play Scenario button: dumps all conversation instantly
  const handleQuickPlayScenario = () => {
    setVisibleTranscript(activeScenario.transcript);
    setTranscriptProgress(activeScenario.transcript.length);
    setRecordingSeconds(68);
  };

  // Toggle Recording state
  const handleToggleListening = () => {
    if (!isRecording) {
      // Starting
      setIsRecording(true);
      if (visibleTranscript.length === 0) {
        setVisibleTranscript([activeScenario.transcript[0]]);
        setTranscriptProgress(1);
      }
    } else {
      // Paused
      setIsRecording(false);
    }
  };

  // Reset recording timeline
  const handleResetListening = () => {
    setIsRecording(false);
    setRecordingSeconds(0);
    setTranscriptProgress(0);
    setVisibleTranscript([]);
  };

  // 5. CLINICAL REASONING: GENERATING SOAP & DRUGS
  const handleGenerateSoap = () => {
    if (visibleTranscript.length === 0) {
      setCustomModalAlert({
        title: "No Transcript Recorded",
        message: "No live transcript logged yet. Please start voice simulation dictation or load a pre-set patient conversation scenario.",
        type: "info"
      });
      return;
    }

    setIsGeneratingSoap(true);
    setTimeout(() => {
      setIsGeneratingSoap(false);
      setSoapGenerated(true);
      setSoapSubjective(activeScenario.suggestedSoap.subjective);
      setSoapObjective(activeScenario.suggestedSoap.objective);
      setSoapAssessment(activeScenario.suggestedSoap.assessment);
      setSoapPlan(activeScenario.suggestedSoap.plan);
      setDiagnosis(activePatient.condition);
      setFollowUpTimeframe(activeScenario.suggestedFollowUp.timeframe);
      setFollowUpNotes(activeScenario.suggestedFollowUp.recommendations.join('\n'));
      
      // Auto-populate documents if scenario supports it
      if (activeScenario.suggestedReferral) {
        setReferralLetter({
          specialty: activeScenario.suggestedReferral.specialty,
          reason: activeScenario.suggestedReferral.reason,
          urgency: activeScenario.suggestedReferral.urgency,
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          signedBy: 'Dr. Sarah Chen, MD',
          referenceHash: `REF-${Math.floor(100000 + Math.random() * 900000)}`
        });
      }
    }, 2000); // 2 second mock AI latency
  };

  const handleGeneratePrescriptions = () => {
    if (!soapGenerated) {
      setCustomModalAlert({
        title: "SOAP Synthesis Required",
        message: "Please synthesize the SOAP notes first to guide dynamic AI drug safety recommendations and check cross-referencing contraindications.",
        type: "warning"
      });
      return;
    }

    setIsGeneratingRx(true);
    setTimeout(() => {
      setIsGeneratingRx(false);
      setRxGenerated(true);
      
      // Load mock suggestions
      const suggestions = activeScenario.suggestedPrescriptions.map((rx, idx) => ({
        id: `rx-live-${idx + 1}`,
        ...rx
      }));
      setNewPrescriptions(suggestions);
    }, 1500);
  };

  // Manual medication adder
  const handleAddManualMed = (e: FormEvent) => {
    e.preventDefault();
    if (!manualMedName || !manualMedDosage) return;

    const med = {
      id: `rx-man-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: manualMedName,
      dosage: manualMedDosage,
      frequency: manualMedFreq || 'Once daily (QD)',
      duration: manualMedDuration,
      refills: manualMedRefills
    };

    setNewPrescriptions(prev => [...prev, med]);
    setManualMedName('');
    setManualMedDosage('');
  };

  const handleRemovePrescription = (id: string) => {
    setNewPrescriptions(prev => prev.filter(rx => rx.id !== id));
  };

  // 6. CLINICAL SAFETY ALERT SYSTEM
  const getSafetyAlerts = () => {
    const alerts: { type: 'allergy' | 'interaction'; title: string; message: string; severity: 'high' | 'moderate' }[] = [];
    const patientAllergies = activePatient.allergies || [];
    
    // Check allergy warnings
    newPrescriptions.forEach(rx => {
      const rxNameLower = rx.name.toLowerCase();
      
      patientAllergies.forEach(allergy => {
        const allergyLower = allergy.toLowerCase();
        
        // Simple matches
        if (rxNameLower.includes('lisinopril') && allergyLower.includes('lisinopril')) {
          alerts.push({
            type: 'allergy',
            title: `CRITICAL ALLERGY: Lisinopril Contraindication`,
            message: `Patient has a severe documented allergy to Lisinopril ("${allergy}"). Administration of ACE inhibitors may result in fatal angioedema or airway obstruction.`,
            severity: 'high'
          });
        }
        else if (rxNameLower.includes('penicillin') && allergyLower.includes('penicillin')) {
          alerts.push({
            type: 'allergy',
            title: `CRITICAL ALLERGY: Penicillin Allergy`,
            message: `Patient has a documented Penicillin allergy. Risk of immediate type I anaphylactic hypersensitivity reactions.`,
            severity: 'high'
          });
        }
        else if (rxNameLower.includes('aspirin') && allergyLower.includes('aspirin')) {
          alerts.push({
            type: 'allergy',
            title: `ALLERGY WARNING: Aspirin Sensitivity`,
            message: `Patient has an Aspirin sensitivity ("${allergy}"). Consider alternative therapies or ensure administration occurs exclusively post-meal with gastric mucosal protectors.`,
            severity: 'moderate'
          });
        }
      });

      // Drug-Drug interactions
      // 1. Entresto (Sacubitril/Valsartan) and Lisinopril
      if (rxNameLower.includes('lisinopril')) {
        const isTakingEntresto = activePatient.currentMedications?.some(m => m.name.toLowerCase().includes('entresto') || m.name.toLowerCase().includes('sacubitril')) ||
                                 newPrescriptions.some(r => r.name.toLowerCase().includes('entresto') || r.name.toLowerCase().includes('sacubitril'));
        if (isTakingEntresto) {
          alerts.push({
            type: 'interaction',
            title: `FATAL DRUG INTERACTION: ACE-I + ARNI`,
            message: `Simultaneous use of Lisinopril (ACE inhibitor) and Sacubitril/Valsartan (Entresto - ARNI) is strictly contraindicated. Requires a minimum 36-hour washout period. Extremely high risk of life-threatening angioedema.`,
            severity: 'high'
          });
        }
      }

      // 2. Viagra (Sildenafil) and Nitrates (Isosorbide Mononitrate / Nitroglycerin)
      if (rxNameLower.includes('sildenafil') || rxNameLower.includes('viagra')) {
        const isTakingNitrate = activePatient.currentMedications?.some(m => m.name.toLowerCase().includes('nitro') || m.name.toLowerCase().includes('isosorbide')) ||
                                newPrescriptions.some(r => r.name.toLowerCase().includes('nitro') || r.name.toLowerCase().includes('isosorbide'));
        if (isTakingNitrate) {
          alerts.push({
            type: 'interaction',
            title: `CRITICAL INTERACTION: Sildenafil + Nitroglycerin`,
            message: `Co-administration of phosphodiesterase inhibitors (Sildenafil) and nitrates causes profound, synergistic, life-threatening systemic hypotension.`,
            severity: 'high'
          });
        }
      }

      // 3. Warfarin + Aspirin
      if (rxNameLower.includes('warfarin')) {
        const isTakingAspirin = activePatient.currentMedications?.some(m => m.name.toLowerCase().includes('aspirin')) ||
                                newPrescriptions.some(r => r.name.toLowerCase().includes('aspirin'));
        if (isTakingAspirin) {
          alerts.push({
            type: 'interaction',
            title: `INTERACTION WARNING: Warfarin + Aspirin Co-therapy`,
            message: `Bilateral antiplatelet and anticoagulant regimen dramatically increases major gastrointestinal and intracranial bleeding risk. Monitor INR closely and assess bleeding thresholds.`,
            severity: 'moderate'
          });
        }
      }
    });

    return alerts;
  };

  const activeAlerts = getSafetyAlerts();

  // 7. BUILD DOCUMENTS
  const handleGenerateCertificate = (restDays: number) => {
    if (!restDays || restDays <= 0) return;
    
    setMedicalCertificate({
      patientName: activePatient.name,
      patientId: activePatient.id,
      age: activePatient.age,
      gender: activePatient.gender,
      restDays,
      reason: `Patient is currently recovering under direct clinical supervision following an evaluation for: ${activePatient.condition}.`,
      restrictions: `Strict cardiac rest. No isometric exertion. Lift limit < 15 lbs. Stay hydrated and monitor physiological vitals.`,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      signedBy: 'Dr. Sarah Chen, MD',
      referenceHash: `CERT-${Math.floor(100000 + Math.random() * 900000)}`
    });
  };

  // 8. APPROVE & PROPAGATE BACK TO EMR DATABASE
  const [saveSuccess, setSaveSuccess] = useState(false);

  const executeSave = () => {
    const dateStr = new Date().toISOString().split('T')[0];
    
    // Format new medications to merge
    const approvedMeds = newPrescriptions.map(rx => ({
      name: rx.name,
      dosage: rx.dosage,
      frequency: rx.frequency,
      startDate: dateStr,
      status: 'Active' as const
    }));

    // Construct clinical history entry
    const historyItem = {
      date: dateStr,
      diagnosis: diagnosis || activePatient.condition,
      treatment: `AI Guided consultation completed. Recommeded strategy: ${newPrescriptions.map(r => r.name).join(', ') || 'Continued therapeutic containment'}.`,
      notes: soapSubjective ? `SUBJECTIVE: ${soapSubjective.slice(0, 150)}...\nPLAN: ${soapPlan.slice(0, 150)}...` : 'Consultation notes generated and filed.'
    };

    setPatients(prev => prev.map(p => {
      if (p.id === activePatient.id) {
        // Merge medications (keep old active medications not discontinued, and append new ones)
        const oldMeds = p.currentMedications || [];
        // Dedup: remove any old medication if the new one replaces it by name
        const filteredOldMeds = oldMeds.filter(om => !approvedMeds.some(nm => nm.name.toLowerCase() === om.name.toLowerCase()));
        const mergedMeds = [...filteredOldMeds, ...approvedMeds];

        const updated = {
          ...p,
          condition: diagnosis || p.condition,
          lastVisit: dateStr,
          currentMedications: mergedMeds,
          history: [historyItem, ...p.history]
        };

        // Sync local selected patient state
        setSelectedPatient(updated);
        return updated;
      }
      return p;
    }));

    setSaveSuccess(true);
    setCustomModalAlert(null); // Clear any open modal
    setTimeout(() => {
      setSaveSuccess(false);
      if (onNavigate) {
        onNavigate('patients'); // Redirect to EMR viewer automatically to inspect changes
      }
    }, 2000);
  };

  const handleApproveAndSave = () => {
    if (!soapGenerated) {
      setCustomModalAlert({
        title: "SOAP Notes Required",
        message: "Please generate and edit the SOAP notes before saving the consultation session to the clinical ledger.",
        type: "warning"
      });
      return;
    }

    // Check if high severity safety alerts are ignored
    const highSeverityAlerts = activeAlerts.filter(a => a.severity === 'high');
    if (highSeverityAlerts.length > 0) {
      setCustomModalAlert({
        title: "Clinical Safety Warning",
        message: `There are critical clinical contraindications listed in the Alerts panel:\n\n${highSeverityAlerts.map(a => `• ${a.title}`).join('\n')}\n\nDo you want to manually authorize a clinical override and commit these files to the patient record?`,
        type: "warning",
        confirmText: "Authorize Override & Commit",
        cancelText: "Cancel & Review Alerts",
        onConfirm: executeSave
      });
      return;
    }

    executeSave();
  };

  return (
    <>
      <div className="space-y-6">
      
      {/* ----------------- TOP CONTROLLER HEADER ----------------- */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950/50 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
              DOCO AI Consultation Workspace
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Simulated live diagnostic speech-to-text analyzer and real-time clinical safety auditor</p>
          </div>
        </div>

        {/* Patient Selection Dropdown */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">Consulting Patient:</span>
          <select
            value={activePatient.id}
            onChange={(e) => handlePatientSelect(e.target.value)}
            className="w-full md:w-60 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
            ))}
          </select>
        </div>
      </div>

      {/* ----------------- MAIN GRID ----------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ======================================================================
           LEFT COLUMN: PATIENT SUMMARY & SPEECH TELEMETRY PANEL (LG:COL-5)
           ====================================================================== */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Patient Quick Info Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <img 
                  src={activePatient.avatar} 
                  alt={activePatient.name} 
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/25"
                />
                <div>
                  <h3 className="text-base font-black text-slate-950 dark:text-white leading-tight">{activePatient.name}</h3>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mt-0.5">
                    {activePatient.id} • {activePatient.gender}, {activePatient.age} y/o • Blood: {activePatient.bloodType}
                  </span>
                </div>
              </div>
              <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                activePatient.status === 'Stable' 
                  ? 'bg-emerald-500/5 text-emerald-500 border border-emerald-500/10' 
                  : activePatient.status === 'Critical' 
                  ? 'bg-red-500/5 text-red-500 border border-red-500/10 animate-pulse' 
                  : 'bg-blue-500/5 text-blue-500 border border-blue-500/10'
              }`}>
                {activePatient.status}
              </span>
            </div>

            {/* Vitals Summary row */}
            <div className="grid grid-cols-4 gap-2 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-150 dark:border-slate-850">
              <div className="text-center">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase">BP</span>
                <p className="text-xs font-black text-slate-800 dark:text-slate-200 font-mono mt-0.5">{activePatient.vitals?.bloodPressure || '--'}</p>
              </div>
              <div className="text-center border-l border-slate-150 dark:border-slate-800">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase">H.R</span>
                <p className="text-xs font-black text-slate-800 dark:text-slate-200 font-mono mt-0.5">{activePatient.vitals?.heartRate ? `${activePatient.vitals.heartRate} bpm` : '--'}</p>
              </div>
              <div className="text-center border-l border-slate-150 dark:border-slate-800">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase">SpO2</span>
                <p className="text-xs font-black text-slate-800 dark:text-slate-200 font-mono mt-0.5">{activePatient.vitals?.oxygenLevel ? `${activePatient.vitals.oxygenLevel}%` : '--'}</p>
              </div>
              <div className="text-center border-l border-slate-150 dark:border-slate-800">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase">Glucose</span>
                <p className="text-xs font-black text-slate-800 dark:text-slate-200 font-mono mt-0.5">{activePatient.vitals?.glucose || '--'}</p>
              </div>
            </div>

            {/* Allergies & Current Meds list */}
            <div className="grid grid-cols-2 gap-4 text-xs pt-1">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-1.5">Allergies ({activePatient.allergies?.length || 0})</span>
                <div className="flex flex-wrap gap-1">
                  {activePatient.allergies && activePatient.allergies.length > 0 ? (
                    activePatient.allergies.map((alg, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[10px] border border-amber-500/15">
                        ⚠️ {alg}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">None logged</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-1.5">Active Meds ({activePatient.currentMedications?.length || 0})</span>
                <ul className="space-y-1 max-h-24 overflow-y-auto pr-1">
                  {activePatient.currentMedications?.map((m, idx) => (
                    <li key={idx} className="text-[10px] font-bold text-slate-600 dark:text-slate-400 truncate flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      {m.name} {m.dosage}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Simulated Voice Dictation & Real-Time Telemetry Screen */}
          <div className="bg-slate-950 text-white rounded-3xl border border-slate-900 overflow-hidden shadow-lg shadow-black/30 flex flex-col h-[520px]">
            
            {/* Header Area */}
            <div className="p-4 bg-slate-900/80 border-b border-slate-900 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-700'}`} />
                <span className="text-xs font-bold font-mono tracking-widest text-slate-300">
                  {isRecording ? 'LIVE_SPEECH_CAPTURING' : 'RECORDER_STANDBY'}
                </span>
              </div>
              <div className="text-xs font-bold font-mono text-slate-400">
                TIME: {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, '0')}
              </div>
            </div>

            {/* Audio Waveform Canvas Box */}
            <div className="h-28 bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center relative border-b border-slate-900/60 overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
              
              {/* Pulsing circular core */}
              <AnimatePresence>
                {isRecording && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.25, 0.1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute w-40 h-40 bg-blue-500 rounded-full blur-3xl"
                  />
                )}
              </AnimatePresence>

              {/* Dynamic waveform bars */}
              <div className="flex items-center gap-1 h-14 relative z-10 px-6">
                {Array.from({ length: 28 }).map((_, idx) => {
                  // Simulate randomized height parameters that change beautifully on interval
                  return (
                    <motion.div
                      key={idx}
                      animate={isRecording ? {
                        height: [
                          `${10 + Math.random() * 45}px`,
                          `${15 + Math.random() * 65}px`,
                          `${10 + Math.random() * 45}px`
                        ]
                      } : { height: '8px' }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.5 + Math.random() * 0.8,
                        ease: "easeInOut"
                      }}
                      className={`w-1 rounded-full transition-all ${
                        isRecording 
                          ? 'bg-gradient-to-t from-blue-500 to-indigo-400' 
                          : 'bg-slate-800'
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Live Transcript Content Frame */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 font-sans text-xs scrollbar-none bg-slate-950/40">
              {visibleTranscript.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-3 p-4">
                  <Mic className="w-8 h-8 text-slate-700 animate-bounce" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Consultation Line Waiting</h4>
                    <p className="text-[10px] text-slate-600 mt-1 max-w-xs">Click "Start Dictation" or "Load Scenario" to trigger simulated conversation logs.</p>
                  </div>
                </div>
              ) : (
                visibleTranscript.map((turn, idx) => {
                  const isDoc = turn.speaker === 'Doctor';
                  const isAi = turn.speaker === 'AI Annotation';
                  
                  if (isAi) {
                    return (
                      <div key={idx} className="bg-blue-950/40 border border-blue-900/40 px-3.5 py-2.5 rounded-2xl text-[10px] text-blue-300 font-mono flex items-start gap-2.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-blue-200">SYSTEM COGNITION LOG:</strong> {turn.text}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={idx} className={`flex flex-col ${isDoc ? 'items-end' : 'items-start'} space-y-1`}>
                      <span className="text-[9px] font-bold text-slate-500 font-mono uppercase tracking-widest px-1">
                        {turn.speaker} • {turn.time}
                      </span>
                      <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl font-medium leading-relaxed ${
                        isDoc 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-slate-900 text-slate-200 rounded-tl-none border border-slate-850'
                      }`}>
                        {turn.text}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Telemetry Footer & Mic Controllers */}
            <div className="p-4 bg-slate-900 border-t border-slate-900 flex gap-2 shrink-0">
              
              {/* Dynamic Mic Buttons */}
              <button
                onClick={handleToggleListening}
                className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  isRecording 
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/10' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/10'
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-4 h-4" /> Pause Recording
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 animate-pulse" /> Start Dictation
                  </>
                )}
              </button>

              {/* Reset/Clean */}
              <button
                onClick={handleResetListening}
                disabled={visibleTranscript.length === 0}
                className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-40 rounded-2xl transition-all border border-slate-700/40"
                title="Flush transcription log"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              {/* Instant dialogue shortcut */}
              <button
                onClick={handleQuickPlayScenario}
                disabled={visibleTranscript.length === activeScenario.transcript.length}
                className="px-3 py-2.5 bg-indigo-950 hover:bg-indigo-900 text-indigo-400 hover:text-indigo-200 text-[10px] font-black uppercase tracking-wider rounded-2xl transition-all border border-indigo-900/50"
                title="Instant dialogue shortcut"
              >
                Fast Dialogue
              </button>

            </div>
          </div>

        </div>

        {/* ======================================================================
           RIGHT COLUMN: CLINICAL DECISION COGNITION (LG:COL-7)
           ====================================================================== */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Action trigger row */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm flex flex-wrap gap-2 justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">AI Diagnostics Engine</span>
            
            <div className="flex gap-2">
              <button
                onClick={handleGenerateSoap}
                disabled={visibleTranscript.length === 0 || isGeneratingSoap}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-100 dark:disabled:bg-slate-950 disabled:text-slate-400 text-white font-extrabold rounded-2xl text-[11px] uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
              >
                {isGeneratingSoap ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Synthesizing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" /> Generate SOAP Notes
                  </>
                )}
              </button>

              <button
                onClick={handleGeneratePrescriptions}
                disabled={!soapGenerated || isGeneratingRx}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 disabled:bg-slate-50 dark:disabled:bg-slate-950 disabled:text-slate-400 text-slate-800 dark:text-slate-200 font-extrabold rounded-2xl text-[11px] uppercase tracking-wider transition-all flex items-center gap-1.5"
              >
                {isGeneratingRx ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Matching drugs...
                  </>
                ) : (
                  <>
                    <FilePlus className="w-3.5 h-3.5" /> Recommend Meds
                  </>
                )}
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* 1. MOCK LOADING AI PLACEHOLDER */}
            {!soapGenerated && !isGeneratingSoap ? (
              <motion.div
                key="welcome-ai"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center rounded-3xl"
              >
                <Stethoscope className="w-12 h-12 text-blue-500/20 mx-auto mb-4" />
                <h3 className="text-base font-black text-slate-950 dark:text-white">Awaiting Clinical Data Synthesis</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 max-w-md mx-auto leading-relaxed">
                  Start the voice recorder dictation or play the conversation log. Once dialogue records are registered, click **"Generate SOAP Notes"** to trigger clinical AI parsing.
                </p>

                <div className="mt-6 inline-flex gap-3 text-xs">
                  <button 
                    onClick={handleQuickPlayScenario}
                    className="px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 text-blue-500" /> Play Conversation Scenario
                  </button>
                </div>
              </motion.div>
            ) : isGeneratingSoap ? (
              <motion.div
                key="loading-soap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-16 text-center rounded-3xl space-y-4"
              >
                <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mx-auto" />
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">AI Engine Synthesizing Electronic Health Record</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Extracting clinical statements, matching physiological vitals, and mapping medical codes...</p>
                </div>
              </motion.div>
            ) : (
              /* ======================================================================
                 THE REAL WORKSPACE: EDITABLE CLINICAL OUTLINES
                 ====================================================================== */
              <motion.div
                key="clinical-workspace"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* 1. EDITABLE SOAP SECTION CARD */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-5">
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/60 pb-3">
                    <h3 className="text-sm font-black text-slate-950 dark:text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" /> Editable SOAP Diagnostic Chart
                    </h3>
                    <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      ✓ AI Synthesized
                    </span>
                  </div>

                  {/* Diagnosis Outline */}
                  <div className="space-y-1.5">
                    <label htmlFor="diag" className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Primary Consultation Diagnosis</label>
                    <input 
                      id="diag"
                      type="text" 
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl py-2.5 px-4 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500"
                      placeholder="e.g. Hypertensive heart disease"
                    />
                  </div>

                  {/* S - Subjective */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label htmlFor="sub" className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Subjective (Symptoms, timeline, patient claims)</label>
                      <span className="text-[9px] font-bold text-slate-400">S</span>
                    </div>
                    <textarea 
                      id="sub"
                      rows={4}
                      value={soapSubjective}
                      onChange={(e) => setSoapSubjective(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl p-4 text-xs font-medium text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500 resize-none leading-relaxed"
                    />
                  </div>

                  {/* O - Objective */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label htmlFor="obj" className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Objective (Physical assessment findings, Vitals, Lab values)</label>
                      <span className="text-[9px] font-bold text-slate-400">O</span>
                    </div>
                    <textarea 
                      id="obj"
                      rows={3}
                      value={soapObjective}
                      onChange={(e) => setSoapObjective(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl p-4 text-xs font-medium text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500 resize-none leading-relaxed"
                    />
                  </div>

                  {/* A - Assessment */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label htmlFor="ass" className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Assessment (Diagnosis conclusions & differential diagnosis codes)</label>
                      <span className="text-[9px] font-bold text-slate-400">A</span>
                    </div>
                    <textarea 
                      id="ass"
                      rows={3}
                      value={soapAssessment}
                      onChange={(e) => setSoapAssessment(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl p-4 text-xs font-medium text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500 resize-none leading-relaxed font-mono"
                    />
                  </div>

                  {/* P - Plan */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label htmlFor="pln" className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Plan (Therapeutic modifications, medical procedures, lifestyle orders)</label>
                      <span className="text-[9px] font-bold text-slate-400">P</span>
                    </div>
                    <textarea 
                      id="pln"
                      rows={4}
                      value={soapPlan}
                      onChange={(e) => setSoapPlan(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl p-4 text-xs font-medium text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500 resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* 2. PRESCRIPTION GENERATOR WITH ALLERGY & DRUG INTERACTION COGNITION */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/60 pb-3">
                    <h3 className="text-sm font-black text-slate-950 dark:text-white flex items-center gap-2">
                      <Activity className="w-4 h-4 text-red-500" /> Prescription & Safety Alerts
                    </h3>
                    
                    {!rxGenerated && (
                      <button
                        onClick={handleGeneratePrescriptions}
                        className="text-[10px] bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-black uppercase tracking-wider px-3 py-1.5 rounded-xl border border-red-500/10 flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-red-500" /> Recommend Meds
                      </button>
                    )}
                  </div>

                  {/* REAL-TIME AUDIT SHIELD SECTION */}
                  <div className="space-y-2">
                    {activeAlerts.length > 0 ? (
                      activeAlerts.map((alert, idx) => (
                        <div 
                          key={idx} 
                          className={`border p-4 rounded-2xl text-xs flex items-start gap-3.5 transition-all ${
                            alert.severity === 'high' 
                              ? 'bg-red-500/5 border-red-500/20 text-red-700 dark:text-red-400 animate-pulse' 
                              : 'bg-amber-500/5 border-amber-500/20 text-amber-700 dark:text-amber-400'
                          }`}
                        >
                          <ShieldAlert className={`w-5 h-5 shrink-0 mt-0.5 ${alert.severity === 'high' ? 'text-red-500' : 'text-amber-500'}`} />
                          <div>
                            <strong className="font-extrabold text-sm block tracking-tight mb-0.5">{alert.title}</strong>
                            <p className="leading-relaxed font-medium">{alert.message}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-emerald-500/5 border border-emerald-500/15 p-4 rounded-2xl text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-2.5">
                        <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                        <div>
                          <strong className="font-extrabold block">Clinical Safety Check Complete</strong>
                          <span className="text-[10px] font-bold uppercase opacity-80">No active drug-drug or drug-allergy warnings detected.</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Prescribed Medications Table */}
                  <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-950 text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                          <th className="p-3">Drug Name</th>
                          <th className="p-3">Dosage</th>
                          <th className="p-3">Frequency</th>
                          <th className="p-3">Duration</th>
                          <th className="p-3 text-center">Refills</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                        {newPrescriptions.map((rx) => (
                          <tr key={rx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/40 font-semibold text-slate-800 dark:text-slate-200">
                            <td className="p-3 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-blue-500" />
                              {rx.name}
                            </td>
                            <td className="p-3 font-mono">{rx.dosage}</td>
                            <td className="p-3">{rx.frequency}</td>
                            <td className="p-3">{rx.duration}</td>
                            <td className="p-3 text-center font-mono">{rx.refills}</td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleRemovePrescription(rx.id)}
                                className="p-1 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}

                        {newPrescriptions.length === 0 && (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-400 dark:text-slate-500 italic">
                              No active prescriptions registered for this session. Add manually or recommended via AI.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Manual Prescription Form row */}
                  <form onSubmit={handleAddManualMed} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-850 space-y-3">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Add Manual Therapeutic Agent</span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <input 
                        type="text" 
                        placeholder="Drug Name (e.g. Sildenafil)"
                        value={manualMedName}
                        onChange={(e) => setManualMedName(e.target.value)}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                      />
                      <input 
                        type="text" 
                        placeholder="Dosage (e.g. 50mg)"
                        value={manualMedDosage}
                        onChange={(e) => setManualMedDosage(e.target.value)}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                      />
                      <input 
                        type="text" 
                        placeholder="Freq (e.g. PRN prior to exertion)"
                        value={manualMedFreq}
                        onChange={(e) => setManualMedFreq(e.target.value)}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" /> Append Agent
                      </button>
                    </div>
                  </form>
                </div>

                {/* 3. MEDICAL DOCUMENTS & CLINICAL TRANSFERS (REFERRAL & SICK LEAVE) */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-5">
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/60 pb-3">
                    <h3 className="text-sm font-black text-slate-950 dark:text-white flex items-center gap-2">
                      <FileSignature className="w-4 h-4 text-indigo-500" /> Certified Clinical Document Drawer
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sick Leave Cert */}
                    <div className="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-850">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Medical Certificate (Sick Leave)</span>
                        <span className="text-[9px] font-bold text-slate-400">Lock-stamped</span>
                      </div>
                      
                      {!medicalCertificate ? (
                        <div className="space-y-3">
                          <p className="text-[11px] text-slate-500">Draft a certified sick leave recommendation stamp based on current clinical findings.</p>
                          <div className="flex gap-2 items-center">
                            <span className="text-[10px] text-slate-400 font-bold">Rest Days:</span>
                            <button 
                              onClick={() => handleGenerateCertificate(3)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-[10px] font-extrabold text-slate-800 dark:text-slate-200"
                            >
                              3 Days
                            </button>
                            <button 
                              onClick={() => handleGenerateCertificate(7)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-[10px] font-extrabold text-slate-800 dark:text-slate-200"
                            >
                              7 Days
                            </button>
                            <button 
                              onClick={() => handleGenerateCertificate(14)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-[10px] font-extrabold text-slate-800 dark:text-slate-200"
                            >
                              14 Days
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-150 dark:border-slate-800 text-[10px] space-y-3 relative overflow-hidden">
                          {/* Mini water stamp */}
                          <div className="absolute right-2 bottom-2 text-indigo-500/10 text-3xl font-black select-none pointer-events-none transform rotate-12">
                            DOCO SEAL
                          </div>
                          <div className="flex justify-between text-slate-400 font-mono">
                            <span>REF: {medicalCertificate.referenceHash}</span>
                            <span>{medicalCertificate.date}</span>
                          </div>
                          <div>
                            <strong className="block text-slate-950 dark:text-white font-extrabold text-xs">CERTIFICATE OF SICKNESS EXEMPTION</strong>
                            <p className="text-slate-600 dark:text-slate-350 mt-1.5 leading-relaxed">
                              This certifies that <strong className="text-slate-900 dark:text-white">{medicalCertificate.patientName}</strong> is medically unfit for functional duties for a duration of <strong className="text-indigo-600 font-black">{medicalCertificate.restDays} continuous days</strong> due to clinical recuperation.
                            </p>
                            <p className="text-slate-400 mt-2 font-semibold">
                              Restrictions: {medicalCertificate.restrictions}
                            </p>
                          </div>
                          <div className="border-t border-slate-100 dark:border-slate-800/60 pt-2 flex justify-between items-center font-mono">
                            <span className="font-extrabold text-slate-850 dark:text-slate-100">{medicalCertificate.signedBy}</span>
                            <span className="text-[9px] text-emerald-500 font-black uppercase">✓ CERTIFIED STAMP</span>
                          </div>

                          <button 
                            onClick={() => setMedicalCertificate(null)}
                            className="text-xs text-rose-500 hover:underline font-bold block pt-1"
                          >
                            Discard Certificate
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Referral Letter */}
                    <div className="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-850">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Specialty Referral Transfer Letter</span>
                        <span className="text-[9px] font-bold text-slate-400">Clinical-Chain</span>
                      </div>

                      {!referralLetter ? (
                        <div className="space-y-3">
                          <p className="text-[11px] text-slate-500">No active referral is drafted. Create a direct specialty dispatch below.</p>
                          <button 
                            onClick={() => {
                              setReferralLetter({
                                specialty: 'Endovascular Interventional Cardiology',
                                reason: `Evaluation of refractory cardiovascular dysautonomia / cardiac telemetry PVC monitoring.`,
                                urgency: 'Urgent',
                                date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                                signedBy: 'Dr. Sarah Chen, MD',
                                referenceHash: `REF-${Math.floor(100000 + Math.random() * 900000)}`
                              });
                            }}
                            className="w-full py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 font-black rounded-xl text-[10px] uppercase tracking-wider transition-all"
                          >
                            Draft Specialty Referral
                          </button>
                        </div>
                      ) : (
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-150 dark:border-slate-800 text-[10px] space-y-3 relative overflow-hidden">
                          <div className="flex justify-between text-slate-400 font-mono">
                            <span>REF: {referralLetter.referenceHash}</span>
                            <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-[9px]">{referralLetter.urgency}</span>
                          </div>
                          <div>
                            <strong className="block text-slate-950 dark:text-white font-extrabold text-xs">CLINICAL REFERRAL TRANSFER</strong>
                            <p className="text-slate-400 mt-0.5 font-bold">To: Dept of {referralLetter.specialty}</p>
                            <p className="text-slate-600 dark:text-slate-350 mt-1.5 leading-relaxed">
                              I am referring our patient, <strong className="text-slate-900 dark:text-white">{activePatient.name} ({activePatient.age} y/o)</strong>, for direct expert evaluation and secondary diagnostic intervention. Reason for dispatch:
                            </p>
                            <p className="text-slate-500 italic mt-1 font-semibold">
                              "{referralLetter.reason}"
                            </p>
                          </div>
                          <div className="border-t border-slate-100 dark:border-slate-800/60 pt-2 flex justify-between items-center font-mono">
                            <span className="font-extrabold text-slate-850 dark:text-slate-100">{referralLetter.signedBy}</span>
                            <span className="text-[9px] text-emerald-500 font-black uppercase">✓ DISPATCH SECURE</span>
                          </div>

                          <button 
                            onClick={() => setReferralLetter(null)}
                            className="text-xs text-rose-500 hover:underline font-bold block pt-1"
                          >
                            Discard Referral
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. CARE STRATEGY & FOLLOW-UP ADVICE */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/60 pb-3">
                    <h3 className="text-sm font-black text-slate-950 dark:text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" /> Patient Care Strategy & Follow-up
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <label htmlFor="ftime" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Recommended Timeline</label>
                      <select 
                        id="ftime"
                        value={followUpTimeframe}
                        onChange={(e) => setFollowUpTimeframe(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
                      >
                        <option value="48 Hours">48 Hours (Urgent Care Watch)</option>
                        <option value="1 Week">1 Week (Short-cycle follow-up)</option>
                        <option value="2 Weeks">2 Weeks (Standard compliance audit)</option>
                        <option value="4 Weeks">4 Weeks (Resting EKG cycle)</option>
                        <option value="3 Months">3 Months (Standard chronic audit)</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <label htmlFor="fnotes" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Therapeutic Lifestyle Directives</label>
                      <textarea 
                        id="fnotes"
                        rows={2}
                        value={followUpNotes}
                        onChange={(e) => setFollowUpNotes(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300 outline-none resize-none leading-relaxed"
                        placeholder="Log instructions for fluid intake, diet parameters, daily symptom monitoring targets..."
                      />
                    </div>
                  </div>
                </div>

                {/* 5. APPROVE & MERGE INTEGRATION BUTTONS */}
                <div className="flex gap-4">
                  <button
                    onClick={handleApproveAndSave}
                    disabled={saveSuccess}
                    className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800/40 text-white font-extrabold uppercase tracking-wider rounded-2xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 select-none"
                  >
                    {saveSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" /> Session Saved & EMR Synchronized!
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4" /> Approve & Save Consultation EMR
                      </>
                    )}
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

    </div>

    {/* Premium Custom Alert / Confirm Modal Dialog */}
    <AnimatePresence>
      {customModalAlert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-950 dark:text-white max-w-md w-full p-6 rounded-3xl shadow-2xl relative space-y-4"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl shrink-0 ${
                customModalAlert.type === 'warning'
                  ? 'bg-amber-500/10 text-amber-500'
                  : customModalAlert.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : 'bg-blue-500/10 text-blue-500'
              }`}>
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {customModalAlert.title}
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 leading-relaxed font-semibold whitespace-pre-line">
                  {customModalAlert.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
              {customModalAlert.onConfirm ? (
                <>
                  <button
                    onClick={() => setCustomModalAlert(null)}
                    className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 text-xs font-bold rounded-xl transition-colors"
                  >
                    {customModalAlert.cancelText || "Cancel"}
                  </button>
                  <button
                    onClick={() => {
                      if (customModalAlert.onConfirm) {
                        customModalAlert.onConfirm();
                      }
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold uppercase tracking-wide rounded-xl transition-colors shadow-md shadow-rose-500/15"
                  >
                    {customModalAlert.confirmText || "Authorize"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setCustomModalAlert(null)}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-bold rounded-xl transition-colors"
                >
                  Okay, understood
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
