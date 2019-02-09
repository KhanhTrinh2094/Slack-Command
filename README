## Setup

### Create a Slack app

1. Create an app at [https://api.slack.com/apps](https://api.slack.com/apps)
2. Add a Slash command (See *Add a Slash Command* section below)
3. Navigate to **Bot Users** and click "Add a Bot User" to create one.
4. Enable Interactive components (See *Enable Interactive Components* below)
5. Navigate to the **OAuth & Permissions** page and make sure the following scopes are pre-selected:
    * `commands`
    * `bot`
6. Click 'Save Changes' and install the app (You should get an OAuth access token after the installation)

#### Add a Slash Command
1. Go back to the app settings and click on Slash Commands.
1. Click the 'Create New Command' button and fill in the following:
    * Command: `/rebuild`
    * Request URL: Your server or Glitch URL + `/command`
    * Short description: `Create a helpdesk ticket`
    * Usage hint: `[the problem you're having]`

If you did "Remix" on Glitch, it auto-generate a new URL with two random words, so your Request URL should be like: `https://fancy-feast.glitch.me/command`. 


#### Enable Interactive Components
1. Go back to the app settings and click on Interactive Components.
1. Set the Request URL to your server or Glitch URL + `/interactive`.
1. Save the change.


### Set Your Credentials

1. Set the following environment variables to `.env` (see `.env.sample`):
    * `SLACK_ACCESS_TOKEN`: Your bot token, `xoxb-` (available on the **OAuth & Permissions** once you install the app)
    * `SLACK_SIGNING_SECRET`: Your app's Signing Secret (available on the **Basic Information** page)
2. If you're running the app locally, run the app (`npm start`). Or if you're using Glitch, it automatically starts the app.

#### Run the app 

1. Get the code
    * Clone this repo and run `npm install`
2. Set the following environment variables to `.env` (see `.env.sample`):
    * `SLACK_ACCESS_TOKEN`: Your bot token, `xoxb-` (available on the **OAuth & Permissions** once you install the app)
    * `SLACK_SIGNING_SECRET`: Your app's Signing Secret (available on the **Basic Information** page)
3. If you're running the app locally, run the app (`npm start`).

If you want to run it locally, I recommend creating a localhost tunnel with [ngrok](https://ngrok.com)!