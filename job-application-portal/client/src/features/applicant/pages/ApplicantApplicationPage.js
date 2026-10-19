import { useOutletContext } from 'react-router-dom';
import ApplicationEditor from '../components/ApplicationEditor';
import ApplicantHeading from '../components/ApplicantHeading';
import Icon from '../../../components/Icon';

export default function ApplicantApplicationPage() {
  const model = useOutletContext();
  const resumeReady = Boolean(model.resumeFile || model.application?.resume);
  return <>
    <ApplicantHeading
      title="My application"
      user={model.user}
      application={model.application}
      nextStep="Review your information, keep your resume current, and save your changes securely."
      stage={model.stage}
    />
    <section className="application-preflight" aria-labelledby="application-checklist-title">
      <div className="preflight-intro">
        <span className="module-action-eyebrow">BEFORE YOU SUBMIT</span>
        <h2 id="application-checklist-title">Your application checklist</h2>
        <p>Make sure both sections are complete, then use the save button below.</p>
      </div>
      <div className="preflight-checks">
        <a href="#personal-details" className={model.contactReady ? 'complete' : ''}>
          <Icon name="check" size={15} /><span>Contact details<strong>{model.contactReady ? 'Complete' : 'Needs attention'}</strong></span>
        </a>
        <a href="#resume-section" className={resumeReady ? 'complete' : ''}>
          <Icon name="check" size={15} /><span>Resume / CV<strong>{resumeReady ? 'Attached' : 'Required'}</strong></span>
        </a>
      </div>
    </section>
    <div className="applicant-editor-module"><ApplicationEditor {...model} /></div>
  </>;
}
