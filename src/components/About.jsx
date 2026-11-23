import { useEffect, useRef } from 'react'
import { UPDATED } from '../data/field.js'
import { IS_DESKTOP } from '../lib/desktop.js'
import { Icon } from './Sprites.jsx'

/* global __APP_VERSION__ */
const VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev'
const CONTACT = 'https://github.com/donyon67k'

const SOURCES = [
  ['Candidate filings and campaign finance', 'Federal Election Commission', 'https://www.fec.gov/data/'],
  ['Debate schedule, rules and primary calendar', 'Democratic National Committee and Republican National Committee announcements', 'https://democrats.org/'],
  ['Primary polls', 'Each pollster’s published release, linked poll by poll', null],
  ['Candidate status (running, considering, not running)', 'The person’s own public statements, as reported by national news organizations; every status links its source', null],
  ['Coverage measurement', 'Story counts across thousands of U.S. and international news outlets', null],
  ['Electoral votes', 'U.S. Census Bureau 2020 apportionment', 'https://www.census.gov/data/tables/2020/dec/2020-apportionment-data.html'],
  ['2024 presidential results', 'State certified results', null],
  ['Map shapes', 'U.S. Census Bureau cartographic boundaries', 'https://www.census.gov/geographies/mapping-files.html'],
]

export default function About({ open, onClose }) {
  const panel = useRef(null)
  useEffect(() => { if (open) panel.current?.focus() }, [open])
  if (!open) return null
  return (
    <div className="cmd-backdrop" onMouseDown={onClose}>
      <div className="about" role="dialog" aria-label="About" tabIndex={-1} ref={panel}
        onMouseDown={(e) => e.stopPropagation()} onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); onClose() } }}>
        <div className="about-head">
          <Icon name="radar" size={36} />
          <div>
            <h2 className="pixel glow">PROJECT: 2028</h2>
            <div className="dim">v{VERSION}{IS_DESKTOP ? ' · desktop' : ' · web'} · field last reviewed {UPDATED}</div>
          </div>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <section className="intel-block">
          <h4 className="pixel">▣ WHAT THIS IS</h4>
          <p className="brief">
            Project: 2028 is an independent, nonpartisan tracker for the 2028 U.S. presidential election: who is running,
            who is weighing it, how they are polling, how the nomination contests work and, later, the race to 270. It is built
            to be a reference you can check: every claim about a candidate links to where it came from.
          </p>
        </section>

        <section className="intel-block">
          <h4 className="pixel">▣ STANDARDS</h4>
          <ul className="credits">
            <li><b>Status needs a source.</b> No one is marked as running, considering or out without a public statement or a filing.</li>
            <li><b>Hard data first.</b> Filings, official schedules and published polls come before commentary. News is shown as headlines linked to the original outlet.</li>
            <li><b>No picks.</b> The attention index measures coverage and polling, not merit or likelihood of winning. Its full formula is explained in the Briefing Room.</li>
            <li><b>Corrections.</b> Mistakes are fixed as soon as they are found, and the field is reviewed regularly.</li>
          </ul>
        </section>

        <section className="intel-block">
          <h4 className="pixel">▣ SOURCES</h4>
          <ul className="credits">
            {SOURCES.map(([what, who, url]) => (
              <li key={what}><b>{what}</b>: {url ? <a href={url} target="_blank" rel="noreferrer">{who}</a> : who}</li>
            ))}
          </ul>
        </section>

        <section className="intel-block">
          <h4 className="pixel">▣ DISCLAIMER</h4>
          <p className="brief">
            Not affiliated with any campaign, party, pollster, news organization or government agency. Polls are the pollsters’ own
            published numbers. Nothing here is an official result; official results come from each state’s election office.
          </p>
          <p className="brief dim">
            {IS_DESKTOP
              ? 'Privacy: no accounts, analytics or tracking. Settings stay on your device.'
              : 'Privacy: no accounts and no cookies. The site counts anonymous page views; nothing identifies you.'}
            {' '}Contact: <a href={CONTACT} target="_blank" rel="noreferrer">github.com/donyon67k</a>
          </p>
        </section>
      </div>
    </div>
  )
}
