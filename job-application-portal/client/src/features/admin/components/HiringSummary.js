import Icon from '../../../components/Icon';
export default function HiringSummary({
  summaryCards,
  onSelectStatus
}) {
  return <section className="stats-grid">
  {summaryCards.map(card => <article key={card.key} className={`summary-card ${card.className}`}>
    <span className="summary-icon" aria-hidden="true">
      <Icon name={card.key === 'total' ? 'user' : card.key === 'pending' ? 'clock' : card.key === 'interviews' ? 'calendar' : card.key === 'hired' ? 'check' : 'arrow'} size={17} />
    </span>
    <span className="summary-label">
      {card.label}
    </span>
    <strong className="summary-value">
      {card.value}
    </strong>
    <p className="summary-caption">
      {card.caption}
    </p>
    {card.key !== 'hire-rate' && <button type="button" className="admin-summary-link" onClick={() => onSelectStatus(card.key === 'total' ? 'all' : card.key === 'interviews' ? 'interview_scheduled' : card.key)}>View applications<Icon name="arrow" size={13} /></button>}
  </article>)}
</section>;
}
