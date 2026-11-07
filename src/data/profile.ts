/**
 * Everything you read on the page lives in this one file.
 * Replace the plain placeholder lines with your own facts.
 * Specific details (month and year of each attempt, what you changed,
 * firm or articleship name, a real photo) are what make a portfolio feel like yours.
 */
export const profile = {
  name: 'Anubhav',
  role: 'Chartered Accountant',
  qualified: 'Qualified on the second attempt',

  // Put a file in /public (for example public/photo.jpg) and set this to '/photo.jpg'.
  // Leave it empty to hide the photo.
  photo: '',

  about:
    'I turn financial complexity into clear decision-making. My work blends audit discipline, tax clarity, and practical reporting so businesses can move forward with confidence.',

  stamp: { top: 'Attempt 02', main: 'Qualified', bottom: 'Chartered Accountant' },

  journey: {
    eyebrow: 'Journal',
    title: 'Built through learning',
    intro: 'Each stage sharpened my approach: stronger fundamentals, sharper revision, and better execution under pressure.',
    entries: [
      {
        ref: 'Attempt 01',
        title: 'First attempt',
        effort: 'Built my foundation through self-study, but without a consistent structure and focused revision plan.',
        result: 'Did not clear.',
      },
      {
        ref: 'In between',
        title: 'What changed',
        effort: 'I rebuilt my preparation around a realistic study plan, deeper concept clarity, mock practice, and disciplined revision cycles.',
        result: 'I learned exactly where I was losing marks and how to fix it.',
      },
      {
        ref: 'Attempt 02',
        title: 'Second attempt',
        effort: 'Focused preparation, stronger exam strategy, and a more disciplined execution model.',
        result: 'Qualified as a Chartered Accountant.',
        key: true,
      },
    ],
    close: {
      ref: 'By balance c/d',
      title: 'Carried forward',
      line: 'One setback, one comeback, and a stronger professional foundation.',
    },
  },

  skills: {
    eyebrow: 'Chart of accounts',
    title: 'What I work on',
    items: [
      { sym: 'Σ', title: 'Audit', note: 'Statutory, internal, and process-focused audit support.' },
      { sym: '%', title: 'Taxation', note: 'Income tax, GST, TDS, and filing compliance.' },
      { sym: '₹', title: 'Financial reporting', note: 'Financial statements, Ind AS understanding, and reporting clarity.' },
      { sym: '=', title: 'Accounting', note: 'Bookkeeping, reconciliations, and structured financial records.' },
      { sym: '§', title: 'Compliance', note: 'ROC filings, regulatory requirements, and governance support.' },
      { sym: 'Δ', title: 'Analysis', note: 'MIS, variance review, budget tracking, and business insights.' },
    ],
  },

  highlights: {
    eyebrow: 'Value proposition',
    title: 'Why I add value',
    items: [
      { title: 'Detail-oriented', note: 'I focus on accuracy, consistency, and disciplined execution in every financial review and filing.' },
      { title: 'Business-minded', note: 'My work connects compliance with clarity so decisions become easier for founders and teams.' },
      { title: 'Reliable under pressure', note: 'I stay structured, calm, and solution-first when deadlines and numbers both matter.' },
    ],
  },

  contact: {
    eyebrow: 'Closing entry',
    title: 'Connect',
    openTo: 'Open to audit, taxation, and finance opportunities.',
    rows: [
      { label: 'Email', value: 'anubhav.finance@email.com', href: 'mailto:anubhav.finance@email.com' },
      { label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
      { label: 'LinkedIn', value: 'linkedin.com/in/anubhav-ca', href: 'https://linkedin.com/in/anubhav-ca' },
    ],
  },

  resume: {
    label: 'Download résumé',
    href: '/anubhav-ca-resume.txt',
  },
};
