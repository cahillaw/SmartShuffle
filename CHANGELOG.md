# Changelog

### [0.4.0] - 8/2/21
- Fixed a bug that caused first added to not select from the correct pool of tracks.
- Fixed a bug that caused songs near the center of playlists over 100 songs to be more likely to be queued than songs at the start or end.
- Fixed an issue that caused the site to load incorrectly when the Spotify API rate limit was hit.
- Fixed editing playlist order, previously the order would not be changed after hitting update.
- Renamed First Addded to First and Recently Added to Last to more accuratly portray what playlist order means.
- Internal improvements

### [0.3.1] - 10/9/20
- Added cookie banner
- Fixed a few misaligned buttons

### [0.3.0] - 10/3/20
- Mobile site is now live!
- Button names are now less verbose.
- Background color is now a light blue-grey, and the about page textbox background color is now white. (colors were swapped)
- Fixed a bug that caused playback state to not change when idle even when the user changed playback state. 

### [0.2.1] - 9/25/20
- Now playing now seamlessly moves to the next song when the current song ends.
- Fixed a bug that occasionally caused a song to fail to queue.
- Fixed a bug that broke logging in for new users.
- Fixed a bug that caused the new playlist accordion to collapse when submitting if invalid inputs were detected.

### [0.2.0] - 9/23/20
- Added site metadata, the site should now embed properly into external sites such as Facebook/Twitter/Discord/etc.
- Added page titles.
- If idle, SmartShuffle will now check your playback every 5 minutes instead of every 30 seconds. 
- Closing Edit Playlist Weights without making a change now resets changes.
- Added Auto-Detection for Queue Interval. This is not perfect, otherwise it would require making additional api calls, however the estimate should be pretty close in the vast majority of cases.
- Fixed a bug that caused Edit Playlist Weights to not work after editing a playlist.
- Fixed a bug that caused bad access tokens to used in certain cases. This resulted in the site thinking you did not have premium, forcing you to log out and log back in again.

### [0.1.3] - 9/21/20
- Fixed a bug that caused queuing to stop sometime after going idle.
- Fixed a bug that caused now playing to not update after skipping a song.

### [0.1.2] - 9/20/20 
- Reworked styling on login page, should now fit the screen regardless of screen size
- Added links to About, Privacy and Contact us to the login page.
- Updated navbar to support being linked from the login page. If not logged in, it will show login with Spotify and the SmartShuffle logo will link to the login page instead of home.

### [0.1.1] - 9/17/20
- Fixed a bug that defaulted new playlist's weight to 0 and new station's repeat limit to 0.
- Fixed a bug that would case SmartShuffle to think you didn't have premium after navigating from the about page.
- Fixed a bug that caused recently added to not work properly on playlists with greater than 200 songs.
- Fixed a bug that caused playlist edits to not be displayed. These edits were recorded properly, however you had to refresh the page to see them.
- Fixed a bug that prevented the progress bar from pausing after hiting the pause button. 
- If you are listening to a station, the skip button will now queue a song first before skipping. This was previously in the opposite order, which caused problems when there was no other songs in queue.
- Added a warning notifying users that SmartShuffle will not queue new tracks when your playback is paused.
- Idle timer improvements to hopefully stop music from either queuing not or queueing due to poorly timed pausing of playback.

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
