import { localDate } from '../utils/reviewFormatting';
import ReviewFieldError from './ReviewFieldError';
export default function InterviewFields({
  id,
  interview,
  update,
  inputProps,
  errors
}) {
  return <>
  <div className="review-form-grid">
    <div className="review-field">
      <label htmlFor={id + '-date'}>Interview date <span>Required</span></label>
      <input {...inputProps('date')} type="date" value={interview.date} min={localDate()} onChange={event => update('interview', 'date', event.target.value)} required />
      <ReviewFieldError id={id} field="date" errors={errors} />
    </div>
    <div className="review-field">
      <label htmlFor={id + '-time'}>Time <span>Required</span></label>
      <input {...inputProps('time')} type="time" value={interview.time} onChange={event => update('interview', 'time', event.target.value)} required />
      <ReviewFieldError id={id} field="time" errors={errors} />
    </div>
  </div>
  <div className="review-field">
    <label htmlFor={id + '-location'}>Location or meeting link <span>Required</span></label>
    <input {...inputProps('location')} type="text" value={interview.location} placeholder="Office address or video meeting link" onChange={event => update('interview', 'location', event.target.value)} required />
    <ReviewFieldError id={id} field="location" errors={errors} />
  </div>
  <div className="review-field">
    <label htmlFor={id + '-notes'}>Interview instructions <span>Optional</span></label>
    <textarea {...inputProps('notes')} rows={4} value={interview.notes} placeholder="What should the applicant prepare or bring?" onChange={event => update('interview', 'notes', event.target.value)} />
  </div>
</>;
}
