import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ta';

export const translations = {
  en: {
    // General / Header / Footer
    appName: "Namma Area",
    home: "Home",
    dashboard: "Dashboard",
    report: "Report",
    announcements: "Announcements",
    polls: "Polls",
    feed: "Complaint Feed",
    bloodDonors: "Blood Donors",
    alerts: "Area Alerts",
    helpers: "Local Helpers",
    marketplace: "Marketplace",
    lostFound: "Lost & Found",
    emergency: "Emergency Contacts",
    profile: "Profile",
    settings: "Settings",
    help: "Help & Support",
    about: "About Namma Area",
    logout: "Logout",
    login: "Login",
    register: "Register",
    
    // Home view
    officialBadge: "Official Civic Platform",
    heroTitle: "Your Area. Your Voice. Your Impact.",
    heroSubtitle: "Report issues, track progress, discover local updates, and help improve your neighborhood through collaborative civic action.",
    reportAnIssue: "Report an Issue",
    exploreCommunity: "Explore Community",
    issuesReported: "Issues Reported",
    issuesResolved: "Issues Resolved",
    activeCitizens: "Active Citizens",
    areasConnected: "Areas Connected",
    recentReports: "Recent Reports",
    realTimeUpdates: "Real-time updates from your area",
    viewAll: "View All",
    quickActions: "Quick Ward Actions",
    lodgeGrievance: "Lodge Grievance",
    viewBroadcasts: "View Broadcasts",
    citizenLeaderboard: "Citizen Leaderboard",
    rankings: "Weekly community contributions rankings",
    
    // Dashboard / Profile
    yourCitizenScore: "Your Citizen Score",
    civicLevel: "Civic Level",
    resolvedIssues: "Resolved Issues",
    contributorPoints: "Contributor Points",
    recentActivity: "Recent Activity",
    noActivity: "No recent activity yet.",
    viewMyComplaints: "View My Complaints",
    citizenRank: "Citizen Rank",
    
    // Create Complaint Form
    reportNewIssue: "Report New Issue",
    issueTitle: "Issue Title",
    issueTitlePlaceholder: "e.g., Street Light not working",
    category: "Category",
    location: "Location",
    locationPlaceholder: "e.g., Indiranagar 5th Cross",
    description: "Detailed Description",
    descriptionPlaceholder: "Describe the issue and how it affects the community...",
    uploadImage: "Upload Evidence Image",
    submitReport: "Submit Grievance",
    submitting: "Submitting...",
    selectCategory: "Select a Category",
    successTitle: "Report Logged Successfully!",
    successMessage: "Our automated system has assigned this to the BBMP Ward 4 Engineer. You will receive progress updates.",
    
    // Details
    upvote: "Upvote",
    upvotes: "Upvotes",
    comments: "Comments",
    addComment: "Add a comment...",
    postComment: "Post Comment",
    noComments: "No comments yet. Start the conversation!",
    status: "Status",
    pending: "Pending",
    inProgress: "In Progress",
    resolved: "Resolved",
    assignedTo: "Assigned To",
    assignedOfficer: "Ward Officer Ramesh",
    
    // Settings
    chooseLanguage: "Choose Language / மொழி தேர்வு",
    languageDesc: "Select your preferred language for receiving ward broadcasts and raising grievance complaints.",
    wardNotifications: "Ward Notifications",
    emergencyAlerts: "Emergency Alert Broadcasts",
    emergencyAlertsDesc: "Immediate push updates for fire or flood threats",
    myGrievanceUpdates: "My Grievance Updates",
    myGrievanceUpdatesDesc: "Track BBMP engineer comments and resolution status",
    newCommunityPolls: "New Community Poll Alerts",
    newCommunityPollsDesc: "Receive invitations when new ward voting goes live",
    contactInfo: "Contact Info & Phone",
    contactInfoDesc: "Used for authenticating local job requests, lost-found rewards, and matching blood donor groups.",
    saveChange: "Save Change",
    savedSuccessfully: "Settings saved successfully!",
    verifiedShield: "Verified Citizen Shield",
    verifiedShieldDesc: "Your profile and activities are monitored under Ward 4 Community Guidelines. Zero spam policy strictly enforced.",
    
    // Help / Support
    frequentlyAsked: "Frequently Asked Questions",
    howToReport: "How do I report a pothole?",
    howToReportAns: "Tap 'Report an Issue' from the Home screen, choose 'Roads' category, add photos and your location, and tap submit.",
    howLongToResolve: "How long does resolution take?",
    howLongToResolveAns: "Emergency safety issues are processed in 24 hours. General sanitation or lighting complaints are solved by ward engineers within 3-5 working days.",
    howDoesScoreWork: "How does the Citizen Score work?",
    howDoesScoreWorkAns: "You earn points for raising verified complaints, upvoting genuine neighborhood issues, participating in community polls, and volunteering.",
    contactSupport: "Still need help?",
    contactSupportDesc: "Chat with our local community coordinator or ward helpdesk.",
    callHelpdesk: "Call Ward Helpdesk",
    
    // Alerts / Announcements
    areaAlerts: "Area Alerts",
    criticalBroadcasts: "Critical Broadcasts & Warnings",
    activeAlerts: "Active Emergency Alerts",
    activeAlertsDesc: "Stay updated on essential neighborhood notifications.",
    announcementsTitle: "Civic Announcements",
    announcementsDesc: "Stay updated with official municipal news and community drives",
    actionRequired: "Action Required",
    learnMore: "Learn More",
    
    // Polls
    activePolls: "Active Community Polls",
    activePollsDesc: "Your vote directly shapes ward budgeting and civic planning.",
    totalVotes: "Total Votes",
    voteNow: "Vote Now",
    voted: "Voted",
    endsOn: "Ends on",
    
    // Blood Donors
    bloodDonorsTitle: "Community Blood Donors",
    bloodDonorsDesc: "Urgent local network matching for blood groups in medical emergencies.",
    registerAsDonor: "Register as Donor",
    availableDonors: "Available Local Donors",
    contactDonor: "Contact Donor",
    donorAdded: "You are now registered as an active blood donor!",
    
    // Helpers
    localHelpersTitle: "Verified Local Helpers",
    localHelpersDesc: "Hire skilled handymen and helpers from our neighborhood community.",
    postHelperJob: "Request a Helper / Post Job",
    availableHelpers: "Community Helpers Directory",
    callHelper: "Call Helper",
    jobAdded: "Job vacancy posted to local community board!",
    
    // Marketplace
    marketplaceTitle: "Neighborhood Marketplace",
    marketplaceDesc: "Buy and sell used items or offer local services directly within your area.",
    postListing: "Sell an Item / List Service",
    activeListings: "Active Neighborhood Listings",
    contactSeller: "Contact Lister",
    listingAdded: "Your listing was posted successfully!",
    
    // Lost & Found
    lostFoundTitle: "Lost & Found Locker",
    lostFoundDesc: "Reunite lost belongings with their rightful owners in the neighborhood.",
    reportItem: "Report Lost/Found Item",
    recentItems: "Recent Items Reported",
    contactClaim: "Contact to Claim",
    itemAdded: "Item logged on the local locker board!",
    
    // Emergency
    emergencyContactsTitle: "Emergency Helplines",
    emergencyContactsDesc: "Instant call access to official ward officers, ambulances, and police dispatch.",
    callNow: "Call Now",
    
    // General UI
    back: "Back",
    cancel: "Cancel",
    save: "Save",
    required: "Required",
    all: "All",
    search: "Search...",
  },
  ta: {
    // General / Header / Footer
    appName: "நம்ம பகுதி",
    home: "முகப்பு",
    dashboard: "தகவல்தளம்",
    report: "புகார் செய்க",
    announcements: "அறிவிப்புகள்",
    polls: "கருத்துக் கணிப்புகள்",
    feed: "புகார் ஊட்டம்",
    bloodDonors: "இரத்தக் கொடையாளர்கள்",
    alerts: "பகுதி எச்சரிக்கைகள்",
    helpers: "உள்ளூர் உதவியாளர்கள்",
    marketplace: "சந்தை",
    lostFound: "தொலைந்தவை & கிடைத்தவை",
    emergency: "அவசர தொடர்புகள்",
    profile: "சுயவிவரம்",
    settings: "அமைப்புகள்",
    help: "உதவி & ஆதரவு",
    about: "நம்ம பகுதி பற்றி",
    logout: "வெளியேறு",
    login: "உள்நுழை",
    register: "பதிவு செய்க",
    
    // Home view
    officialBadge: "அதிகாரப்பூர்வ குடிமக்கள் தளம்",
    heroTitle: "உங்கள் பகுதி. உங்கள் குரல். உங்கள் தாக்கம்.",
    heroSubtitle: "பிரச்சினைகளைப் புகாரளிக்கவும், முன்னேற்றத்தைக் கண்காணிக்கவும், உள்ளூர் அறிவிப்புகளைக் கண்டறியவும், கூட்டு குடிமக்கள் நடவடிக்கை மூலம் உங்கள் அக்கம் பக்கத்தை மேம்படுத்தவும்.",
    reportAnIssue: "ஒரு பிரச்சினையைப் புகாரளிக்கவும்",
    exploreCommunity: "சமூகத்தை ஆராயுங்கள்",
    issuesReported: "புகாரளிக்கப்பட்ட பிரச்சினைகள்",
    issuesResolved: "தீர்க்கப்பட்ட பிரச்சினைகள்",
    activeCitizens: "செயலில் உள்ள குடிமக்கள்",
    areasConnected: "இணைக்கப்பட்ட பகுதிகள்",
    recentReports: "சமீபத்திய புகார்கள்",
    realTimeUpdates: "உங்கள் பகுதியில் இருந்து நேரடி அறிவிப்புகள்",
    viewAll: "அனைத்தையும் காட்டு",
    quickActions: "விரைவான வார்டு செயல்கள்",
    lodgeGrievance: "புகாரைப் பதிவு செய்க",
    viewBroadcasts: "ஒளிபரப்புகளைப் பார்க்கவும்",
    citizenLeaderboard: "குடிமக்கள் முன்னணிப் பட்டியல்",
    rankings: "வாராந்திர சமூக பங்களிப்பு தரவரிசைகள்",
    
    // Dashboard / Profile
    yourCitizenScore: "உங்கள் குடிமகன் மதிப்பெண்",
    civicLevel: "குடிமை நிலை",
    resolvedIssues: "தீர்க்கப்பட்ட பிரச்சினைகள்",
    contributorPoints: "பங்களிப்பாளர் புள்ளிகள்",
    recentActivity: "சமீபத்திய நடவடிக்கை",
    noActivity: "சமீபத்திய நடவடிக்கைகள் எதுவும் இல்லை.",
    viewMyComplaints: "எனது புகார்களைப் பார்க்கவும்",
    citizenRank: "குடிமகன் தரவரிசை",
    
    // Create Complaint Form
    reportNewIssue: "புதிய பிரச்சினையைப் புகாரளிக்கவும்",
    issueTitle: "பிரச்சினை தலைப்பு",
    issueTitlePlaceholder: "உதாரணமாக, தெரு விளக்கு எரியவில்லை",
    category: "வகை",
    location: "இருப்பிடம்",
    locationPlaceholder: "உதாரணமாக, இந்திராநகர் 5வது குறுக்குத் தெரு",
    description: "விரிவான விளக்கம்",
    descriptionPlaceholder: "பிரச்சினையையும் அது சமூகத்தை எவ்வாறு பாதிக்கிறது என்பதையும் விவரிக்கவும்...",
    uploadImage: "ஆதாரப் படத்தை பதிவேற்றவும்",
    submitReport: "புகாரைச் சமர்ப்பிக்கவும்",
    submitting: "சமர்ப்பிக்கப்படுகிறது...",
    selectCategory: "ஒரு வகையைத் தேர்ந்தெடுக்கவும்",
    successTitle: "புகார் வெற்றிகரமாகப் பதிவு செய்யப்பட்டது!",
    successMessage: "எங்கள் தானியங்கி அமைப்பு இதனை BBMP வார்டு 4 பொறியாளருக்கு ஒதுக்கியுள்ளது. முன்னேற்ற அறிவிப்புகளைப் பெறுவீர்கள்.",
    
    // Details
    upvote: "ஆதரவு வாக்கு",
    upvotes: "ஆதரவு வாக்குகள்",
    comments: "கருத்துகள்",
    addComment: "ஒரு கருத்தைச் சேர்க்கவும்...",
    postComment: "கருத்தைப் பதிவு செய்க",
    noComments: "இன்னும் கருத்துகள் இல்லை. உரையாடலைத் தொடங்குங்கள்!",
    status: "நிலை",
    pending: "நிலுவையில் உள்ளது",
    inProgress: "செயல்பாட்டில் உள்ளது",
    resolved: "தீர்க்கப்பட்டது",
    assignedTo: "ஒதுக்கப்பட்டவர்",
    assignedOfficer: "வார்டு அதிகாரி ரமேஷ்",
    
    // Settings
    chooseLanguage: "Choose Language / மொழி தேர்வு",
    languageDesc: "வார்டு அறிவிப்புகளைப் பெறுவதற்கும், புகார்களை எழுப்புவதற்கும் உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்.",
    wardNotifications: "வார்டு அறிவிப்புகள்",
    emergencyAlerts: "அவசர எச்சரிக்கை அறிவிப்புகள்",
    emergencyAlertsDesc: "தீ அல்லது வெள்ள அபாயங்களுக்கான உடனடி அறிவிப்புகள்",
    myGrievanceUpdates: "எனது புகார் அறிவிப்புகள்",
    myGrievanceUpdatesDesc: "BBMP பொறியாளர் கருத்துகள் மற்றும் தீர்வு நிலையைக் கண்காணிக்கவும்",
    newCommunityPolls: "புதிய சமூகக் கருத்துக்கணிப்பு எச்சரிக்கைகள்",
    newCommunityPollsDesc: "புதிய வார்டு வாக்கெடுப்பு தொடங்கும்போது அறிவிப்புகளைப் பெறவும்",
    contactInfo: "தொடர்புத் தகவல் & தொலைபேசி",
    contactInfoDesc: "உள்ளூர் வேலைக் கோரிக்கைகள், தொலைந்த பொருட்களைக் கண்டுபிடிப்பது மற்றும் இரத்தக் கொடையாளர்களைப் பொருத்துவதற்குப் பயன்படுத்தப்படுகிறது.",
    saveChange: "மாற்றத்தைச் சேமிக்கவும்",
    savedSuccessfully: "அமைப்புகள் வெற்றிகரமாகச் சேமிக்கப்பட்டன!",
    verifiedShield: "சரிபார்க்கப்பட்ட குடிமகன் பாதுகாப்பு",
    verifiedShieldDesc: "வார்டு 4 சமூக வழிகாட்டுதலின் கீழ் உங்கள் சுயவிவரம் மற்றும் செயல்பாடுகள் கண்காணிக்கப்படுகின்றன. தேவையற்ற பதிவுகள் முற்றிலும் தடைசெய்யப்பட்டுள்ளன.",
    
    // Help / Support
    frequentlyAsked: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
    howToReport: "சாலையில் உள்ள பள்ளத்தைப் புகாரளிப்பது எப்படி?",
    howToReportAns: "முகப்புத் திரையில் இருந்து 'ஒரு பிரச்சினையைப் புகாரளிக்கவும்' என்பதைத் தட்டவும், 'சாலைகள்' வகையைத் தேர்ந்தெடுத்து, புகைப்படங்கள் மற்றும் உங்கள் இருப்பிடத்தைச் சேர்த்து, சமர்ப்பிக்கவும்.",
    howLongToResolve: "தீர்வு காண எவ்வளவு காலம் ஆகும்?",
    howLongToResolveAns: "அவசரப் பாதுகாப்புப் பிரச்சினைகள் 24 மணி நேரத்திற்குள் தீர்க்கப்படும். பொதுவான சுகாதாரம் அல்லது விளக்கு புகார்கள் வார்டு பொறியாளர்களால் 3-5 வேலை நாட்களுக்குள் தீர்க்கப்படும்.",
    howDoesScoreWork: "குடிமகன் மதிப்பெண் எவ்வாறு செயல்படுகிறது?",
    howDoesScoreWorkAns: "உண்மையான புகார்களை எழுப்புதல், உண்மையான அக்கம் பக்கப் பிரச்சினைகளுக்கு ஆதரவளித்தல், சமூகக் கருத்துக்கணிப்புகளில் பங்கேற்பது மற்றும் தன்னார்வத் தொண்டு செய்தல் ஆகியவற்றிற்குப் புள்ளிகளைப் பெறுவீர்கள்.",
    contactSupport: "இன்னும் உதவி தேவையா?",
    contactSupportDesc: "எங்கள் உள்ளூர் சமூக ஒருங்கிணைப்பாளர் அல்லது வார்டு உதவி மையத்துடன் அரட்டையடிக்கவும்.",
    callHelpdesk: "வார்டு உதவி மையத்தை அழைக்கவும்",
    
    // Alerts / Announcements
    areaAlerts: "பகுதி எச்சரிக்கைகள்",
    criticalBroadcasts: "முக்கிய அறிவிப்புகள் & எச்சரிக்கைகள்",
    activeAlerts: "செயலில் உள்ள அவசர எச்சரிக்கைகள்",
    activeAlertsDesc: "அத்தியாவசிய அக்கம் பக்கத்து அறிவிப்புகள் குறித்து புதுப்பித்த நிலையில் இருங்கள்.",
    announcementsTitle: "குடிமை அறிவிப்புகள்",
    announcementsDesc: "அதிகாரப்பூர்வ நகராட்சி செய்திகள் மற்றும் சமூக விழிப்புணர்வுப் பேரணிகள் குறித்து புதுப்பித்த நிலையில் இருங்கள்",
    actionRequired: "தேவைப்படும் நடவடிக்கை",
    learnMore: "மேலும் அறிய",
    
    // Polls
    activePolls: "செயலில் உள்ள சமூகக் கருத்துக்கணிப்புகள்",
    activePollsDesc: "உங்கள் வாக்கு வார்டு வரவு செலவுத் திட்டம் மற்றும் குடிமைத் திட்டமிடலை நேரடியாக வடிவமைக்கிறது.",
    totalVotes: "மொத்த வாக்குகள்",
    voteNow: "இப்போது வாக்களிக்கவும்",
    voted: "வாக்களிக்கப்பட்டது",
    endsOn: "முடிவடையும் நாள்",
    
    // Blood Donors
    bloodDonorsTitle: "சமூக இரத்தக் கொடையாளர்கள்",
    bloodDonorsDesc: "மருத்துவ அவசரநிலைகளில் இரத்தப் பிரிவுகளுக்கான உள்ளூர் அவசரக் கொடையாளர் பொருத்தம்.",
    registerAsDonor: "கொடையாளராகப் பதிவு செய்க",
    availableDonors: "கிடைக்கக்கூடிய உள்ளூர் கொடையாளர்கள்",
    contactDonor: "கொடையாளரைத் தொடர்பு கொள்ளவும்",
    donorAdded: "நீங்கள் இப்போது செயலில் உள்ள இரத்தக் கொடையாளராகப் பதிவு செய்யப்பட்டுள்ளீர்கள்!",
    
    // Helpers
    localHelpersTitle: "சரிபார்க்கப்பட்ட உள்ளூர் உதவியாளர்கள்",
    localHelpersDesc: "எங்கள் அக்கம் பக்கத்து சமூகத்திலிருந்து திறமையான கைவினைஞர்கள் மற்றும் உதவியாளர்களைப் பணியமர்த்தவும்.",
    postHelperJob: "உதவியாளரைக் கோரவும் / பணியைப் பகிரவும்",
    availableHelpers: "சமூக உதவியாளர்கள் அடைவு",
    callHelper: "உதவியாளரை அழைக்கவும்",
    jobAdded: "வேலை வாய்ப்பு உள்ளூர் சமூகப் பலகையில் பகிரப்பட்டது!",
    
    // Marketplace
    marketplaceTitle: "அக்கம் பக்கத்துச் சந்தை",
    marketplaceDesc: "பயன்படுத்தப்பட்ட பொருட்களை வாங்கவும் விற்கவும் அல்லது உங்கள் பகுதியில் உள்ளூர் சேவைகளை வழங்கவும்.",
    postListing: "ஒரு பொருளை விற்க / சேவையைப் பட்டியலிட",
    activeListings: "செயலில் உள்ள உள்ளூர் பட்டியல்கள்",
    contactSeller: "பட்டியலிட்டவரைத் தொடர்பு கொள்ளவும்",
    listingAdded: "உங்கள் பட்டியல் வெற்றிகரமாகப் பகிரப்பட்டது!",
    
    // Lost & Found
    lostFoundTitle: "தொலைந்தவை & கிடைத்தவை பெட்டகம்",
    lostFoundDesc: "தொலைந்த உடமைகளை அக்கம் பக்கத்தில் உள்ள அவற்றின் உரிமையாளர்களுடன் மீண்டும் இணைக்கவும்.",
    reportItem: "தொலைந்த/கிடைத்த பொருளைப் புகாரளிக்கவும்",
    recentItems: "புகாரளிக்கப்பட்ட சமீபத்திய பொருட்கள்",
    contactClaim: "உரிமைகோர தொடர்பு கொள்ளவும்",
    itemAdded: "பொருள் உள்ளூர் பெட்டகப் பலகையில் பதிவு செய்யப்பட்டது!",
    
    // Emergency
    emergencyContactsTitle: "அவசர உதவி எண்கள்",
    emergencyContactsDesc: "அதிகாரப்பூர்வ வார்டு அதிகாரிகள், ஆம்புலன்ஸ்கள் மற்றும் காவல்துறை கட்டுப்பாட்டு அறைக்கு உடனடி அழைப்பு வசதி.",
    callNow: "இப்போது அழைக்கவும்",
    
    // General UI
    back: "பின்னால்",
    cancel: "ரத்து செய்",
    save: "சேமி",
    required: "தேவை",
    all: "அனைத்தும்",
    search: "தேடுக...",
  }
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('namma_language');
    return (saved === 'ta' ? 'ta' : 'en') as Language;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('namma_language', lang);
  };

  const t = (key: keyof typeof translations.en): string => {
    const translationSet = translations[language] || translations.en;
    return translationSet[key] || translations.en[key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
