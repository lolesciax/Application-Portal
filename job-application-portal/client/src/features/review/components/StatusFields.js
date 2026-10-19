import { statuses } from '../utils/reviewFormatting';
import ReviewFieldError from './ReviewFieldError';
export default function StatusFields({
  id,
  status,
  update,
  inputProps,
  errors
}) {
  return <>
  <div className="review-field">
    <label htmlFor={id + '-status'}>Application status <span>Required</span></label>
    <select {...inputProps('status')} value={status.status} onChange={event => update('status', 'status', event.target.value)}>
      {Object.entries(statuses).map(([value, label]) => <option key={value} value={value}>
        {label}
      </option>)}
    </select>
    <ReviewFieldError id={id} field="status" errors={errors} />
  </div>
  <div className="review-field">
    <label htmlFor={id + '-adminNotes'}>Message to the applicant <span>
        {status.status === 'rejected' ? 'Required' : 'Optional'}
      </span></label>
    <textarea {...inputProps('adminNotes')} rows={5} value={status.adminNotes} placeholder={status.status === 'rejected' ? 'Share a clear, constructive reason for the decision.' : 'Add feedback or explain the next step.'} required={status.status === 'rejected'} onChange={event => update('status', 'adminNotes', event.target.value)} />
    <ReviewFieldError id={id} field="adminNotes" errors={errors} />
    <p className="review-helper">Only share notes intended for the applicant to read.</p>
  </div>
</>;
}
