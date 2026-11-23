// Explainers: short briefings that open as pop-ups wherever a term appears (the ? buttons)
// and on the LEARN page. Course material gets added here as new entries or `more` sections.

export const LESSONS = [
  {
    id: 'invisible-primary',
    title: 'The invisible primary',
    tag: 'NOW',
    body: [
      'The year before anyone votes is called the invisible primary. Would-be candidates compete for money, staff, endorsements and media attention, and the field is often half-decided before the first ballot is cast.',
      'This is the phase 2028 is in now. That is why HQ tracks attention and polls for people who have not declared: who the press covers and who voters name early shapes who can raise money and qualify for debates.',
    ],
  },
  {
    id: 'declaring',
    title: 'How a candidate officially enters',
    tag: 'NOW',
    body: [
      'A person becomes a federal candidate once they raise or spend more than $5,000 for a run. Within 15 days they must file a Statement of Candidacy (FEC Form 2) and name a principal campaign committee.',
      'Before that, many test the waters: polling, travel and calls to donors, sometimes through an exploratory committee. A public launch event usually comes with or soon after the filing.',
      'Hundreds of people file for president every cycle, most of them unknown. HQ puts a podium on the stage for major declared and exploring candidates and lists the rest of the filings separately.',
    ],
  },
  {
    id: 'attention-index',
    title: 'The HQ attention index',
    tag: 'HQ',
    body: [
      'Before anyone declares, the stage shows who is genuinely in contention. The index blends two signals, scaled within each party:',
      '• Coverage (50%): how many news stories mentioned the person in the past 7 days, and how many tied them to the 2028 race in the past 30 days, across thousands of outlets.',
      '• Polling (50%): their average in national primary polls released in the last 60 days, counting only polls that reported their name.',
      'The leader of each field scores 100 on each half. Speculated names with an index of at least a quarter of their party’s leader get a faded podium; the rest wait in the wings. People who have said they will not run are never placed on the stage, however much coverage they get: they are listed under NOT RUNNING with the statement and its source.',
    ],
  },
  {
    id: 'debates',
    title: 'Primary debates and how to qualify',
    tag: 'DEBATES',
    body: [
      'Each national party sanctions its own primary debates and sets the bar to get on stage, usually a polling threshold plus a minimum number of individual donors.',
      'For 2028 the DNC has announced 12 debates: five in 2027 starting in June, seven in 2028 through March. Early debates can split across two nights with candidates assigned at random, and no more than 20 total. Qualifying rules for the first two are due in January 2027. Candidates must also denounce outside spending on their behalf.',
      'Networks place the highest-polling candidates at center stage and work outward, which is how HQ arranges the podiums too.',
    ],
  },
  {
    id: 'primaries-caucuses',
    title: 'Primaries vs. caucuses',
    tag: 'NOMINATION',
    body: [
      'In a primary, voters cast a secret ballot at a polling place or by mail, like a general election. In a caucus, party members meet in person, often in rounds, and the result is tallied by groups.',
      'States set their own dates within each party’s rules. Who can vote also varies: closed primaries allow only registered party members, open primaries allow anyone, and semi-closed ones let unaffiliated voters choose a party ballot.',
      'The DNC’s 2028 calendar opens with South Carolina (Jan 22), then Nevada, New Hampshire, New Mexico, Michigan and Virginia through Feb 29. New Hampshire’s state law requires it to hold the first primary, which may set up a conflict.',
    ],
  },
  {
    id: 'delegates-d',
    title: 'Democratic delegates',
    tag: 'NOMINATION',
    body: [
      'Democrats award pledged delegates in proportion to the vote, but only to candidates who reach 15% statewide or in a congressional district. Falling short of 15% everywhere means zero delegates from that state.',
      'The nominee needs a majority of pledged delegates on the first convention ballot. Automatic delegates (superdelegates: party leaders and elected officials) cannot vote on the first ballot unless the result is already settled; they vote only if the convention goes to a second ballot.',
    ],
  },
  {
    id: 'delegates-r',
    title: 'Republican delegates',
    tag: 'NOMINATION',
    body: [
      'Republicans let each state party choose its method within national rules. Contests held before March 15 must award delegates proportionally (states may still give all of them to a candidate who wins a majority). After that, many states use winner-take-all or winner-take-most rules.',
      'Because a front-runner can lock up delegates quickly once winner-take-all states vote, Republican nominations often end earlier than Democratic ones.',
    ],
  },
  {
    id: 'conventions',
    title: 'The conventions',
    tag: 'NOMINATION',
    body: [
      'Each party holds a national convention in the summer of the election year. Delegates formally nominate the presidential candidate, approve the running mate the nominee has chosen and adopt the party platform.',
      'If no one has a majority of delegates going in, the convention is contested: delegates are freed after the first ballot and voting continues until someone wins a majority.',
    ],
  },
  {
    id: 'electoral-college',
    title: 'The Electoral College and 270',
    tag: 'GENERAL',
    body: [
      'The president is chosen by 538 electors: one for each House seat and Senate seat, plus three for Washington, D.C. Winning takes a majority, 270.',
      '48 states and D.C. give all their electors to the statewide winner. Maine and Nebraska give two to the statewide winner and one to the winner of each congressional district, so they can split.',
      'Seats are reapportioned after each census. 2028 uses the same counts as 2024 (from the 2020 census); the 2030 census will change them for 2032.',
      'If no one reaches 270, the House picks the president, with each state delegation casting one vote.',
    ],
  },
]

export const lessonById = Object.fromEntries(LESSONS.map((l) => [l.id, l]))
