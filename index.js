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
app.use(bodyParser.urlencoded({ extended: true, verify: (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8')
  }
} })); // support encoded bodies

app.post('/rebuild', (req, res) => {
  const { port, trigger_id } = req.body;

  if (!signature.isVerified(req)) {
    return res.sendStatus(404);
  }

  if (!port || !port.trim()) {
    ports = execSync('docker ps -f label=name=bungee --format \'{{.Ports}}\'');
    let options = [];

    ports = ports.toString().split(/(?:\r\n|\r|\n)/g);

    ports.forEach((item) => {
      options.push({ label: item, value: 'Low' })
    })

    const dialog = {
      token: process.env.SLACK_ACCESS_TOKEN,
      trigger_id,
      dialog: JSON.stringify({
        title: 'Submit a helpdesk ticket',
        callback_id: 'submit-ticket',
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
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))