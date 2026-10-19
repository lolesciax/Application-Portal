import Modal from '../../components/Modal';
import Icon from '../../components/Icon';
import useApplicationReview from './hooks/useApplicationReview';
import { tabs, statuses, displayDate } from './utils/reviewFormatting';
import ReviewOverview from './components/ReviewOverview';
import InterviewFields from './components/InterviewFields';
import StatusFields from './components/StatusFields';
import DiscardChanges from './components/DiscardChanges';
export default function ApplicationReviewModal({
  application,
  onClose,
  onSaved
}) {
  const {
    id,
    titleId,
    descriptionId,
    info,
    name,
    section,
    interview,
    status,
    errors,
    error,
    saving,
    pendingAction,
    keepButton,
    heading,
    body,
    tabButtons,
    dirty,
    formId,
    resumeUrl,
    changeSection,
    requestClose,
    keepEditing,
    discardChanges,
    keyboardTab,
    update,
    save,
    inputProps
  } = useApplicationReview(application, onClose, onSaved);
  return <Modal title="Application details" labelledBy={pendingAction ? id + '-discard-title' : titleId} describedBy={pendingAction ? id + '-discard-description' : descriptionId} onClose={requestClose} dismissible={!saving} className="application-review">
  <div className="review-shell" hidden={!!pendingAction}>
    <header className="review-header">
      <div className="review-title-row">
        <div>
          <p className="review-eyebrow">APPLICATION REVIEW</p>
          <h2 id={titleId} ref={heading} tabIndex={-1} data-modal-autofocus>Review application</h2>
          <p id={descriptionId}>Review the applicant, arrange an interview, or share a decision.</p>
        </div>
        <button type="button" className="review-close" onClick={requestClose} disabled={saving} aria-label="Close application details">&times;</button>
      </div>
      <div className="review-applicant">
        <span className="review-avatar" aria-hidden="true">
          {name.split(' ').map(part => part[0]).slice(0, 2).join('')}
        </span>
        <div>
          <strong>
            {name}
          </strong>
          <span>{info.position || 'Applicant'} &middot; Submitted {displayDate(application.submittedAt)}</span>
        </div>
        <span className={'review-status status-' + application.status}>
          {statuses[application.status] || application.status}
        </span>
      </div>
      <div className="review-tabs" role="tablist" aria-label="Application review sections">
        {tabs.map((tab, index) => <button type="button" key={tab.id} ref={element => {
            tabButtons.current[tab.id] = element;
          }} role="tab" id={id + '-tab-' + tab.id} aria-controls={id + '-panel-' + tab.id} aria-selected={section === tab.id} tabIndex={section === tab.id ? 0 : -1} onKeyDown={event => keyboardTab(event, index)} onClick={() => changeSection(tab.id)} disabled={saving}>
          <Icon name={tab.icon} size={18} />
          {tab.label}
        </button>)}
      </div>
    </header>
    <div ref={body} className="review-body" role="tabpanel" id={id + '-panel-' + section} aria-labelledby={id + '-tab-' + section} aria-busy={saving}>
      {error && <div className="review-alert" role="alert">
        <strong>Changes were not saved.</strong>
        <p>{error} Your entries are still here.</p>
      </div>}
      {Object.values(errors).some(Boolean) && <p className="review-validation-summary" role="alert">Check the highlighted fields, then try again.</p>}
      {section === 'overview' ? <ReviewOverview application={application} info={info} name={name} resumeUrl={resumeUrl} /> : <form id={formId} onSubmit={save} noValidate>
        <fieldset disabled={saving} className="review-fieldset">
          <div className="review-section-intro">
            <h3>
              {section === 'interview' ? application.interviewSchedule?.date ? 'Update interview details' : 'Plan the next conversation.' : 'Keep the applicant informed.'}
            </h3>
            <p>
              {section === 'interview' ? 'The applicant will see the date, time, location, and notes in their dashboard.' : 'Choose the current status and add helpful feedback. Notes are visible to the applicant.'}
            </p>
          </div>
          {section === 'interview' ? <InterviewFields id={id} interview={interview} update={update} inputProps={inputProps} errors={errors} /> : <StatusFields id={id} status={status} update={update} inputProps={inputProps} errors={errors} />}
        </fieldset>
      </form>}
    </div>
    <footer className="review-footer">
      <p aria-live="polite">
        {saving ? 'Saving your changes...' : dirty ? 'You have unsaved changes.' : section === 'overview' ? 'Review at your own pace.' : 'Changes are shared only when saved.'}
      </p>
      <div>
        <button type="button" className="review-secondary" disabled={saving} onClick={requestClose}>Close</button>
        {section === 'overview' ? <button type="button" className="review-primary" onClick={() => changeSection('interview')}>Schedule interview <Icon name="arrow" size={16} /></button> : <button type="submit" form={formId} className="review-primary" disabled={saving} aria-busy={saving}>
          {saving ? 'Saving...' : section === 'interview' ? 'Save interview' : 'Save status'}
          <Icon name="check" size={17} />
        </button>}
      </div>
    </footer>
  </div>
  {pendingAction && <DiscardChanges id={id} pendingAction={pendingAction} keepButton={keepButton} keepEditing={keepEditing} discardChanges={discardChanges} />}
</Modal>;
}
