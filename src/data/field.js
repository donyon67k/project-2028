// The 2028 field: who is running, who is weighing it, and who has said no.
// Status changes need a cited source (a news report or the candidate's own statement),
// never a wiki. HQ Admin can override any entry through control.json without a release.
//
// status:
//   declared    formally announced (FEC Form 2 or launch event)
//   exploring   exploratory committee or "seriously considering" on the record
//   speculated  widely reported as a possible candidate, no statement either way
//   conditional has set a condition on running (e.g. "not if X runs")
//   out         has said on the record they will not run in 2028

export const UPDATED = '2026-11-23'

export const STATUS = {
  declared: { label: 'DECLARED', short: 'IN', rank: 0 },
  exploring: { label: 'EXPLORING', short: 'EXPL', rank: 1 },
  speculated: { label: 'ON THE RADAR', short: 'RADAR', rank: 2 },
  conditional: { label: 'CONDITIONAL', short: 'COND', rank: 3 },
  out: { label: 'NOT RUNNING', short: 'OUT', rank: 4 },
}

export const PARTIES = {
  D: { name: 'Democratic', stage: 'DEMOCRATIC STAGE', color: '#4488ff' },
  R: { name: 'Republican', stage: 'REPUBLICAN STAGE', color: '#ff4444' },
}

const SRC = {
  tracker: { label: 'Politics1 2028 field', url: 'https://politics1.com/p2028.htm' },
  gopField: { label: 'Detroit News, Nov 16 2026', url: 'https://www.detroitnews.com/story/news/politics/2026/11/16/republican-2028-field-takes-shape-after-midterm-drubbing/92809807007/' },
  cnnField: { label: 'CNN 2028 contenders', url: 'https://www.cnn.com/interactive/politics/2028-presidential-candidates-vis/jon-ossoff/' },
  haley: { label: 'The Hill, Nov 2026', url: 'https://thehill.com/homenews/administration/6214225-nikki-haley-not-running-2028/' },
  moore: { label: 'Interview on NBC (via Fox News)', url: 'https://www.foxnews.com/media/maryland-democrat-reveals-whether-hell-run-president-2028' },
  rubio: { label: 'Political.org, Nov 5 2026', url: 'https://political.org/2026/11/05/midterm-rout-reshuffles-gop-2028-field-leaving-vice-president-jd-vance-exposed-and-secretary-of-state-marco-rubio-watching/' },
  mcentee: { label: 'CT Post, Nov 2026', url: 'https://www.ctpost.com/sports/uconn-football/article/john-mcentee-uconn-republican-president-primary-22526212.php' },
  ossoffWin: { label: 'OPB / AP, Nov 3 2026', url: 'https://www.opb.org/article/2026/11/03/democrat-jon-ossoff-wins-reelection-to-u-s-senate-from-georgia/' },
}

// short = podium nameplate when the last name doesn't fit or isn't how they're known
// home = state abbreviation; since = when the current status began (for the status log)
export const FIELD = [
  // ---------- Democrats ----------
  { id: 'harris', name: 'Kamala Harris', party: 'D', home: 'CA', status: 'speculated', role: 'Former Vice President (2021–2025)',
    past: ['2024 Democratic nominee', 'U.S. Senator, California (2017–2021)', 'California Attorney General (2011–2017)'],
    note: 'Has led most national Democratic primary polls since spring 2026. No decision announced.', src: SRC.tracker },
  { id: 'newsom', name: 'Gavin Newsom', party: 'D', home: 'CA', status: 'speculated', role: 'Governor of California (term ends Jan 2027)',
    past: ['Lieutenant Governor of California (2011–2019)', 'Mayor of San Francisco (2004–2011)'],
    note: 'Widely expected to run once his term ends. Has not announced.', src: SRC.tracker },
  { id: 'aoc', name: 'Alexandria Ocasio-Cortez', short: 'AOC', party: 'D', home: 'NY', status: 'speculated', role: 'U.S. Representative, New York 14th',
    past: ['In the House since 2019'],
    note: 'Leads Democrats in prediction markets; has not said whether she will run for president or Senate.', src: SRC.tracker },
  { id: 'buttigieg', name: 'Pete Buttigieg', party: 'D', home: 'MI', status: 'speculated', role: 'Former Secretary of Transportation (2021–2025)',
    past: ['2020 presidential candidate (won the most Iowa delegates)', 'Mayor of South Bend, Indiana (2012–2020)'],
    note: 'Passed on Michigan’s 2026 Senate race; has topped several early-state polls.', src: SRC.tracker },
  { id: 'shapiro', name: 'Josh Shapiro', party: 'D', home: 'PA', status: 'speculated', role: 'Governor of Pennsylvania (re-elected Nov 2026)',
    past: ['Pennsylvania Attorney General (2017–2023)'],
    note: 'Re-elected Nov 3, 2026. Considered a likely 2028 contender.', src: SRC.tracker },
  { id: 'pritzker', name: 'JB Pritzker', party: 'D', home: 'IL', status: 'speculated', role: 'Governor of Illinois (re-elected Nov 2026)',
    past: ['Governor since 2019'],
    note: 'Won a third term Nov 3, 2026. Frequently named as a possible candidate.', src: SRC.tracker },
  { id: 'whitmer', name: 'Gretchen Whitmer', party: 'D', home: 'MI', status: 'speculated', role: 'Governor of Michigan (term ends Jan 2027)',
    past: ['Michigan Senate Minority Leader (2011–2015)'],
    note: 'Term-limited; frequently listed as a possible candidate.', src: SRC.tracker },
  { id: 'beshear', name: 'Andy Beshear', party: 'D', home: 'KY', status: 'speculated', role: 'Governor of Kentucky (term ends Dec 2027)',
    past: ['Kentucky Attorney General (2016–2019)'],
    note: 'Has said he would consider a run; no decision announced.', src: SRC.tracker },
  { id: 'booker', name: 'Cory Booker', party: 'D', home: 'NJ', status: 'speculated', role: 'U.S. Senator, New Jersey',
    past: ['2020 presidential candidate', 'Mayor of Newark (2006–2013)'],
    note: 'Frequently named as a possible candidate.', src: SRC.tracker },
  { id: 'murphy', name: 'Chris Murphy', party: 'D', home: 'CT', status: 'speculated', role: 'U.S. Senator, Connecticut',
    past: ['U.S. Representative (2007–2013)'],
    note: 'Frequently named as a possible candidate.', src: SRC.tracker },
  { id: 'khanna', name: 'Ro Khanna', party: 'D', home: 'CA', status: 'speculated', role: 'U.S. Representative, California 17th',
    past: ['In the House since 2017'],
    note: 'Frequently named as a possible candidate.', src: SRC.tracker },
  { id: 'kelly', name: 'Mark Kelly', party: 'D', home: 'AZ', status: 'speculated', role: 'U.S. Senator, Arizona',
    past: ['NASA astronaut', 'U.S. Navy captain'],
    note: 'Frequently named as a possible candidate.', src: SRC.tracker },
  { id: 'emanuel', name: 'Rahm Emanuel', party: 'D', home: 'IL', status: 'speculated', role: 'Former U.S. Ambassador to Japan (2022–2025)',
    past: ['Mayor of Chicago (2011–2019)', 'White House Chief of Staff (2009–2010)'],
    note: 'Has said publicly he is weighing a run.', src: SRC.tracker },
  { id: 'ossoff', name: 'Jon Ossoff', party: 'D', home: 'GA', status: 'out', role: 'U.S. Senator, Georgia (re-elected Nov 2026)',
    past: ['In the Senate since 2021'],
    note: 'Has said he is not running in 2028, but voters keep naming him: he leads or places near the top of several national polls.', src: SRC.cnnField },
  { id: 'moore', name: 'Wes Moore', party: 'D', home: 'MD', status: 'out', role: 'Governor of Maryland (re-elected Nov 2026)',
    past: ['CEO, Robin Hood Foundation (2017–2021)', 'U.S. Army officer'],
    note: 'Said on NBC that he is not running for president in 2028.', src: SRC.moore },

  // ---------- Republicans ----------
  { id: 'vance', name: 'JD Vance', party: 'R', home: 'OH', status: 'speculated', role: 'Vice President of the United States',
    past: ['U.S. Senator, Ohio (2023–2025)', 'Author, Hillbilly Elegy'],
    note: 'Has said he will discuss a run with his family after the midterms. Seen as the early front-runner, with Trump signaling support.', src: SRC.gopField },
  { id: 'rubio', name: 'Marco Rubio', party: 'R', home: 'FL', status: 'conditional', role: 'U.S. Secretary of State',
    past: ['U.S. Senator, Florida (2011–2025)', '2016 presidential candidate'],
    note: 'Has said he will not run if Vance does, yet he leads some Republican primary polls.', src: SRC.rubio },
  { id: 'desantis', name: 'Ron DeSantis', party: 'R', home: 'FL', status: 'speculated', role: 'Governor of Florida (term ends Jan 2027)',
    past: ['2024 presidential candidate', 'U.S. Representative (2013–2018)'],
    note: 'Named as a possible candidate after the midterms.', src: SRC.gopField },
  { id: 'cruz', name: 'Ted Cruz', party: 'R', home: 'TX', status: 'speculated', role: 'U.S. Senator, Texas',
    past: ['2016 presidential runner-up', 'Solicitor General of Texas (2003–2008)'],
    note: 'Named as a possible candidate after the midterms.', src: SRC.gopField },
  { id: 'hawley', name: 'Josh Hawley', party: 'R', home: 'MO', status: 'speculated', role: 'U.S. Senator, Missouri',
    past: ['Missouri Attorney General (2017–2019)'],
    note: 'Named as a possible candidate after the midterms.', src: SRC.gopField },
  { id: 'trumpjr', name: 'Donald Trump Jr.', short: 'TRUMP JR', party: 'R', home: 'FL', status: 'speculated', role: 'Businessman, Trump Organization',
    past: [],
    note: 'Appears in Republican primary polls; has not announced plans.', src: SRC.tracker },
  { id: 'youngkin', name: 'Glenn Youngkin', party: 'R', home: 'VA', status: 'speculated', role: 'Former Governor of Virginia (2022–2026)',
    past: ['Co-CEO, The Carlyle Group'],
    note: 'Frequently named as a possible candidate.', src: SRC.tracker },
  { id: 'kemp', name: 'Brian Kemp', party: 'R', home: 'GA', status: 'speculated', role: 'Governor of Georgia (term ends Jan 2027)',
    past: ['Georgia Secretary of State (2010–2018)'],
    note: 'Term-limited; frequently named as a possible candidate.', src: SRC.tracker },
  { id: 'mcentee', name: 'John McEntee', aka: ['Johnny McEntee'], wiki: 'John McEntee (political aide)', party: 'R', home: 'CA', status: 'speculated', role: 'Former Trump White House aide; conservative influencer',
    past: ['Director, White House Presidential Personnel Office (2020–2021)', 'Quarterback, UConn'],
    note: 'Teased a run online and won a Nov 12, 2026 college Republican straw poll, but says he has “no intention of running for president at the moment.”', src: SRC.mcentee },
  { id: 'haley', name: 'Nikki Haley', party: 'R', home: 'SC', status: 'out', role: 'Former U.S. Ambassador to the UN (2017–2018)',
    past: ['2024 presidential runner-up', 'Governor of South Carolina (2011–2017)'],
    note: 'Said in November 2026: she is not running in 2028.', src: SRC.haley },
]

// National primary polls, as published by each pollster (linked to the report that carried them).
// Only names a report lists are recorded; a missing name means "not reported", not zero.
export const POLLS = [
  { party: 'D', pollster: 'Echelon Insights', dates: 'Nov 12–16, 2026', end: '2026-11-16', src: 'https://www.newsweek.com/dnc-democrats-2028-primary-debates-polls-12758312',
    results: { harris: 19, buttigieg: 15, newsom: 11 } },
  { party: 'D', pollster: 'Economist/YouGov', dates: 'Nov 9–11, 2026', end: '2026-11-11', src: 'https://www.newsweek.com/dnc-democrats-2028-primary-debates-polls-12758312',
    results: { harris: 18, ossoff: 15, newsom: 14 } },
  { party: 'D', pollster: 'Strength In Numbers/Verasight', dates: 'Nov 2026', end: '2026-11-10', src: 'https://politicalwire.com/2026/11/19/no-clear-leaders-in-2028-field/',
    results: { harris: 18, aoc: 17, buttigieg: 15, ossoff: 12, newsom: 10 } },
  { party: 'D', pollster: 'Emerson College', dates: 'Nov 2026', end: '2026-11-08', src: 'https://www.cnn.com/2026/11/11/politics/2028-poll-presidential-candidates',
    results: { ossoff: 17, harris: 16, aoc: 15, buttigieg: 14 } },
  { party: 'R', pollster: 'Emerson College (open-ended)', dates: 'Nov 2026', end: '2026-11-08', src: 'https://www.cnn.com/2026/11/11/politics/2028-poll-presidential-candidates',
    results: { rubio: 36, vance: 20 } },
]

// Key dates that are already set (the DNC framework and early-state order).
export const CALENDAR = [
  { date: '2027-06-15', label: 'First DNC primary debate (June 2027, date TBA)', party: 'D', src: 'https://democrats.org/dnc-announces-framework-for-the-2028-democratic-presidential-primary-debates/' },
  { date: '2028-01-22', label: 'South Carolina Democratic primary', party: 'D', state: 'SC' },
  { date: '2028-02-01', label: 'Nevada Democratic primary', party: 'D', state: 'NV' },
  { date: '2028-02-08', label: 'New Hampshire Democratic primary', party: 'D', state: 'NH' },
  { date: '2028-02-15', label: 'New Mexico Democratic primary', party: 'D', state: 'NM' },
  { date: '2028-02-22', label: 'Michigan Democratic primary', party: 'D', state: 'MI' },
  { date: '2028-02-29', label: 'Virginia Democratic primary', party: 'D', state: 'VA' },
  { date: '2028-11-07', label: 'Election Day', party: null },
]

export const DEBATES = {
  D: { summary: '12 sanctioned debates: 5 in 2027 starting in June, 7 in 2028 through March. Up to 20 candidates across two nights. Qualifying rules (polling + grassroots donors) due January 2027. Candidates must denounce outside spending on their behalf.', src: 'https://democrats.org/dnc-announces-framework-for-the-2028-democratic-presidential-primary-debates/' },
  R: { summary: 'The RNC has not announced a 2028 debate schedule.', src: null },
}
