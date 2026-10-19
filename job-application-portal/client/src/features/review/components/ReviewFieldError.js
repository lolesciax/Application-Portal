export default function ReviewFieldError({
  id,
  field,
  errors
}) {
  return errors[field] ? <p className="review-field-error" id={id + '-' + field + '-error'}>
  {errors[field]}
</p> : null;
}
