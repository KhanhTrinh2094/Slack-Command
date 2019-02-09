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

app.use(function (req, res, next) {
  var data = "";
  req.on('data', function (chunk) { data += chunk })
  req.on('end', function () {
    req.rawBody = data;
    next();
  })
});
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.post('/rebuild', (req, res) => {
  code = execSync('node -v');

  const { port, trigger_id } = req.body;

  if (!signature.isVerified(req)) {
    return res.sendStatus(404);
  }

  if (!port || !port.trim()) {
    const dialog = {
      token: process.env.SLACK_ACCESS_TOKEN,
      trigger_id,
      dialog: JSON.stringify({
        title: 'Submit a helpdesk ticket',
        callback_id: 'submit-ticket',
        submit_label: 'Submit',
        elements: [
          {
            label: 'Title',
            type: 'text',
            name: 'title',
            hint: '30 second summary of the problem',
          },
          {
            label: 'Description',
            type: 'textarea',
            name: 'description',
            optional: true,
          },
          {
            label: 'Urgency',
            type: 'select',
            name: 'urgency',
            options: [
              { label: 'Low', value: 'Low' },
              { label: 'Medium', value: 'Medium' },
              { label: 'High', value: 'High' },
            ],
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
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))