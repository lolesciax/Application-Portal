import Icon from '../../../components/Icon';

const cardIcon = { total: 'user', pending: 'clock', interviews: 'calendar', hired: 'check', 'hire-rate': 'arrow' };
const filterFor = key => key === 'total' ? 'all' : key === 'interviews' ? 'interview_scheduled' : key;

export default function HiringSummary({ summaryCards, onSelectStatus }) {
  return <section className="admin-overview-metrics" aria-label="Hiring metrics">
    <div className="admin-section-intro"><h2>Overview</h2><span className="admin-section-aside">Current recruitment activity</span></div>
    <div className="stats-grid">
      {summaryCards.map(card => <article key={card.key} className={`summary-card ${card.className}`}>
        <div className="metric-top"><span className="summary-label" id={`metric-${card.key}`}>{card.label}</span><span className="summary-icon" aria-hidden="true"><Icon name={cardIcon[card.key] || 'grid'} size={17} /></span></div>
        <strong className="summary-value">{card.value}</strong>
        <p className="summary-caption">{card.caption}</p>
        {card.key !== 'hire-rate' && <button type="button" className="admin-summary-link" onClick={() => onSelectStatus(filterFor(card.key))} aria-label="View applications" aria-describedby={`metric-${card.key}`}><span className="metric-action-text">View applications</span><Icon name="arrow" size={16} /></button>}
      </article>)}
    </div>
  </section>;
}
