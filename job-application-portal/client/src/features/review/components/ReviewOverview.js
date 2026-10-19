import Icon from '../../../components/Icon';
import { displayDate } from '../utils/reviewFormatting';
export default function ReviewOverview({
  application,
  info,
  name,
  resumeUrl
}) {
  return <>
  <section className="review-section">
    <div className="review-section-heading">
      <Icon name="user" />
      <h3>Applicant details</h3>
    </div>
    <div className="review-details-table-wrap">
      <table className="review-details-table">
        <caption className="review-sr-only">Applicant contact and personal details</caption>
        <tbody>
          <tr>
            <th scope="row">Full name</th>
            <td>{name}</td>
          </tr>
          <tr>
            <th scope="row">Email address</th>
            <td>
              {info.email || application.user?.email ? <a href={'mailto:' + (info.email || application.user.email)}>
                {info.email || application.user.email}
              </a> : 'Not provided'}
            </td>
          </tr>
          <tr>
            <th scope="row">Phone number</th>
            <td>
              {info.phone ? <a href={'tel:' + info.phone}>
                {info.phone}
              </a> : 'Not provided'}
            </td>
          </tr>
          <tr>
            <th scope="row">Date of birth</th>
            <td>{displayDate(info.dateOfBirth)}</td>
          </tr>
          <tr>
            <th scope="row">Address</th>
            <td>{info.address || 'Not provided'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
  <section className="review-resume">
    <span className="review-document-icon">
      <Icon name="file" size={25} />
    </span>
    <div>
      <h3>Resume / CV</h3>
      <p>
        {application.resume?.originalName || 'No resume attached'}
      </p>
    </div>
    {resumeUrl && <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="review-secondary">Open resume <span className="review-sr-only">in a new tab</span><Icon name="arrow" size={16} /></a>}
  </section>
  <section className="review-section">
    <div className="review-section-heading">
      <Icon name="clock" />
      <h3>Latest updates</h3>
    </div>
    {application.interviewSchedule?.date ? <div className="review-existing-interview">
      <strong>{displayDate(application.interviewSchedule.date)} at {application.interviewSchedule.time}</strong>
      <p>
        {application.interviewSchedule.location}
      </p>
      {application.interviewSchedule.notes && <p>
        {application.interviewSchedule.notes}
      </p>}
    </div> : <p className="review-helper">No interview has been scheduled yet.</p>}
    {application.adminNotes && <div className="review-existing-notes">
      <span>Notes shared with the applicant</span>
      <p>
        {application.adminNotes}
      </p>
    </div>}
  </section>
</>;
}
