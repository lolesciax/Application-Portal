import React from 'react';
export default function FormField({ id, label, error, hint, optional, children, multiline, ...props }) {
  const Tag = multiline ? 'textarea' : 'input';
  const descriptionId = error || hint ? id + '-hint' : undefined;
  return <div className={`field ${error ? 'field-invalid' : ''}`}>
    <label htmlFor={id}>{label}{optional && <span>Optional</span>}</label>
    <div className={children ? 'field-control has-action' : 'field-control'}><Tag id={id} aria-invalid={error ? 'true' : undefined} aria-describedby={descriptionId} {...props} />{children}</div>
    {(error || hint) && <p className={error ? 'field-error' : 'field-hint'} id={descriptionId}>{error || hint}</p>}
  </div>;
}
