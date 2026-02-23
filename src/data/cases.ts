export interface Clue {
  id: string;
  name: string;
  description: string;
  location: string;
  reliability: 'High' | 'Medium' | 'Low';
  connections: string[];
  visibleTo: 'all' | 'player1' | 'player2';
  /** Icon type for the clue card illustration */
  icon: 'knife' | 'document' | 'phone' | 'key' | 'bottle' | 'footprint' | 'camera' | 'bag' | 'gun' | 'blood' | 'note' | 'wire' | 'glass' | 'lighter' | 'vial' | 'photo' | 'usb' | 'tire' | 'frame' | 'rope' | 'receipt' | 'watch' | 'jewelry' | 'pill' | 'laptop';
}

export interface SuspectAvatar {
  /** Stable randomuser.me portrait URL */
  photoUrl: string;
}

export interface Suspect {
  id: string;
  name: string;
  age: number;
  occupation: string;
  profile: string;
  alibi: string;
  relationships: string;
  unlocked: boolean;
  unlockedByClues: string[];
  responses: Record<string, string>;
  avatar: SuspectAvatar;
}

export interface CaseData {
  id: string;
  title: string;
  briefing: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  setting: string;
  timeline: { time: string; event: string }[];
  locations: string[];
  clues: Clue[];
  suspects: Suspect[];
  trueCulpritId: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// CASE 1  ·  The Isabella Heist  (Medium)
// ─────────────────────────────────────────────────────────────────────────────
const case1: CaseData = {
  id: 'c1',
  title: 'The Isabella Heist',
  setting: 'Hargrove City Museum of Art',
  briefing: 'Priceless art pieces vanished from the Hargrove City Museum during a precision power outage last night. Security footage was wiped clean. The director insists it was an inside job — the alarm codes were changed just hours before the theft.',
  difficulty: 'Medium',
  timeline: [
    { time: '10:00 PM', event: 'Museum closes to the public' },
    { time: '11:45 PM', event: 'Precision power outage hits the block' },
    { time: '12:10 AM', event: 'Alarm system reboots in degraded mode' },
    { time: '1:15 AM', event: 'Power restored; three paintings reported missing' },
  ],
  locations: ['Gallery A', 'Security Room', 'Loading Dock', 'Director\'s Office'],
  clues: [
    { id: 'c1_cl1', name: 'Shattered Frame', description: 'The ornate frame of the missing Isabelle portrait lies shattered across the floor. No blood found on the glass shards — whoever did this was wearing gloves.', location: 'Gallery A', reliability: 'High', connections: ['c1_cl2'], visibleTo: 'all', icon: 'frame' },
    { id: 'c1_cl2', name: 'Fiber Optic Cable', description: 'A freshly severed fiber-optic security cable, cut with professional precision. A regular thief would have used brute force — this required specialist knowledge of the museum\'s layout.', location: 'Security Room', reliability: 'High', connections: ['c1_cl1'], visibleTo: 'player1', icon: 'wire' },
    { id: 'c1_cl3', name: 'Muddy Tire Tracks', description: 'Deep impressions from a heavy-duty commercial van leading away from the dock. The tread pattern matches a Falcon Transit — a model used by only two local companies.', location: 'Loading Dock', reliability: 'Medium', connections: [], visibleTo: 'player2', icon: 'tire' },
    { id: 'c1_cl4', name: 'Burned Memo', description: 'A half-burned memo regarding a "private acquisition" for an unnamed overseas buyer. The letterhead matches museum stationery, and the price listed is eight figures.', location: 'Director\'s Office', reliability: 'High', connections: [], visibleTo: 'all', icon: 'document' },
  ],
  suspects: [
    {
      id: 'c1_s1', name: 'Director Vance', age: 58, occupation: 'Museum Director',
      profile: 'The museum\'s director of 22 years. Publicly respected, but privately rumored to be hemorrhaging money on failed real-estate ventures.',
      alibi: 'I was at the Meridian Foundation fundraising gala downtown until 2 AM. The host can confirm.',
      relationships: 'Has cultivated discreet relationships with several offshore art brokers over the past decade.',
      unlocked: true, unlockedByClues: [],
      responses: { 'c1_cl4': 'That memo is completely taken out of context. A crazy billionaire was making unsolicited acquisition offers we formally rejected. My assistant can pull the response letters.' },
      avatar: { photoUrl: 'https://randomuser.me/api/portraits/men/52.jpg' }
    },
    {
      id: 'c1_s2', name: 'Marcus Renn', age: 44, occupation: 'Head of Security',
      profile: 'Ex-military, decorated. Installed the museum\'s entire current alarm infrastructure himself. Meticulous and private — few people know much about his life outside work.',
      alibi: 'I was in the basement checking the secondary breaker when the power went. Standard protocol.',
      relationships: 'Has had escalating budget disputes with Vance for the past year, culminating in a public argument last week.',
      unlocked: false, unlockedByClues: ['c1_cl2'],
      responses: { 'c1_cl2': 'Anyone with a wire cutter and a wiring diagram can do that. Having the knowledge doesn\'t make me the thief.' },
      avatar: { photoUrl: 'https://randomuser.me/api/portraits/men/7.jpg' }
    },
    {
      id: 'c1_s3', name: 'Leo Bastian', age: 31, occupation: 'Contract Transporter',
      profile: 'Local delivery driver contracted by the museum for moving oversized pieces. Fired last week for an undisclosed "incident."',
      alibi: 'I was drinking at the Rusty Anchor bar all night. Ask the bartender.',
      relationships: 'Was let go after a heated confrontation with Renn. Filed a wrongful termination complaint the same day.',
      unlocked: false, unlockedByClues: ['c1_cl3'],
      responses: { 'c1_cl3': 'My van was stolen two nights ago. I reported it to the 4th precinct. The case number is right there in my phone.' },
      avatar: { photoUrl: 'https://randomuser.me/api/portraits/men/23.jpg' }
    },
  ],
  trueCulpritId: 'c1_s2',
};

// ─────────────────────────────────────────────────────────────────────────────
// CASE 2  ·  The Cipher Echo  (Hard)
// ─────────────────────────────────────────────────────────────────────────────
const case2: CaseData = {
  id: 'c2',
  title: 'The Cipher Echo',
  setting: 'Apartment 4F, Delancey Street',
  briefing: 'Investigative journalist Nora Vass was found dead in her apartment with cryptic symbols carved into the wall above her desk. She had been working a cold-case series about an unsolved murder from 1987 — a case with identical markings.',
  difficulty: 'Hard',
  timeline: [
    { time: '6:00 PM', event: 'Victim seen arguing on her phone outside the building' },
    { time: '8:30 PM', event: 'Neighbor reports hearing a loud thud from above' },
    { time: '9:15 PM', event: 'Lights in the apartment go out' },
    { time: 'Next 9:00 AM', event: 'Body discovered by the landlord during a routine check' },
  ],
  locations: ['Living Room', 'Bedroom', 'Fire Escape', 'Victim\'s PC'],
  clues: [
    { id: 'c2_cl1', name: 'Symbol Photograph', description: 'A faded polaroid tucked inside a manila envelope — the same cryptic symbols carved at a 1987 murder scene. Someone left this here intentionally.', location: 'Living Room', reliability: 'High', connections: ['c2_cl3'], visibleTo: 'all', icon: 'photo' },
    { id: 'c2_cl2', name: 'Burner Phone', description: 'A prepaid burner phone hidden under the mattress. It shows a single outgoing call at 5:47 PM to an untraceable number. The last text reads: "I know who you are. Meet me tonight."', location: 'Bedroom', reliability: 'High', connections: [], visibleTo: 'player1', icon: 'phone' },
    { id: 'c2_cl3', name: 'Encrypted USB', description: 'A heavily encrypted flash drive taped underneath the desk. The accessible folder contains draft articles about a "highly decorated copycat" with ties to the original investigation.', location: 'Victim\'s PC', reliability: 'Medium', connections: ['c2_cl1'], visibleTo: 'player2', icon: 'usb' },
    { id: 'c2_cl4', name: 'Scratched Silver Lighter', description: 'A vintage engraved silver lighter found on the fire escape window sill. The engraving reads a set of initials: "R.H." — the same initials as someone who worked the 1987 case.', location: 'Fire Escape', reliability: 'High', connections: [], visibleTo: 'all', icon: 'lighter' },
  ],
  suspects: [
    {
      id: 'c2_s1', name: 'Det. Richard Harris', age: 67, occupation: 'Retired Detective',
      profile: 'Lead investigator on the original 1987 cold case. Highly decorated. Has been very cooperative with the victim\'s research — perhaps too cooperative.',
      alibi: 'I was home watching the late-night game. I\'m too old to be climbing fire escapes.',
      relationships: 'Supplied the victim with restricted case files from personal archives. The department never authorized this.',
      unlocked: true, unlockedByClues: [],
      responses: {
        'c2_cl1': 'She stole that photograph from my personal archive. I told her to let it go — some cases are closed for a reason.',
        'c2_cl4': 'I haven\'t owned a lighter in twenty years. I quit smoking after my bypass.'
      },
      avatar: { photoUrl: 'https://randomuser.me/api/portraits/men/61.jpg' }
    },
    {
      id: 'c2_s2', name: 'Elias Kroft', age: 39, occupation: 'Factory Shift Manager',
      profile: 'A man the victim publicly named in her third article as the prime copycat suspect. Has since sued the publication for defamation.',
      alibi: 'I was at my night shift at the Holloway plant from 8 PM to 4 AM. The floor supervisor logged me in.',
      relationships: 'Has sent the victim threatening letters demanding a retraction. Two letters were escalated to police.',
      unlocked: false, unlockedByClues: ['c2_cl3'],
      responses: { 'c2_cl3': 'She was obsessed with destroying my life. I have a lawyer. Whatever she wrote on that USB is fabricated.' },
      avatar: { photoUrl: 'https://randomuser.me/api/portraits/men/34.jpg' }
    },
    {
      id: 'c2_s3', name: 'Victor Dray', age: 51, occupation: 'Underground Informant',
      profile: 'A shady but well-connected information broker operating on the fringes of law enforcement. The victim owed him a substantial sum for a sensitive tip.',
      alibi: 'I haven\'t seen Nora in weeks. We communicated only by phone.',
      relationships: 'The victim\'s editor confirmed Victor was her primary source for the cold-case series. She owed him $12,000.',
      unlocked: false, unlockedByClues: ['c2_cl2', 'c2_cl4'],
      responses: {
        'c2_cl2': 'Yeah, she called me that afternoon. She was scared. Said someone had been following her for days.',
        'c2_cl4': 'That\'s my lighter. I left it on the fire escape the week before. We used to meet there. I want it back.'
      },
      avatar: { photoUrl: 'https://randomuser.me/api/portraits/men/45.jpg' }
    },
  ],
  trueCulpritId: 'c2_s1',
};

// ─────────────────────────────────────────────────────────────────────────────
// CASE 3  ·  Murder on the Midnight Train  (Easy)
// ─────────────────────────────────────────────────────────────────────────────
const case3: CaseData = {
  id: 'c3',
  title: 'Murder on the Midnight Train',
  setting: 'Transcontinental Express, En Route to Port Calais',
  briefing: 'Wealthy industrialist Harold Fenn was poisoned aboard the overnight Transcontinental Express. The train has made no stops — the killer is still on board. Everyone is a suspect.',
  difficulty: 'Easy',
  timeline: [
    { time: '11:00 PM', event: 'Victim orders a double whiskey in the dining car' },
    { time: '11:30 PM', event: 'Victim retires to his private cabin' },
    { time: '12:05 AM', event: 'Train attendant notices his light is still on' },
    { time: '6:00 AM', event: 'Lead conductor discovers the body during morning check' },
  ],
  locations: ['Dining Car', 'Victim\'s Cabin', 'Baggage Car', 'Cabin 4B'],
  clues: [
    { id: 'c3_cl1', name: 'Empty Cyanide Vial', description: 'A tiny glass vial with traces of potassium cyanide, carrying the distinctive sharp almond smell. Found wedged between cargo containers in the baggage car.', location: 'Baggage Car', reliability: 'High', connections: ['c3_cl3'], visibleTo: 'all', icon: 'vial' },
    { id: 'c3_cl2', name: 'Shattered Whiskey Glass', description: 'The victim\'s monogrammed crystal glass, shattered against the cabin wall. The force of impact suggests rage or panic — inconsistent with a calm, premeditated poisoner.', location: 'Victim\'s Cabin', reliability: 'High', connections: [], visibleTo: 'player1', icon: 'glass' },
    { id: 'c3_cl3', name: 'Waitress\'s Order Notepad', description: 'A torn slip from the waitress\'s notepad showing that someone paid cash for the victim\'s whiskey — a stranger described as "well-dressed, wore a heavy ring on his right hand."', location: 'Dining Car', reliability: 'Medium', connections: ['c3_cl1'], visibleTo: 'player2', icon: 'note' },
    { id: 'c3_cl4', name: 'Altered Will Document', description: 'A freshly notarized will found in the victim\'s briefcase — signed just three days ago — cutting his entire family from the estate and leaving everything to a private foundation he just created.', location: 'Victim\'s Cabin', reliability: 'High', connections: [], visibleTo: 'all', icon: 'document' },
  ],
  suspects: [
    {
      id: 'c3_s1', name: 'Clara Webb', age: 27, occupation: 'Train Waitress',
      profile: 'Has worked the Transcontinental route for three years. Quiet and observant. Claims to have seen everything and nothing that night.',
      alibi: 'I was cleaning the bar and folding linens from 11 PM until 1 AM. The head steward can confirm.',
      relationships: 'No known connection to the victim. She does, however, carry significant debt from a brother\'s medical bills.',
      unlocked: true, unlockedByClues: [],
      responses: { 'c3_cl3': 'A gentleman in a heavy overcoat paid for it. He slid cash across the bar without a word. I thought he was just being generous.' },
      avatar: { photoUrl: 'https://randomuser.me/api/portraits/women/12.jpg' }
    },
    {
      id: 'c3_s2', name: 'Julian Fenn', age: 34, occupation: 'Unemployed (Heir)',
      profile: 'The victim\'s only nephew. Deeply in gambling debt. Has been financially dependent on Fenn\'s trust fund allocations since dropping out of law school.',
      alibi: 'I was asleep in Cabin 4B from 10 PM. I had two sleeping pills and a nightcap.',
      relationships: 'Had a furious argument with the victim over money at the last family gathering. Multiple witnesses can confirm.',
      unlocked: false, unlockedByClues: ['c3_cl4'],
      responses: { 'c3_cl4': 'He was going to cut me off?! I had absolutely no idea about any of this. That\'s... I need a moment.' },
      avatar: { photoUrl: 'https://randomuser.me/api/portraits/men/18.jpg' }
    },
    {
      id: 'c3_s3', name: 'Dr. Serena Aris', age: 49, occupation: 'Industrial Chemist',
      profile: 'A rival industrialist travelling on the same express. Lost a 40-million-dollar government contract to Fenn\'s firm just the previous afternoon.',
      alibi: 'I was reading in my cabin. The conductor checked my ticket at 11:45 PM and I was clearly there.',
      relationships: 'Had an acrimonious 15-year professional rivalry with Fenn. Her company may collapse without that contract.',
      unlocked: false, unlockedByClues: ['c3_cl1'],
      responses: { 'c3_cl1': 'I am a chemist, yes. But I conduct research, not murders. I don\'t travel with potassium cyanide on a passenger train.' },
      avatar: { photoUrl: 'https://randomuser.me/api/portraits/women/31.jpg' }
    },
  ],
  trueCulpritId: 'c3_s2',
};

// ─────────────────────────────────────────────────────────────────────────────
// CASE 4  ·  The Red Ledger  (Medium)
// ─────────────────────────────────────────────────────────────────────────────
const case4: CaseData = {
  id: 'c4',
  title: 'The Red Ledger',
  setting: 'Pinnacle Finance, Downtown Business District',
  briefing: 'The CFO of Pinnacle Finance was found stabbed in the locked vault room. A red leather ledger containing evidence of massive financial fraud has vanished. The company\'s internal cameras were conveniently looping recordings.',
  difficulty: 'Medium',
  timeline: [
    { time: '7:30 PM', event: 'Last employee swipes out at the building entrance' },
    { time: '8:15 PM', event: 'Victim\'s keycard used to access vault level B3' },
    { time: '9:50 PM', event: 'Security guard reports hearing raised voices on B3' },
    { time: '11:00 PM', event: 'Night janitor finds the body and calls emergency services' },
  ],
  locations: ['Vault Room B3', 'CFO\'s Office', 'Server Room', 'Parking Garage'],
  clues: [
    { id: 'c4_cl1', name: 'Blood-Stained Letter Opener', description: 'A monogrammed silver letter opener — used as the murder weapon — found wiped and placed back on the victim\'s own desk. The monogram is not the victim\'s initials.', location: 'CFO\'s Office', reliability: 'High', connections: ['c4_cl2'], visibleTo: 'all', icon: 'knife' },
    { id: 'c4_cl2', name: 'Cloned Access Badge', description: 'A sophisticated cloned keycard found in a ceiling tile above the server room. It has the victim\'s clearance but a different chip signature — someone made a copy weeks in advance.', location: 'Server Room', reliability: 'High', connections: ['c4_cl1'], visibleTo: 'player1', icon: 'key' },
    { id: 'c4_cl3', name: 'Tire Screeching CCTV Clip', description: 'A partial, uncorrupted clip from a parking garage camera showing a luxury vehicle speeding out at 9:58 PM. The plate is partially visible: "_ _ X - 49 _".', location: 'Parking Garage', reliability: 'Medium', connections: [], visibleTo: 'player2', icon: 'camera' },
    { id: 'c4_cl4', name: 'Shredded Document', description: 'Improperly shredded documents recovered from the recycling bin. When reconstructed, they reveal a secret offshore account draining $2M monthly — approved with two signatures, one of which is the victim\'s.', location: 'Server Room', reliability: 'High', connections: [], visibleTo: 'all', icon: 'document' },
  ],
  suspects: [
    {
      id: 'c4_s1', name: 'Arthur Crane', age: 62, occupation: 'CEO, Pinnacle Finance',
      profile: 'Visionary, ruthless, and seemingly untouchable. Built the company from nothing. His initials are "A.C." — exactly the monogram on the letter opener.',
      alibi: 'I flew to Geneva for the quarterly summit at 6 PM. My passport and flight manifest will confirm this.',
      relationships: 'The victim was his direct report and had recently threatened to take the offshore accounts to the compliance board.',
      unlocked: true, unlockedByClues: [],
      responses: { 'c4_cl1': 'That letter opener was a gift I gave Thomas years ago. My initials being on it proves nothing about me being there.' },
      avatar: { photoUrl: 'https://randomuser.me/api/portraits/men/72.jpg' }
    },
    {
      id: 'c4_s2', name: 'Miriam Solís', age: 41, occupation: 'Head of IT Security',
      profile: 'Technically brilliant and deeply underpaid for her skills. Has access to every system in the building and could easily clone a keycard or loop camera feeds.',
      alibi: 'I was at my workstation in the server room until 9 PM, then I went home. My access log shows my exit.',
      relationships: 'Was passed over for a VP promotion in favor of an external candidate three months ago. Filed an internal grievance that was quietly dismissed.',
      unlocked: false, unlockedByClues: ['c4_cl2'],
      responses: { 'c4_cl2': 'Yes, I know how to clone an access badge — I\'m the one who wrote the security protocols. That\'s also how I know someone else here knows how to do it too.' },
      avatar: { photoUrl: 'https://randomuser.me/api/portraits/women/44.jpg' }
    },
    {
      id: 'c4_s3', name: 'Douglas Park', age: 38, occupation: 'Senior Portfolio Manager',
      profile: 'The victim\'s direct subordinate. Ambitious, well-connected, and next in line for the CFO position. Drives a black Mercedes with a "DPX" vanity plate.',
      alibi: 'I was having dinner at Cartier\'s Bistro with a client until 10:30 PM. I have the receipt.',
      relationships: 'The victim had recently flagged Douglas to HR for "undisclosed conflicts of interest" — a complaint that would have ended his career.',
      unlocked: false, unlockedByClues: ['c4_cl3'],
      responses: { 'c4_cl3': 'Hundreds of black Mercedes park in that garage. My plate is registered — go ahead and check it against whatever partial you have.' },
      avatar: { photoUrl: 'https://randomuser.me/api/portraits/men/29.jpg' }
    },
  ],
  trueCulpritId: 'c4_s1',
};

// ─────────────────────────────────────────────────────────────────────────────
// CASE 5  ·  Poisoned Ivy  (Hard)
// ─────────────────────────────────────────────────────────────────────────────
const case5: CaseData = {
  id: 'c5',
  title: 'Poisoned Ivy',
  setting: 'Blackwood Estate, Private Country Grounds',
  briefing: 'Renowned botanist and reclusive heiress Ivy Blackwood collapsed at her own garden party and died hours later. The coroner confirmed slow-acting aconite poisoning. Everyone at the party had motive — Ivy was about to change her will.',
  difficulty: 'Hard',
  timeline: [
    { time: '3:00 PM', event: 'Garden party begins; Ivy appears in good health' },
    { time: '4:45 PM', event: 'Ivy drinks a glass of elderflower cordial prepared by staff' },
    { time: '5:30 PM', event: 'Ivy complains of numbness in her hands and lips' },
    { time: '7:10 PM', event: 'Ivy loses consciousness; ambulance called' },
    { time: '11:45 PM', event: 'Ivy pronounced dead at Blackwood County Hospital' },
  ],
  locations: ['Garden Terrace', 'Kitchen', 'Ivy\'s Study', 'Guest Cottage'],
  clues: [
    { id: 'c5_cl1', name: 'Wolfsbane Clipping', description: 'A fresh cutting of wolfsbane (aconite source) found pressed inside a botanical reference book in the study. Aconite grows wild on the estate grounds — but picking it requires knowing exactly what to look for.', location: 'Ivy\'s Study', reliability: 'High', connections: ['c5_cl3'], visibleTo: 'all', icon: 'note' },
    { id: 'c5_cl2', name: 'Stained Cordial Glass', description: 'The victim\'s personal cordial glass, found separately washed in the kitchen sink, still faintly blue-tinted — consistent with residual aconite alkaloid contamination.', location: 'Kitchen', reliability: 'High', connections: [], visibleTo: 'player1', icon: 'glass' },
    { id: 'c5_cl3', name: 'Torn Will Draft', description: 'A torn draft of Ivy\'s new will, found in the fireplace. Partially legible — it removes the name "Preston Blackwood" from the beneficiary list and replaces it with a wildlife conservation charity.', location: 'Ivy\'s Study', reliability: 'Medium', connections: ['c5_cl1'], visibleTo: 'player2', icon: 'document' },
    { id: 'c5_cl4', name: 'Latex Gloves in Bin', description: 'A pair of fine latex gloves found discarded beneath the guest cottage bathroom sink. Traces of blue powder on the fingertips are consistent with aconite alkaloid extraction.', location: 'Guest Cottage', reliability: 'High', connections: [], visibleTo: 'all', icon: 'bag' },
  ],
  suspects: [
    {
      id: 'c5_s1', name: 'Preston Blackwood', age: 45, occupation: 'Ivy\'s Estranged Brother',
      profile: 'Ivy\'s younger brother. Charming but financially reckless. Stood to inherit the entire estate under the previous will — the one Ivy was about to change.',
      alibi: 'I was on the garden terrace socializing with guests the entire afternoon. A dozen people can confirm.',
      relationships: 'Had a bitter public dispute with Ivy after she refused to fund his latest business venture. They had not spoken civilly in months before the party.',
      unlocked: true, unlockedByClues: [],
      responses: { 'c5_cl3': 'Changing her will was her right, obviously. But I had no idea she was planning this. We had just begun reconciling.' },
      avatar: { photoUrl: 'https://randomuser.me/api/portraits/men/56.jpg' }
    },
    {
      id: 'c5_s2', name: 'Dr. Hana Mori', age: 36, occupation: 'Botanist & Ivy\'s Research Partner',
      profile: 'A brilliant plant toxicologist who has worked alongside Ivy for six years. Knows the estate\'s plant life better than anyone. Her recent grant application had been quietly rejected by Ivy.',
      alibi: 'I was assisting with the garden tour presentation until 5 PM, then I stepped away to answer calls in the cottage.',
      relationships: 'Ivy had written a critical peer review of Mori\'s latest research paper, potentially ending Mori\'s academic career. The letter was due to be published next week.',
      unlocked: false, unlockedByClues: ['c5_cl1'],
      responses: { 'c5_cl1': 'Of course I know what wolfsbane looks like — I\'ve catalogued it in this estate\'s flora index. Knowing it exists is not the same as using it to kill.' },
      avatar: { photoUrl: 'https://randomuser.me/api/portraits/women/58.jpg' }
    },
    {
      id: 'c5_s3', name: 'Geoffrey Marsh', age: 52, occupation: 'Estate Caretaker',
      profile: 'Has managed Blackwood Estate for 18 years. Has access to every room, every key, and deep knowledge of the grounds. Recently learned Ivy planned to sell the estate after updating her will.',
      alibi: 'I was overseeing the catering setup in the kitchen until 4 PM, then doing perimeter checks.',
      relationships: 'His entire livelihood depends on the estate. A sale would mean immediate redundancy. He has expressed this fear to multiple staff members.',
      unlocked: false, unlockedByClues: ['c5_cl4'],
      responses: { 'c5_cl4': 'I do maintenance. I use gloves for everything from pesticides to engine oil. Those could be from any day this past month.' },
      avatar: { photoUrl: 'https://randomuser.me/api/portraits/men/68.jpg' }
    },
  ],
  trueCulpritId: 'c5_s2',
};

// ─────────────────────────────────────────────────────────────────────────────
// CASE 6  ·  The Vanishing Act  (Easy)
// ─────────────────────────────────────────────────────────────────────────────
const case6: CaseData = {
  id: 'c6',
  title: 'The Vanishing Act',
  setting: 'Grand Marquee Theater, Downtown',
  briefing: 'Star illusionist "The Magnificent Renard" was killed backstage during his own sold-out show. The murder weapon vanished just like one of his tricks. Three hundred witnesses were in the theater — yet nobody saw a thing.',
  difficulty: 'Easy',
  timeline: [
    { time: '8:00 PM', event: 'Show begins; Renard performs first two acts flawlessly' },
    { time: '9:15 PM', event: 'Renard exits stage for a 15-minute intermission break' },
    { time: '9:22 PM', event: 'Stage manager hears arguing from the star dressing room' },
    { time: '9:30 PM', event: 'Renard is found unresponsive; show is stopped' },
  ],
  locations: ['Star Dressing Room', 'Stage Rigging', 'Prop Storage', 'Theater Lobby'],
  clues: [
    { id: 'c6_cl1', name: 'Garrotte Wire', description: 'A thin, professional-grade steel wire found coiled inside a trick cabinet in the prop storage — identical to the kind used in the victim\'s signature "Escape from the Wire" routine.', location: 'Prop Storage', reliability: 'High', connections: ['c6_cl2'], visibleTo: 'all', icon: 'wire' },
    { id: 'c6_cl2', name: 'Unsigned Contract', description: 'A crumpled unsigned contract found under the dressing room vanity. It offers Renard\'s act a 3-year residency at a rival theater for double his current fee — his manager would lose his cut entirely.', location: 'Star Dressing Room', reliability: 'Medium', connections: ['c6_cl1'], visibleTo: 'player1', icon: 'document' },
    { id: 'c6_cl3', name: 'Stage Rigging Sabotage', description: 'A deliberately loosened safety bolt in the stage rigging. When examined, the bolt shows fresh tool marks. This wasn\'t an accident — someone prepared a backup method in case the first plan failed.', location: 'Stage Rigging', reliability: 'High', connections: [], visibleTo: 'player2', icon: 'rope' },
    { id: 'c6_cl4', name: 'Monogrammed Flask', description: 'A silver hip flask engraved with the initials "C.D." found in the lobby coat check. It contains a strong sedative mixed into cognac — enough to incapacitate someone within 20 minutes.', location: 'Theater Lobby', reliability: 'High', connections: [], visibleTo: 'all', icon: 'bottle' },
  ],
  suspects: [
    {
      id: 'c6_s1', name: 'Margot Renard', age: 38, occupation: 'Illusionist\'s Wife & Assistant',
      profile: 'Renard\'s wife and on-stage assistant for 12 years. Performed with him in every show but was notably absent from tonight\'s lineup after a last-minute scheduling change.',
      alibi: 'I was in the audience watching from the front row until the show stopped.',
      relationships: 'Multiple backstage crew members confirm the couple had a very public, very loud argument three days ago after Renard\'s affair was discovered.',
      unlocked: true, unlockedByClues: [],
      responses: { 'c6_cl2': 'He was going to sign that contract without even telling me. Years of building this act together — and he was just going to disappear to a rival show.' },
      avatar: { photoUrl: 'https://randomuser.me/api/portraits/women/27.jpg' }
    },
    {
      id: 'c6_s2', name: 'Claude Devereaux', age: 55, occupation: 'Renard\'s Talent Manager',
      profile: 'Renard\'s manager for 20 years. Takes 30% of all earnings. If Renard signed the new contract, Devereaux\'s management agreement would have been legally dissolved.',
      alibi: 'I was in the lobby handling VIP ticket concerns from 8:45 PM until the show was stopped.',
      relationships: 'The new contract explicitly excluded Devereaux from any revenue share — his lawyers had reviewed it and confirmed it was binding and unbreakable.',
      unlocked: false, unlockedByClues: ['c6_cl4'],
      responses: { 'c6_cl4': 'I carry a flask. Half of show business does. The sedative? I have no idea how that got in there. Someone must have tampered with it.' },
      avatar: { photoUrl: 'https://randomuser.me/api/portraits/men/83.jpg' }
    },
    {
      id: 'c6_s3', name: 'Tomás Reyes', age: 29, occupation: 'Stage Technician',
      profile: 'Handles all rigging, props, and trap doors for Renard\'s show. Has worked at the theater for four years but was recently passed over for a lead technician role that went to an external hire.',
      alibi: 'I was running lighting cues in the booth during the whole first act. The assistant TD was with me.',
      relationships: 'Renard had publicly humiliated Tomás on stage during a rehearsal last month, blaming him for a prop failure in front of the entire crew.',
      unlocked: false, unlockedByClues: ['c6_cl3'],
      responses: { 'c6_cl3': 'I checked that rig three days ago — it was fine. Someone got up there after me. I am the only one who knows that rig was safe.' },
      avatar: { photoUrl: 'https://randomuser.me/api/portraits/men/15.jpg' }
    },
  ],
  trueCulpritId: 'c6_s2',
};

// ─────────────────────────────────────────────────────────────────────────────
// CASE 7  ·  Dead Signal  (Hard)
// ─────────────────────────────────────────────────────────────────────────────
const case7: CaseData = {
  id: 'c7',
  title: 'Dead Signal',
  setting: 'Apex Broadcasting Tower, Hilltop District',
  briefing: 'A whistleblower working inside Apex Broadcasting was found dead at the base of the transmission tower. She had been about to leak classified documents proving the network was fabricating election polling data. Her encrypted laptop is missing.',
  difficulty: 'Hard',
  timeline: [
    { time: '10:30 PM', event: 'Victim sends an encrypted email to a journalist: "Tonight. All of it."' },
    { time: '11:00 PM', event: 'Victim\'s access badge used to enter the tower roof level' },
    { time: '11:18 PM', event: 'Tower maintenance sensor detects unusual roof access' },
    { time: '11:55 PM', event: 'Body found by security patrol at the base of the tower' },
  ],
  locations: ['Tower Roof', 'Broadcast Control Room', 'Staff Locker Room', 'Parking Lot'],
  clues: [
    { id: 'c7_cl1', name: 'Encrypted Laptop Bag', description: 'A professional laptop bag found partially hidden in a hedge near the parking lot. The laptop is gone, but a sticky note inside reads a partial password in the victim\'s handwriting.', location: 'Parking Lot', reliability: 'High', connections: ['c7_cl2'], visibleTo: 'all', icon: 'laptop' },
    { id: 'c7_cl2', name: 'Server Access Log', description: 'A printed server access log from the control room showing the victim\'s credentials were used to access classified polling data files — but the login timestamp was 45 minutes after she was already dead.', location: 'Broadcast Control Room', reliability: 'High', connections: ['c7_cl1'], visibleTo: 'player1', icon: 'document' },
    { id: 'c7_cl3', name: 'Muddy Work Boots', description: 'A pair of size-11 work boots left in a locker room shower — still wet, with red clay mud identical to the soil around the tower base. The locker belongs to a maintenance employee.', location: 'Staff Locker Room', reliability: 'Medium', connections: [], visibleTo: 'player2', icon: 'footprint' },
    { id: 'c7_cl4', name: 'Rooftop Struggle Evidence', description: 'Fresh scuff marks and a torn shirt button on the roof access ledge. The button\'s fabric is from a premium tailored suit — not standard staff uniform. It also shows traces of a distinctive cologne.', location: 'Tower Roof', reliability: 'High', connections: [], visibleTo: 'all', icon: 'bag' },
  ],
  suspects: [
    {
      id: 'c7_s1', name: 'Evelyn Cross', age: 54, occupation: 'Network President, Apex Broadcasting',
      profile: 'The most powerful woman in regional media. Built Apex from a failing radio station into a broadcast empire. The fabricated polling data directly served narratives she has publicly championed.',
      alibi: 'I was hosting a donor reception at the Penthouse Club until midnight. Thirty attendees can confirm.',
      relationships: 'The victim had worked directly for Cross for eight years. Cross had previously promoted her twice — making the betrayal deeply personal.',
      unlocked: true, unlockedByClues: [],
      responses: { 'c7_cl4': 'I wear tailored suits. So do a hundred other executives who have visited that building. You\'re connecting dots that don\'t exist.' },
      avatar: { photoUrl: 'https://randomuser.me/api/portraits/women/65.jpg' }
    },
    {
      id: 'c7_s2', name: 'Ray Hollis', age: 43, occupation: 'Senior Data Analyst',
      profile: 'The architect of the polling data manipulation. Has been quietly altering survey results for three election cycles. If the victim\'s leak succeeded, Hollis would face federal charges.',
      alibi: 'I was running a late-night data audit in the control room. My workstation logs will show continuous activity.',
      relationships: 'The victim had confronted Hollis privately two days prior, giving him 48 hours to come forward himself before she went public. He refused.',
      unlocked: false, unlockedByClues: ['c7_cl2'],
      responses: { 'c7_cl2': 'Those are my credentials — obviously someone used them without my knowledge. The logs prove I was in that room, not on the roof.' },
      avatar: { photoUrl: 'https://randomuser.me/api/portraits/men/41.jpg' }
    },
    {
      id: 'c7_s3', name: 'Danny Voss', age: 31, occupation: 'Tower Maintenance Technician',
      profile: 'Handles all physical infrastructure at the tower site. Has unrestricted roof access at all hours. Recently approached by an unnamed party offering cash to "look the other way" on a specific night.',
      alibi: 'I finished my shift at 10 PM and went straight home. My transit card will show my route.',
      relationships: 'Has significant undisclosed debts. His coworkers noted he seemed "distracted and nervous" in the days leading up to the incident.',
      unlocked: false, unlockedByClues: ['c7_cl3'],
      responses: { 'c7_cl3': 'I work in that tower every day. Of course my boots have tower-site mud. That doesn\'t mean I was there at 11 PM.' },
      avatar: { photoUrl: 'https://randomuser.me/api/portraits/men/37.jpg' }
    },
  ],
  trueCulpritId: 'c7_s2',
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────
export const allCases: CaseData[] = [case1, case2, case3, case4, case5, case6, case7];

