require('dotenv').config();

const express = require('express');
const app = express();
const axios = require('axios');
const qs = require('querystring');
const signature = require('./verify-signature');
const execSync = require('child_process').execSync;
const port = 20300;
const bodyParser = require('body-parser');
const apiUrl = 'https://slack.com/api';

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
  extended: true, verify: (req, res, buf, encoding) => {
    if (buf && buf.length) {
      req.rawBody = buf.toString(encoding || 'utf8')
    }
  }
})); // support encoded bodies

app.post('/rebuild', (req, res) => {
  const { text, trigger_id } = req.body;
  const port = text;

  if (!signature.isVerified(req)) {
    console.log('Token mismatch');
    return res.sendStatus(404);
  }

  if (!port || !port.trim()) {
    ports = execSync('docker ps -f label=name=bungee --format \'{{.Ports}}\'');
    let options = [];

    ports = ports.toString().split(/(?:\r\n|\r|\n)/g);

    ports.forEach((item) => {
      if (item) {
        options.push({ label: 'http://spvn.simplypost.asia:' + item.split(':')[1].split('-')[0], value: item.split(':')[1].split('-')[0] })
      }
    })

    const dialog = {
      token: process.env.SLACK_ACCESS_TOKEN,
      trigger_id,
      dialog: JSON.stringify({
        title: 'Rebuild Test Site',
        callback_id: 'rebuild-test-site',
        submit_label: 'Submit',
        elements: [
          {
            label: 'Site',
            type: 'select',
            name: 'site',
            options: options,
          },
        ],
      }),
    };

    // open the dialog by calling dialogs.open method and sending the payload
    axios.post(`${apiUrl}/dialog.open`, qs.stringify(dialog))
      .then((result) => {
        console.log('dialog.open:' + JSON.stringify(result.data));
        res.send('');
      }).catch((err) => {
        console.log('dialog.open call failed: ' + JSON.stringify(err));
        res.sendStatus(500);
      });
  } else {
    axios.post(`${process.env.JENKINS_URL}&Port=${port}&User=${req.body.user_name}`, {});
  }
})

app.post('/interactive', (req, res) => {
  const body = JSON.parse(req.body.payload);

  // check that the verification token matches expected value
  if (signature.isVerified(req)) {
    console.log(`Form submission received: ${body.submission.site}`);

    // immediately respond with a empty 200 response to let
    // Slack know the command was received
    res.send('');

    if (body.submission.site) {
      axios.post(`${process.env.JENKINS_URL}&Port=${body.submission.site}&User=${body.user.name}`, {});
    }
  } else {
    console.log('Token mismatch');
    res.sendStatus(404);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))