import { useState } from 'react'
import { Card, CardHeader, CardBody, SectionTitle } from '../ui/index'

// ── DAILY LAWS DATA ────────────────────────────────────
const MONTHS = [
  {
    abbr: 'JAN', name: 'January', theme: 'Discover Your Calling', source: 'Mastery',
    summary: 'The entire month is about finding your Life\'s Task — the unique calling that was clearest when you were young. Greene argues that most people lose contact with this inner force under social pressure. January teaches you to reconnect with that original signal and build everything around it.',
    laws: [
      ['Jan 1',  'Discover Your Calling',          'You possess an inner force that seeks to guide you. It was clearer when you were a child.'],
      ['Jan 2',  'Reconnect with Childhood Obsession', 'Marie Curie at age 4, transfixed by laboratory instruments. You were obsessed for a real reason.'],
      ['Jan 7',  'Money and Success',              'Hyperintention kills results. Those who love the process make more money than those who love money.'],
      ['Jan 14', 'Avoid the False Path',           'A false path is attractive for the wrong reasons: status, money, approval. The emptiness compounds.'],
      ['Jan 20', 'See Mastery as Salvation',       'Your attempt at mastery is not just a career choice. It is existential — it is what gives your life meaning.'],
      ['Jan 31', 'The Source of All Power',        'Knowing who you are in a deep way is the foundation. Everything else — strategy, creativity — follows from this.'],
    ]
  },
  {
    abbr: 'FEB', name: 'February', theme: 'The Apprenticeship', source: 'Mastery',
    summary: 'The goal of an apprenticeship is not money, position, or title — it is the transformation of your mind and character. Most people rush through it chasing income instead of knowledge. February is entirely about learning to learn.',
    laws: [
      ['Feb 1',  'Submit to Reality',             'Enter the apprenticeship willing to be completely changed. The goal is transformation, not performance.'],
      ['Feb 3',  'You Have One Goal',             'Not money. Not position. The transformation of your mind and character is the only real prize of the early years.'],
      ['Feb 7',  'The Only Shortcut to Mastery',  'Find the right mentor. Ten years of trial and error compressed into two. The only legitimate shortcut.'],
      ['Feb 14', 'Move Toward Resistance',        'Practice what you are worst at. The path of least resistance produces only amateurs. Resistance is where growth lives.'],
      ['Feb 15', '10,000 Hours',                  'Quality practice time is the universal requirement for mastery in every domain. There is no substitute.'],
      ['Feb 24', 'Surpass Your Master',           'Poor is the apprentice who does not surpass his master. Absorb everything — then exceed it.'],
    ]
  },
  {
    abbr: 'MAR', name: 'March', theme: 'Creative Mastery', source: 'Mastery',
    summary: 'Creativity does not come from inspiration — it comes from deep immersion over time, combined with an active, exploring spirit. This month teaches how Masters actually think: obsessing over details, cultivating uncertainty, allowing intuition and analysis to merge.',
    laws: [
      ['Mar 1',  'Awaken the Dimensional Mind',   'The creative mind is not born — it emerges from deep knowledge combined with courage to explore beyond the known.'],
      ['Mar 9',  'Impatience Is Your Enemy',      'The creative process cannot be rushed. Impatience produces imitation and superficiality, never originality.'],
      ['Mar 14', 'Immerse in the Details',        'Leonardo spent hundreds of pages on gradations of shadow. Excellence does not live in the grand gesture.'],
      ['Mar 19', 'The Deadening Dynamic',         'Every field develops orthodoxies. Creative people break them. The new always comes from outside the accepted framework.'],
      ['Mar 25', 'Cultivate Negative Capability', 'The ability to live comfortably with uncertainty, without reaching for premature resolution, is the source of creative power.'],
      ['Mar 30', 'Fuse the Intuitive with the Rational', 'All Masters describe a point where intuition and analysis merge. Chess masters see fields of force.'],
    ]
  },
  {
    abbr: 'APR', name: 'April', theme: 'The 48 Laws of Power', source: 'The 48 Laws of Power',
    summary: 'Power operates according to laws that never change regardless of era. Most people are unaware of these laws and therefore subject to them. Understanding them does not make you Machiavellian — it makes you realistic about how social dynamics actually work.',
    laws: [
      ['Apr 1',  'Never Outshine the Master',         'Making superiors feel insecure is the fastest path to exile. Make those above you feel elevated.'],
      ['Apr 8',  'Master Your Emotional Responses',   'Anger and petulance are signs of helplessness, not power. The powerful stay calm because they choose to.'],
      ['Apr 9',  'Reputation Is the Cornerstone',     'Build it carefully, protect it fiercely. A strong reputation does your work before you arrive anywhere.'],
      ['Apr 10', 'Always Say Less Than Necessary',    'The more you say, the more common you appear. The less you say, the more powerful and mysterious you seem.'],
      ['Apr 25', 'Enter Action with Boldness',        'Timidity creates more danger than boldness. Mistakes made boldly are easily corrected — timidity cannot be undone.'],
      ['Apr 30', 'Never Appear Too Perfect',          'Appearing superior in all things stirs the most dangerous of human emotions: envy. Show some flaws.'],
    ]
  },
  {
    abbr: 'MAY', name: 'May', theme: 'Reading People', source: 'The Laws of Human Nature',
    summary: 'Most social problems come from misreading people. May teaches you to look beyond surfaces — to read character through patterns of behavior over time, not through self-presentation in any single moment.',
    laws: [
      ['May 3',  'Judge Behavior, Not Words',     'People say all kinds of things to justify themselves. What they do repeatedly, especially under pressure, is who they are.'],
      ['May 8',  'Look at Their Past',            'The most reliable predictor of future behavior is the pattern of past behavior. People change far less than they claim.'],
      ['May 13', 'Recognize Deep Narcissists',    'They present charm at first, then react with explosive rage to any challenge. Recognize the pattern early.'],
      ['May 17', 'Decipher the Shadow',           'Emphatic traits often conceal the opposite. The extremely nice person may harbor deep aggression.'],
      ['May 22', 'Determine Strength of Character', 'Weak character neutralizes all other good qualities. Test character under stress, not in comfort.'],
      ['May 30', 'Everyone Wants More Power',     'No one wants less power or control. Assuming otherwise leaves you naïve and constantly surprised.'],
    ]
  },
  {
    abbr: 'JUN', name: 'June', theme: 'Appearances & Influence', source: 'The 48 Laws of Power',
    summary: 'In the social realm, appearances are almost the entire reality. Managing how you appear is not deception — it is a fundamental social skill that every effective person develops.',
    laws: [
      ['Jun 2',  'Use Absence to Increase Respect', 'Too much presence makes you seem common. Absence creates mystery. The law of scarcity applies to people.'],
      ['Jun 3',  'Control Your Image',             'If you don\'t actively shape how people perceive you, others will do it for you — usually against your interests.'],
      ['Jun 15', 'The Art of Presence and Absence', 'Leaders must balance both. Too much presence = you seem like everyone else. Too little = people forget you.'],
      ['Jun 18', 'Never Reform Too Much at Once',  'Even necessary change meets fierce resistance. Move gradually. Maintain the surface of tradition.'],
      ['Jun 22', 'Control What You Reveal',        'Saying less than necessary makes you seem deeper. Let people fill the silence with favorable projections.'],
      ['Jun 25', 'Create an Air of Mystery',       'People are drawn to what they cannot fully understand. A hint of the inexplicable attracts far more interest.'],
    ]
  },
  {
    abbr: 'JUL', name: 'July', theme: 'Seduction & Influence', source: 'The Art of Seduction',
    summary: 'Seduction, as Greene defines it, is not primarily about romance. It is the art of entering someone\'s psychological world and making them want what you want them to want — without force, pressure, or argument.',
    laws: [
      ['Jul 1',  'See Through the Eyes of a Seducer', 'Seducers are never self-absorbed. Their gaze is outward — they study what people want and fear.'],
      ['Jul 2',  'Delay Satisfaction',             'The ability to withhold is the ultimate art of influence. What is denied becomes more desired than what is freely given.'],
      ['Jul 4',  'The Empathic Attitude',          'True influence begins with genuinely getting inside the other person\'s experience. You cannot move people you don\'t understand.'],
      ['Jul 14', 'Create Calculated Surprises',    'Familiarity and predictability kill attraction and influence. Deliberate surprise reawakens attention.'],
      ['Jul 20', 'Be a Source of Pleasure',        'Create an environment where people feel genuinely better around you. No one follows those who bring heaviness.'],
      ['Jul 27', 'Know When to Be Bold',           'Timidity creates awkwardness on both sides. At the decisive moment, boldness resolves all tension.'],
    ]
  },
  {
    abbr: 'AUG', name: 'August', theme: 'The Art of Persuasion', source: 'The Art of Seduction + The 33 Strategies',
    summary: 'The most effective persuaders never argue. They understand the emotional triggers, the self-interest, and the deep needs of their audience — and appeal to those directly, bypassing the resistance that argument always provokes.',
    laws: [
      ['Aug 5',  'Win Through Your Actions',       'Demonstrate, do not explain. A single clear action is worth a thousand words of argument.'],
      ['Aug 7',  'Consider Their Self-Interest',   'Self-interest is the strongest motive in human behavior. Show people clearly what is in it for them.'],
      ['Aug 8',  'Avoid Argument',                 'Argument invites counter-argument. It stiffens resistance. Find a way to change minds that doesn\'t feel like a fight.'],
      ['Aug 17', 'Persuade with a Light Touch',    'Humor and irony disarm resistance where direct logic fails. They lower defenses and create openness.'],
      ['Aug 21', 'The Master Motivator',           'The best leaders motivate indirectly — by creating situations where people motivate themselves.'],
      ['Aug 26', 'Appeal to Their Unrealized Greatness', 'Most people believe they are more than the world has let them be. Speak to that latent, better self.'],
    ]
  },
  {
    abbr: 'SEP', name: 'September', theme: 'The 33 Strategies of War', source: 'The 33 Strategies of War',
    summary: 'September is about strategic thinking — how to operate above the tactical level, manage conflict without ego, use time as a weapon, and position yourself so that the outcome is almost predetermined before any single battle begins.',
    laws: [
      ['Sep 1',  'Elevate Above the Battlefield',  'Most people live as tacticians — reacting to the immediate. The strategist sees the whole board from above.'],
      ['Sep 5',  'Place Yourself in Shih',         'Strategy is not a plan. It is positioning yourself so that you have more options than your opponent at every moment.'],
      ['Sep 6',  'Never Attack Head-On',           'Direct confrontation stiffens resistance. The indirect approach — flanking, diverting — is almost always faster.'],
      ['Sep 12', 'Time Is All You Have',           'Space can be recovered. Time never. Every hour wasted on trivialities is an irreversible loss.'],
      ['Sep 18', 'The Piecemeal Strategy',         'Great ambitions collapse when approached all at once. Build through small, consistent steps.'],
      ['Sep 29', 'Assume Formlessness',            'The highest form of strategy has no fixed pattern. Like water, it adapts its shape to the container.'],
    ]
  },
  {
    abbr: 'OCT', name: 'October', theme: 'The Laws of Human Nature', source: 'The Laws of Human Nature',
    summary: 'The primary law of human nature is that we deny having one. We think we are rational when we are mostly emotional. October systematically dismantles this illusion — exposing the biases, the shadow self, the grandiosity, the envy — that govern all of us without our awareness.',
    laws: [
      ['Oct 1',  'The Primary Law',                'The greatest irrationality of all is believing you are exempt from irrationality. We are all wired the same.'],
      ['Oct 7',  'Rationality — A Simple Definition', 'Rational people notice when emotions are infecting their thinking and deliberately correct for it. Irrational people don\'t notice.'],
      ['Oct 11', 'Beware the Fragile Ego',         'Envy is the ugliest human emotion. It masquerades as criticism and indignation — but its root is always comparison and insecurity.'],
      ['Oct 14', 'Confront Your Dark Side',        'The more morally perfect we appear on the surface, the denser our repressed shadow becomes. Integration is stronger than repression.'],
      ['Oct 24', 'Know How Little You Know',       'The wisest position is knowing the boundaries of your knowledge. Certainty almost always precedes catastrophic error.'],
      ['Oct 31', 'You Are the Obstacle',           'Your obstacles are not external circumstances. They are the walls your own mind has constructed — fears, self-deceptions, habits.'],
    ]
  },
  {
    abbr: 'NOV', name: 'November', theme: 'Mastering the Self', source: 'The Laws of Human Nature',
    summary: 'Understanding human nature is the first step. Mastering your own is the second — and far harder. November is about building the internal qualities that allow you to operate with clarity under pressure.',
    laws: [
      ['Nov 2',  'Keep Free of the Emotional Whirlpool', 'Others will constantly try to pull you into their dramas. Emotional autonomy is your greatest strategic asset.'],
      ['Nov 3',  'Increase Your Reaction Time',    'The longer you can delay reacting to provocation, the clearer your response. This pause is a trainable skill.'],
      ['Nov 5',  'Know Yourself Thoroughly',       'The Emotional Self thrives on your ignorance of it. The moment you see clearly how it operates, it loses its hold.'],
      ['Nov 9',  'Channel Your Grandiose Impulses', 'Grandiosity is energy, not a flaw. The direction you send it determines everything. Channel it — don\'t suppress it.'],
      ['Nov 16', 'Integrate the Shadow Side',      'Lincoln accepted his ambition and his capacity for cruelty. Integration made him compassionate and steel-spined simultaneously.'],
      ['Nov 30', 'Advance with a Sense of Purpose', 'In a world where most people are meandering, those with a clearly felt sense of mission carry a force multiplier.'],
    ]
  },
  {
    abbr: 'DEC', name: 'December', theme: 'Death, Time & The Sublime', source: 'Mastery + The Laws of Human Nature',
    summary: 'December is Greene\'s most philosophical month — a meditation on mortality, time, and what it means to live at full intensity. Those who confront death directly gain a clarity and urgency that permanently changes how they use their time.',
    laws: [
      ['Dec 3',  'Turn and Face Your Mortality',   'The awareness of death fills us with purpose and urgency. To avoid thinking about it is to live with less than full intensity.'],
      ['Dec 6',  'Alive Time or Dead Time?',       'Every moment is either used for growth or wasted. There is no neutral. Viktor Frankl chose alive time in a concentration camp.'],
      ['Dec 16', 'The Near-Death Experience',      'Proximity to death snaps everything into fierce clarity. We can manufacture this through deliberate meditation on mortality.'],
      ['Dec 18', 'Have a Sense of Urgency',        'Treat mortality as a continual deadline — not with anxiety, but with focused energy directed at what actually matters.'],
      ['Dec 27', 'Amor Fati',                      'Love your fate. Not merely endure what happens — love it. Every hardship is material. This is Nietzsche\'s formula for greatness.'],
      ['Dec 31', 'The Ultimate Freedom',           'He who has learned how to die has unlearned how to be a slave. Death awareness is the root of all genuine freedom.'],
    ]
  },
]

function MonthAccordion({ month, open, onToggle }) {
  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${open ? 'border-gold-2/30' : 'border-cream-3'}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-cream-2/50 transition-colors"
      >
        <div className={`w-11 h-11 rounded-lg flex items-center justify-center font-mono text-xs font-bold text-cream flex-shrink-0 transition-colors ${open ? 'bg-ink-2' : 'bg-ink-3'}`}>
          {month.abbr}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-serif text-xl font-bold text-ink leading-tight">{month.theme}</div>
          <div className="text-[11px] text-ink-4 mt-0.5">{month.name} · {month.source}</div>
        </div>
        <div className={`text-lg text-ink-4 transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-90 text-gold-2' : ''}`}>›</div>
      </button>

      {open && (
        <div className="border-t border-cream-3 px-5 pb-5 pt-4">
          <p className="text-sm text-ink-3 leading-relaxed mb-4 pb-4 border-b border-cream-3">{month.summary}</p>
          <div className="space-y-0">
            {month.laws.map(([date, title, desc]) => (
              <div key={date} className="flex gap-3 py-2.5 border-b border-cream-3/50 last:border-0">
                <span className="font-serif text-sm font-bold text-gold-2 w-10 flex-shrink-0 pt-0.5">{date}</span>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-ink-2 text-sm">{title}</span>
                  <span className="text-ink-4 text-sm"> — {desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── KNOWLEDGE SECTIONS ─────────────────────────────────
const KB_SECTIONS = [
  {
    id: 'system', label: '⚙️ System', title: 'The HiddenOS Execution Stack',
    content: [
      ['LAYER 1 — MACRO CONTEXT', 'CPI trend · Fed stance · DXY direction · VIX level · Geopolitical risk. Risk-off macro = extra confluence required on every long setup.'],
      ['LAYER 2 — HTF BIAS & POI (4H + 1H)', 'Is 4H bullish or bearish? Where are the 4H and 1H OBs, FVGs, iFVGs? These are your Points of Interest. You only trade FROM these zones, never in the middle of a range.'],
      ['LAYER 3 — LTF CONFIRMATION (15M + 5M)', 'Price arrived at your HTF POI. Watch 15M and 5M for ChoCh or BOS confirming that price is reacting. This is your trigger layer — do not act before this fires.'],
      ['LAYER 4 — EXECUTION (3M in-out candle)', 'Once 15M/5M confirms, drop to 3M. Wait for the candle that enters the LTF POI zone and closes back out. This is your precise entry trigger — not a moment before.'],
    ]
  },
  {
    id: 'pois', label: '📍 POIs', title: 'HTF Points of Interest',
    content: [
      ['Order Block (OB)', 'The last opposing candle before a strong impulsive displacement move. Institutions placed orders here. 4H OBs > 1H OBs. Must be untested — first return only.'],
      ['FVG (Fair Value Gap)', 'Three-candle pattern where a gap exists between candle 1 and candle 3 wicks. Price returns to fill this institutional imbalance. Mark on 4H and 1H.'],
      ['iFVG (Inverse FVG)', 'A FVG that was fully mitigated and price continued through it. The zone flips direction. Trapped institutional orders create the cleanest reversals.'],
      ['OTE — Optimal Trade Entry', 'The 0.50–0.705 Fibonacci retracement window. When a POI (FVG, OB, iFVG) sits inside this window, it is the highest-probability entry in the system.'],
    ]
  },
  {
    id: 'setups', label: '📋 Setups', title: 'Named Setup Library',
    content: [
      ['A+ — OB + FVG Confluence', 'OB and FVG overlap at the same level. Highest probability setup. HTF OB and FVG overlapping → LTF ChoCh/BOS → 3M in-out candle → full size entry.'],
      ['A+ — ChoCh on LTF at HTF POI', 'Price arrives at 4H or 1H POI. On 15M or 5M, a ChoCh occurs right at that HTF level — proving the institutional zone is actively working. The primary HiddenOS setup.'],
      ['A+ — ChoCh + FVG + EQ (70.5%)', 'Three confluences: structural shift + imbalance + Fibonacci OTE level. When all three align — that is the highest precision entry in the system.'],
      ['A — BOS + OB · ChoCh + OB', 'After BOS, price pulls back to the OB left by the displacement. Enter at the OB retest. Most frequent A-grade setup in the system.'],
      ['B — News Speculation / Reaction', 'Speculation (pre-news): 50% size, SL to BE before print. Reaction (post-news): wait for spike to exhaust, then ChoCh → BOS → 3M entry. Reaction is A-grade.'],
    ]
  },
  {
    id: 'rules', label: '⚠️ Rules', title: 'The 5 Non-Negotiable Rules',
    content: [
      ['1. 12:00 PM ET HARD STOP', 'Close TradingView. No exceptions. No "one more setup." Family time is protected by this rule, not by good trading performance.'],
      ['2. 3 LOSSES = SESSION OVER', 'Close everything immediately. Most catastrophic trading days begin with the 4th trade after 3 losses. Do not continue.'],
      ['3. 5-MINUTE PAUSE AFTER EVERY LOSS', 'Stand up. Leave the desk. Breathe. The next trade must be built fresh — not taken in reaction to the loss.'],
      ['4. REVENGE MODE = CLOSE THE APP', 'If you feel the urge to immediately re-enter after a loss, close TradingView. The account owes you nothing. Tomorrow is a new session.'],
      ['5. CHECKLIST INCOMPLETE = NO ENTRY', 'Zero exceptions. Ever. The checklist interrupts autopilot mode where all trading errors occur.'],
    ]
  },
  {
    id: 'risk', label: '🛡️ Risk', title: 'Risk Management Rules',
    content: [
      ['Max risk per trade', '0.25%–1% of account balance. Never exceed 1% on a single trade under any circumstances.'],
      ['Max daily loss', '2% of account. When this is hit → stop trading immediately. No exceptions. No "one more try."'],
      ['Max weekly loss', '4.5% of account. When this is hit → stop trading for the remainder of the week.'],
      ['Trade objective', '3–5R minimum. Close 80% of the position at target. Let the remaining 20% run with a BE stop.'],
      ['After a loss', 'Mandatory 5-minute break before reviewing any chart. After revenge impulse: mandatory 30-minute break.'],
      ['Stop loss rule', 'Never remove or move SL away from entry. SL is structural — not adjusted. Moving a stop = invalidating your original thesis.'],
      ['VIX above 25', 'Reduce all sizes by 50%. VIX above 35: flat on indices. Gold at POI only or no trade.'],
    ]
  },
  {
    id: 'fib', label: '📐 Fibonacci', title: 'Fibonacci Framework',
    content: [
      ['0.382 — Shallow retracement', 'Strong trend (T3 — 20–30% retracement). Enter near 0.382 with momentum confirmation.'],
      ['0.500 — Equilibrium', 'Mid-trend (T2). The balance point between buyers and sellers. First OTE entry level.'],
      ['0.618 — Golden Ratio', 'Primary institutional reversal level. Most statistical reversals occur here.'],
      ['0.705 — OTE Precision Level', 'Sits between 0.618 and 0.786. When price retraces to 0.705 AND a POI is present — this is the Optimal Trade Entry zone.'],
      ['0.786 — Maximum retracement', 'Weak trend (T1). SL goes below this level. Closing beyond it = trend likely invalid.'],
      ['How to apply OTE', 'Draw Fibonacci from impulse origin (A) to extreme (B). The 50%–70.5% window = your OTE. If a POI sits inside → wait for LTF trigger → A+ entry.'],
    ]
  },
]

export default function Knowledge() {
  const [activeSection, setActiveSection] = useState('system')
  const [openMonth, setOpenMonth]         = useState(null)
  const [activeTab, setActiveTab]         = useState('system')

  const tabs = [
    { id: 'system', label: '📚 System' },
    { id: 'dailylaws', label: '⚖️ Daily Laws' },
  ]

  return (
    <div className="fade-up">
      {/* Main tabs */}
      <div className="flex gap-2 mb-4">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full border text-[10px] font-mono font-bold uppercase tracking-widest transition-all
              ${activeTab === t.id ? 'bg-ink-2 border-ink-2 text-cream' : 'border-cream-3 text-ink-4 hover:border-gold-2/30 hover:text-gold-2'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── SYSTEM KNOWLEDGE ── */}
      {activeTab === 'system' && (
        <div className="space-y-4">
          {/* Section nav */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {KB_SECTIONS.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg border text-[10px] font-mono font-bold uppercase tracking-wide transition-all
                  ${activeSection === s.id ? 'bg-gold-2 border-gold-2 text-white' : 'border-cream-3 text-ink-4 hover:border-gold-2/30 hover:text-gold-2'}`}>
                {s.label}
              </button>
            ))}
          </div>

          {KB_SECTIONS.filter(s => s.id === activeSection).map(section => (
            <Card key={section.id}>
              <CardHeader title={section.title} />
              <CardBody className="space-y-0">
                {section.content.map(([title, body]) => (
                  <div key={title} className="py-4 border-b border-cream-3 last:border-0">
                    <div className="font-mono text-xs font-bold text-gold-2 uppercase tracking-widest mb-2">{title}</div>
                    <p className="text-sm text-ink-3 leading-relaxed">{body}</p>
                  </div>
                ))}
              </CardBody>
            </Card>
          ))}

          {/* Psychology rules card */}
          {activeSection === 'rules' && (
            <Card>
              <CardHeader title="Identity Statements" badge="READ DAILY" />
              <CardBody>
                {[
                  '"I am a professional trader. I follow my system every session."',
                  '"I do not need this trade to work. My edge plays out over 100 trades."',
                  '"A loss that followed the system is not a failure. It is the cost of doing business."',
                  '"I protect the account today so I can trade tomorrow."',
                  '"My family depends on my discipline — not my win rate on any given day."',
                ].map((s, i) => (
                  <div key={i} className="py-3 border-b border-cream-3 last:border-0">
                    <p className="text-sm font-serif italic text-ink-2">{s}</p>
                  </div>
                ))}
              </CardBody>
            </Card>
          )}
        </div>
      )}

      {/* ── DAILY LAWS ── */}
      {activeTab === 'dailylaws' && (
        <div className="space-y-3">
          <div className="card p-4 mb-2">
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold-2 mb-1">How to Use</div>
            <p className="text-sm text-ink-3 leading-relaxed">
              366 meditations from Robert Greene's complete body of work. One per day. Read one each morning and let it shape how you see the day. Tap any month to expand.
            </p>
          </div>

          {MONTHS.map(month => (
            <MonthAccordion
              key={month.abbr}
              month={month}
              open={openMonth === month.abbr}
              onToggle={() => setOpenMonth(openMonth === month.abbr ? null : month.abbr)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
