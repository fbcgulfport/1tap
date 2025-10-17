# Event tracking report

This document lists all PostHog events used.

## Events by File

### src/app/login/page.tsx

- **login_redirect_initiated**: Fired when the user is automatically redirected to a social login provider from the login page.

### src/app/(admin)/LogoutButton.tsx

- **user_logged_out**: Triggered when a user clicks the logout button to sign out of their account.

### src/app/(admin)/edit/EditPageContent.tsx

- **link_created**: Fired when a user successfully creates a new link within a category.
- **link_updated**: Fired when a user successfully saves changes to an existing link.
- **link_deleted**: Fired when a user confirms and deletes an existing link.
- **category_created**: Fired when a user successfully creates a new link category.

### src/components/TrackableLink.tsx

- **trackable_link_clicked**: Fired when a user clicks on a trackable link.

### src/components/LinkCard.tsx

- **link_card_clicked**: Fired when a user clicks on a link card to navigate to the link's URL.

### src/components/ui/dialog.tsx

- **dialog_opened**: Fired when a user clicks the dialog trigger to open a dialog.
- **dialog_closed**: Fired when a user closes a dialog by clicking a close button, the 'X' icon, or the overlay.
