import Icon from '../../../components/Icon';
import PersonalDetails from './PersonalDetails';
import ResumeUpload from './ResumeUpload';
export default function ApplicationEditor({
  application,
  submitting,
  loadFailed,
  retrying,
  validationErrors,
  formData,
  resumeFile,
  resumeInput,
  handleChange,
  handleFileChange,
  handleSubmit,
  removeResume
}) {
  return <section className="workspace-card application-editor" aria-labelledby="application-title">
  <div className="workspace-card-header">
    <div>
      <h2 id="application-title">
        {application ? 'Your application' : 'Get your application ready.'}
      </h2>
      <p>
        {application ? 'Keep your details up to date for the hiring team.' : 'Your profile is filled in. Review it and add your resume.'}
      </p>
    </div>
    <span className="workspace-card-icon">
      <Icon name="file" />
    </span>
  </div>
  <form onSubmit={handleSubmit} noValidate>
    <fieldset disabled={submitting || loadFailed || retrying} className="workspace-fieldset">
      <PersonalDetails formData={formData} handleChange={handleChange} validationErrors={validationErrors} />
      <ResumeUpload application={application} resumeFile={resumeFile} resumeInput={resumeInput} handleFileChange={handleFileChange} removeResume={removeResume} validationErrors={validationErrors} />
      <div className="workspace-submit-bar">
        <p>
          {application ? 'Changes are shared with the hiring team when saved.' : 'Review your details before sending your application.'}
        </p>
        <button type="submit" className="workspace-primary" disabled={submitting || loadFailed}>
          {submitting ? 'Saving application...' : application ? 'Save changes' : 'Submit application'}
          <Icon name="arrow" size={16} />
        </button>
      </div>
    </fieldset>
  </form>
</section>;
}
