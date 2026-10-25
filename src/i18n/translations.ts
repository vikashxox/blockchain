export type Language = 'en' | 'hi';

export interface TranslationDictionary {
  portalTitle: string;
  portalSubtitle: string;
  tagline: string;
  disclaimerBanner: string;
  nav: {
    home: string;
    register: string;
    voterLogin: string;
    booth: string;
    verify: string;
    explorer: string;
    results: string;
    roadmap: string;
    admin: string;
  };
  actions: {
    registerCardTitle: string;
    registerCardDesc: string;
    voterLoginTitle: string;
    voterLoginDesc: string;
    verifyTitle: string;
    verifyDesc: string;
    explorerTitle: string;
    explorerDesc: string;
    castVote: string;
    submit: string;
    back: string;
    next: string;
    approve: string;
    reject: string;
    resetDemo: string;
    seedVoters: string;
    tamperTest: string;
    restoreChain: string;
    verifyMyVote: string;
    downloadReceipt: string;
    print: string;
  };
  phases: {
    REGISTRATION: string;
    VOTING: string;
    COUNTING: string;
    RESULTS_DECLARED: string;
  };
  stats: {
    registeredVoters: string;
    votesCast: string;
    blocksMined: string;
    turnout: string;
    chainIntegrity: string;
  };
  footer: {
    helpline: string;
    accessibility: string;
    terms: string;
    privacy: string;
    disclaimer: string;
    copyright: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    portalTitle: 'PRAVASI MATDAN',
    portalSubtitle: 'Overseas E-Voting Blockchain Portal',
    tagline: 'Cryptographically Verifiable Remote Democratic Voting for Non-Resident Indians',
    disclaimerBanner: 'Demonstration prototype - not an official election portal. All data is simulated.',
    nav: {
      home: 'Home',
      register: 'Register as NRI Voter',
      voterLogin: 'Voter Portal',
      booth: 'Voting Booth',
      verify: 'Verify Vote',
      explorer: 'Blockchain Explorer',
      results: 'Election Results',
      roadmap: 'Roadmap & Specs',
      admin: 'Election Officer',
    },
    actions: {
      registerCardTitle: 'Register as Overseas Voter',
      registerCardDesc: 'Submit passport credentials, biometrics & constituency details for on-chain registration.',
      voterLoginTitle: 'Voter Login & Booth',
      voterLoginDesc: 'Access your electronic ballot using your voter ID, OTP or private key file.',
      verifyTitle: 'Verify My Vote',
      verifyDesc: 'Verify inclusion in the blockchain ledger using your cryptographic receipt hash.',
      explorerTitle: 'Public Blockchain Explorer',
      explorerDesc: 'Inspect live blocks, transaction proofs, PoA validator nodes and chain integrity.',
      castVote: 'Cast Your Secret Vote',
      submit: 'Submit Application',
      back: 'Back',
      next: 'Next Step',
      approve: 'Approve & Issue Keys',
      reject: 'Reject Application',
      resetDemo: 'Reset Demo Data',
      seedVoters: 'Seed 20 Demo Voters',
      tamperTest: 'Run Tamper Test',
      restoreChain: 'Restore Valid Chain',
      verifyMyVote: 'Verify Receipt On-Chain',
      downloadReceipt: 'Download Official Receipt',
      print: 'Print Acknowledgement',
    },
    phases: {
      REGISTRATION: 'Voter Registration Open',
      VOTING: 'Live Voting Phase Active',
      COUNTING: 'Ballot Decryption & Counting',
      RESULTS_DECLARED: 'Official Results Declared',
    },
    stats: {
      registeredVoters: 'Registered NRI Voters',
      votesCast: 'Votes Cast On-Chain',
      blocksMined: 'Blocks Confirmed',
      turnout: 'Voter Turnout',
      chainIntegrity: 'Chain Ledger Status',
    },
    footer: {
      helpline: 'Toll-Free NRI Helpline: +91-11-2305-DEMO',
      accessibility: 'Accessibility Statement',
      terms: 'Terms of Use',
      privacy: 'Cryptographic Privacy Guarantee',
      disclaimer: 'Prototype Disclaimer',
      copyright: '© 2026 Pravasi Matdan Sovereign NRI Remote Voting System. All simulated rights reserved.',
    },
  },
  hi: {
    portalTitle: 'प्रवासी मतदान',
    portalSubtitle: 'अनिवासी भारतीय ई-मतदान ब्लॉकचेन पोर्टल',
    tagline: 'अनिवासी भारतीयों के लिए सुरक्षित, गोपनीय एवं क्रिप्टोग्राफ़िक रूप से सत्यापन योग्य रिमोट मतदान',
    disclaimerBanner: 'प्रदर्शन प्रोटोटाइप - यह कोई आधिकारिक निर्वाचन पोर्टल नहीं है। सभी डेटा काल्पनिक है।',
    nav: {
      home: 'मुखपृष्ठ',
      register: 'प्रवासी मतदाता पंजीकरण',
      voterLogin: 'मतदाता पोर्टल',
      booth: 'मतदान कक्ष',
      verify: 'मत सत्यापन',
      explorer: 'ब्लॉकचेन एक्सप्लोरर',
      results: 'निर्वाचन परिणाम',
      roadmap: 'रोडमैप व सीमाएं',
      admin: 'निर्वाचन अधिकारी',
    },
    actions: {
      registerCardTitle: 'प्रवासी मतदाता पंजीकरण',
      registerCardDesc: 'पासपोर्ट विवरण, बायोमेट्रिक व निर्वाचन क्षेत्र विवरण भरकर ऑन-चेन पंजीकरण करें।',
      voterLoginTitle: 'मतदाता लॉगिन व कक्ष',
      voterLoginDesc: 'मतदाता पहचान, ओटीपी अथवा अपनी निजी कुंजी फ़ाइल से ई-बैलेट पर मतदान करें।',
      verifyTitle: 'अपने मत का सत्यापन करें',
      verifyDesc: 'अपने रसीद हैश से ब्लॉकचेन बहीखाते में अपने मत के समावेश की पुष्टि करें।',
      explorerTitle: 'सार्वजनिक ब्लॉकचेन एक्सप्लोरर',
      explorerDesc: 'सजीव ब्लॉक, लेन-देन प्रमाण, वैलिडेटर नोड्स और ब्लॉकचेन सत्यनिष्ठा की जांच करें।',
      castVote: 'अपना गुप्त मत दर्ज करें',
      submit: 'आवेदन जमा करें',
      back: 'पीछे जाएं',
      next: 'अगला चरण',
      approve: 'स्वीकृत करें व कुंजी जारी करें',
      reject: 'आवेदन अस्वीकार करें',
      resetDemo: 'डेमो डेटा रीसेट करें',
      seedVoters: '20 डेमो मतदाता जोड़ें',
      tamperTest: 'छेड़छाड़ परीक्षण चलाएं',
      restoreChain: 'प्रामाणिक श्रृंखला पुनर्स्थापित करें',
      verifyMyVote: 'रसीद ऑन-चेन सत्यापित करें',
      downloadReceipt: 'आधिकारिक रसीद डाउनलोड करें',
      print: 'पावती प्रिंट करें',
    },
    phases: {
      REGISTRATION: 'मतदाता पंजीकरण जारी',
      VOTING: 'लाइव मतदान चरण सक्रिय',
      COUNTING: 'मतपत्र डिक्रिप्शन व मतगणना',
      RESULTS_DECLARED: 'आधिकारिक परिणाम घोषित',
    },
    stats: {
      registeredVoters: 'पंजीकृत प्रवासी मतदाता',
      votesCast: 'दर्ज कुल मत',
      blocksMined: 'पुष्टि किए गए ब्लॉक',
      turnout: 'मतदान प्रतिशत',
      chainIntegrity: 'ब्लॉकचेन स्थिति',
    },
    footer: {
      helpline: 'अनिवासी भारतीय हेल्पलाइन: +91-11-2305-DEMO',
      accessibility: 'सुगम्यता वक्तव्य',
      terms: 'उपयोग की शर्तें',
      privacy: 'क्रिप्टोग्राफ़िक गोपनीयता नीति',
      disclaimer: 'प्रोटोटाइप अस्वीकरण',
      copyright: '© 2026 प्रवासी मतदान अनिवासी भारतीय रिमोट वोटिंग सिस्टम। सर्वाधिकार सुरक्षित।',
    },
  },
};
