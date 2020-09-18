# Changelog

### [0.1.1] - 9/17/20
- Fixed a bug that defaulted new playlist's weight to 0 and new station's repeat limit to 0.
- Fixed a bug that would case SmartShuffle to think you didn't have premium after navigating from the about page.
- Fixed a bug that caused recently added to not work properly on playlists with greater than 200 songs.
- Fixed a bug that caused playlist edits to not be displayed. These edits were recorded properly, however you had to refresh the page to see them.
- Fixed a bug that prevented the progress bar from pausing after hiting the pause button. 
- If you are listening to a station, the skip button will now queue a song first before skipping. This was previously in the opposite order, which caused problems when there was no other songs in queue.
- Added a warning notifying users that SmartShuffle will not queue new tracks when your playback is paused.

### [0.1.0] - 9/16/20
- Added about page.
- Added privacy policy.
- Added changelog to the site.
- Added contact us.
- Reworked the main navbar, content is now centered.

### [0.0.1] - 9/12/20

- Added changelog.
- Added an idle timer that will cause the site to stop making now playing API requests after 5 minutes of inactivity.
- Local tracks are now displayed in now playing correctly.
- Fixed a bug with edit playlist weights that caused an error to always appear, rendering the feature unusable.

### [0.0.0] - 9/11/20

- Site is now live at smartshuffle.io
