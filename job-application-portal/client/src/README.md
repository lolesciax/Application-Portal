# Application Portal frontend modules

- `pages/`: route-level composition and page-specific styles.
- `features/admin/`: application queue, hiring overview, summary, navigation, and pipeline.
- `features/applicant/`: application editor, personal details, resume upload, status sidebar, and application loading/submission.
- `features/review/`: accessible review dialog, interview/status fields, discard confirmation, and review state.
- `features/auth/`: cancellable username/email availability checks.
- `services/`: authentication and application HTTP requests; these use the existing configured Axios client.
- `components/`: shared primitives such as Modal, FormField, Icon, and WorkspaceHeader. ApplicationReviewModal remains a compatibility entry point.
- `utils/`: shared names, status labels, and validation rules.

Keep stateful loading, validation, and mutations in feature hooks. Keep sections focused on rendering and user actions. Queue filtering/sorting/pagination lives in useApplicationQueue; hiring totals and interview lists are derived in hiringOverview.

DashboardExperience.css imports dashboard/Layout.css, dashboard/VisualIdentity.css, then dashboard/Pages.css. Preserve that order: shared layout and visual identity precede the page-specific module experiences. Review dialog styles are owned by features/review/styles and imported through the existing stylesheet entry point. Shared palette and typography tokens remain in styles/PortalIdentity.css.

Verification: `npm --prefix client test -- --watchAll=false --runInBand` and `npm --prefix client run build` from the application root. Use mocked API responses for browser checks to avoid modifying real applicant records.

## Navigable modules

Admin routes: /admin-dashboard (priorities and next actions), /admin-dashboard/applications (search/review), /admin-dashboard/pipeline (candidate stage board and interview agenda).
Applicant routes: /engineer-dashboard (progress/status) and /engineer-dashboard/application (personal details, resume and submission).

The route-level workspace owns loading, draft state, notices, and review-modal state. Child screens receive this through Outlet context so switching modules preserves applicant edits. Admin queue filters and pagination are stored in URL search parameters for direct links and refresh.
