import Icon from '../../../components/Icon';
export default function DiscardChanges({
  id,
  pendingAction,
  keepButton,
  keepEditing,
  discardChanges
}) {
  return <section className="review-discard" role="alertdialog" aria-modal="true" aria-labelledby={id + '-discard-title'} aria-describedby={id + '-discard-description'}>
  <span className="review-discard-icon">
    <Icon name="file" size={28} />
  </span>
  <h2 id={id + '-discard-title'}>Leave your changes behind?</h2>
  <p id={id + '-discard-description'}>Your edits have not been saved. You can keep editing, or discard them {pendingAction === 'close' ? 'and close this review.' : 'to switch sections.'}</p>
  <div>
    <button ref={keepButton} type="button" className="review-primary" onClick={keepEditing}>Keep editing</button>
    <button type="button" className="review-secondary" onClick={discardChanges}>Discard changes</button>
  </div>
</section>;
}
