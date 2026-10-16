// The journey: four stages and the standard checklist behind each one.
//
// Every adult task that states a fact names the card it comes from, and the
// fact is the card's, not invented here. Child tasks and "life" tasks are
// suggestions, not claims, and carry no card. Nothing on this list records how
// anyone is coping: admin facts and ideas only (gate G5).
//
// `due` is days after the moving date. Negative is before the move.

export const STAGES = [
  {
    id: "home", n: 1, title: "Home", sub: "Where you are starting from",
    icon: "home", tint: "#F3D9C4",
  },
  {
    id: "prepare", n: 2, title: "Prepare the move", sub: "Papers, portals, packing",
    icon: "package", tint: "#DCE6F2",
  },
  {
    id: "arrive", n: 3, title: "Arrive and set up", sub: "The first weeks",
    icon: "key", tint: "#E0EDE4",
  },
  {
    id: "settle", n: 4, title: "Settle in", sub: "Months three to twelve",
    icon: "heart-handshake", tint: "#F4E6C9",
  },
];

export const STANDARD_TASKS = [
  // 1 · Home
  { id: "permit-know", stage: "home", audience: "adult", card: "card_003_partner_work_rights",
    title: "Find out which permit each of you will hold",
    detail: "It decides whether a partner may work, and what the German course rules are." },
  { id: "recognition", stage: "home", audience: "adult", card: "card_008_anerkennung",
    title: "Check whether your qualification needs recognition",
    detail: "Some jobs need it, many do not. Worth knowing before the job search." },
  { id: "kid-list", stage: "home", audience: "child",
    title: "Make a list of what you want to bring", detail: "Toys, books, the things that feel like home." },
  { id: "kid-goodbye", stage: "home", audience: "child",
    title: "Swap addresses with your friends", detail: "So you can send them a postcard from the new place." },

  // 2 · Prepare the move
  { id: "appointment", stage: "prepare", audience: "adult", due: -7, card: "card_002_appointment_that_does_not_exist",
    title: "Look for an Anmeldung appointment early",
    detail: "Check other districts too. Availability varies a lot between offices." },
  { id: "kita-early", stage: "prepare", audience: "adult", needsKidUnder: 6, card: "card_006_kita_place",
    title: "Register for a Kita place, before you arrive if you can",
    detail: "Waiting times run six to twelve months, so early matters." },
  { id: "insurance-read", stage: "prepare", audience: "adult", card: "card_004_health_insurance_choice",
    title: "Read up on statutory versus private health insurance",
    detail: "Switching back from private is hard. Decide with the facts in front of you." },
  { id: "kid-box", stage: "prepare", audience: "child",
    title: "Pack a box of your favourite things", detail: "It travels with you, not with the removal van." },
  { id: "kid-room", stage: "prepare", audience: "child",
    title: "Think about your new room", detail: "What colour? Where does the bed go?" },

  // 3 · Arrive and set up
  { id: "landlord", stage: "arrive", audience: "adult", due: 7, card: "card_001_anmeldung_chain",
    title: "Get the landlord's confirmation of moving in",
    detail: "The Wohnungsgeberbestätigung. The landlord has to give it to you." },
  { id: "anmeldung", stage: "arrive", audience: "adult", due: 14, card: "card_001_anmeldung_chain",
    title: "Register your address",
    detail: "Two weeks from moving in. Your tax number waits behind it." },
  { id: "insurance", stage: "arrive", audience: "adult", due: 30, card: "card_004_health_insurance_choice",
    title: "Choose your health insurance", detail: "The decision that is hard to reverse." },
  { id: "tax-class", stage: "arrive", audience: "adult", due: 60, card: "card_007_tax_class_one_earner",
    title: "Check your tax class", detail: "It matters most if a baby or a job change is coming." },
  { id: "school", stage: "arrive", audience: "adult", needsKidOver: 5, card: "card_018_school_without_the_language",
    title: "Ask about a school place and language support",
    detail: "What applies varies by state and district. Ask where you live." },
  { id: "kid-decorate", stage: "arrive", audience: "child",
    title: "Decorate your new room", detail: "Put up the things from your box." },
  { id: "kid-explore", stage: "arrive", audience: "child",
    title: "Find the nearest playground or park", detail: "Go with a grown-up and give it a score." },

  // 4 · Settle in
  { id: "licence", stage: "settle", audience: "adult", due: 182, card: "card_005_driving_licence_deadline",
    title: "Exchange your driving licence",
    detail: "Your licence from home works for six months after you take up residence." },
  { id: "course", stage: "settle", audience: "adult", due: 365, card: "card_016_integration_course",
    title: "Register for the German course",
    detail: "Within the first year of your permit, whether or not you feel ready." },
  { id: "fixture", stage: "settle", audience: "adult", card: "card_015_work_is_not_social",
    title: "Find one fixed weekly thing of your own",
    detail: "A course, a Verein, a regular evening. On a schedule, not left to chance." },
  { id: "talk", stage: "settle", audience: "adult", card: "card_012_one_thriving_one_not",
    title: "Put a regular, unremarkable check-in in the diary",
    detail: "What would make this worth it for both of you? Ask it often, not once." },
  { id: "kid-club", stage: "settle", audience: "child",
    title: "Try a club or a team", detail: "Football, music, drawing. One is enough." },
  { id: "kid-friend", stage: "settle", audience: "child",
    title: "Invite a new friend home", detail: "Ask a grown-up to help you plan it." },
];

// "Where are you right now?" in onboarding, mapped onto a stage.
export const WHERE_NOW = [
  { stage: "home", label: "Still at home, thinking it through" },
  { stage: "prepare", label: "The move is decided, we are preparing" },
  { stage: "arrive", label: "Just arrived, the first weeks" },
  { stage: "settle", label: "A few months in" },
];

// The corpus's card titles, for the inspector. Copied from content/cards on 28.09.2026.
export const CARD_TITLES = {
 "card_001": "Registering your address, and everything that waits behind it",
 "card_002": "When the appointment system shows nothing for weeks",
 "card_003": "Yes, you are allowed to work here",
 "card_004": "The health insurance decision is hard to reverse",
 "card_005": "Your licence stops working at six months, and it is not a fine",
 "card_006": "There is a legal right to a childcare place, and there may still not be one",
 "card_007": "Tax class when one of you is not working, and why it is not a saving",
 "card_008": "Getting your qualification recognised, and whether you even need to",
 "card_009": "The job search is taking longer than anyone told you",
 "card_010": "When the days have no shape",
 "card_011": "Feeling like you are not allowed to be unhappy about this",
 "card_012": "When one of you is thriving and the other is not",
 "card_013": "What actually helps, measured rather than assumed",
 "card_014": "Freund and Bekannte, and why you keep hitting a wall",
 "card_015": "Your colleagues are not going to become your social life",
 "card_016": "The German course, what you are entitled to and what you may be required to do",
 "card_017": "Your first friends here will probably leave",
 "card_018": "Starting school without the language, and what Schulpflicht means",
 "card_019": "How children actually do, and what makes the difference",
 "card_020": "When you need a person instead of this"
};
