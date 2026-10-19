import Icon from '../../../components/Icon';
export default function ResumeUpload({
  application,
  resumeFile,
  resumeInput,
  handleFileChange,
  removeResume,
  validationErrors
}) {
  return <div className="workspace-form-section" id="resume-section">
  <div className="form-section-title">
    <span>02</span>
    <div>
      <h3>Resume &amp; documents</h3>
      <p>Upload your resume or CV. Maximum file size: 5 MB.</p>
    </div>
  </div>
  <div className="resume-upload-box">
    <Icon name="upload" size={26} />
    <strong>
      {resumeFile ? resumeFile.name : application?.resume ? application.resume.originalName : 'Add your resume'}
    </strong>
    <p>
      {resumeFile ? (resumeFile.size / 1024).toFixed(0) + ' KB - Ready to upload' : application?.resume ? 'Saved with your application. Choose another file to replace it.' : 'PDF, DOC, DOCX, JPG, or PNG'}
    </p>
    <label className="resume-file-button" htmlFor="resume-upload">
      {application?.resume || resumeFile ? 'Choose a different file' : 'Choose a file'}
      <input ref={resumeInput} id="resume-upload" type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={handleFileChange} aria-describedby="resume-help" />
    </label>
    <small id="resume-help">Selecting a file does not submit your application.</small>
    {resumeFile && <button className="resume-remove" type="button" onClick={removeResume}>Remove selected file</button>}
  </div>
  {validationErrors.resume && <p className="workspace-field-error" role="alert">
    {validationErrors.resume}
  </p>}
</div>;
}
