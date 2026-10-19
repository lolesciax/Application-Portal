export default function PersonalDetails({
  formData,
  handleChange,
  validationErrors
}) {
  const field = (name, label, props = {}) => <div className="workspace-field">
  <label htmlFor={name}>
    {label}
  </label>
  <input id={name} name={name} value={formData[name] || ''} onChange={handleChange} aria-invalid={validationErrors[name] ? 'true' : undefined} aria-describedby={validationErrors[name] ? name + '-error' : undefined} {...props} />
  {validationErrors[name] && <p className="workspace-field-error" id={name + '-error'}>
    {validationErrors[name]}
  </p>}
</div>;
  return <div className="workspace-form-section" id="personal-details">
  <div className="form-section-title">
    <span>01</span>
    <div>
      <h3>Personal details</h3>
      <p>Help the team get to know you.</p>
    </div>
  </div>
  <div className="workspace-form-grid">
    {field('firstName', 'First name *', {
        autoComplete: 'given-name'
      })}
    {field('lastName', 'Last name *', {
        autoComplete: 'family-name'
      })}
    {field('email', 'Email address *', {
        type: 'email',
        autoComplete: 'email'
      })}
    {field('phone', 'Phone number *', {
        type: 'tel',
        inputMode: 'numeric',
        maxLength: 11,
        minLength: 11,
        pattern: '[0-9]{11}',
        autoComplete: 'tel',
        placeholder: '09123456789'
      })}
    {field('dateOfBirth', 'Date of birth (optional)', {
        type: 'date'
      })}
    {field('position', 'Role or specialization (optional)', {
        placeholder: 'e.g. Software Engineer'
      })}
    <div className="workspace-field wide">
      <label htmlFor="address">Address (optional)</label>
      <textarea id="address" name="address" value={formData.address} onChange={handleChange} rows={2} autoComplete="street-address" placeholder="City, province, or current address" />
    </div>
  </div>
</div>;
}
