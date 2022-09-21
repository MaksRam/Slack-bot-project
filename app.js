const { App, LogLevel } = require("@slack/bolt");

const { WebClient } = require("@slack/web-api");

const { toBeTagged, arrayWithMarks } = require("./hei");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  // socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  logLevel: LogLevel.DEBUG,
  // Socket Mode doesn't listen on a port, but in case you want your app to respond to OAuth,
  // you still need to listen on some port!
  port: process.env.PORT || 3000,
});

const Knex = require("knex");

const knexConfig = {
  client: "mysql2",
  version: "8.0",
  connection: {
    host: "localhost",
    user: "root",
    password: "password",
    database: "leaderboard",
  },
};

const knex = Knex(knexConfig);

const TABLE = "leaders";

const d = new Date();
let day = d.getDay();

console.log(day)

async function fetchThreads(channelId, ts) {
  try {
    const result = await app.client.conversations.replies({
      token: "xoxb-4008992160930-4022023858305-WQlICJrZWgLpDBGvsudUDoTJ",
      channel: channelId,
      ts: ts,
      limit: 1000,
    });

    threadsHistory = result.messages;

    return threadsHistory;
  } catch (error) {
    console.error(error);
  }
}

// fetchThreads("C040FTBLNSX", "1662973113.816339");

async function postMessage(channelId) {
  try {
    const timeNow = Date.now().toString().split("").slice(0, 10);
    const getTime = parseInt(timeNow.join(""));
    console.log("Start");

    const checkThreads = await fetchThreads("C040FTBLNSX", "1662973113.816339");

    console.log(checkThreads);

    for (el of checkThreads) {
      if (el.bot_id && (getTime - el.ts) > 86400)
      {
        await app.client.chat.postMessage({
          channel: channelId,
          thread_ts: "1662973113.816339",
          text: `
        :rotating_light: Hey! <@${toBeTagged}> Pay attention on this incidents, please! :rotating_light:
        :clock3:
        )} has passed!`,
        });
        break;
    }}
    console.log("End");
  } catch (error) {
    console.error(error);
  }
}

postMessage("C040FTBLNSX");

async function replyMessage(id, ts) {
  try {
    // Call the chat.postMessage method using the built-in WebClient
    const result = await app.client.chat.postMessage({
      // The token you used to initialize your app
      token: "xoxb-4008992160930-4022023858305-WQlICJrZWgLpDBGvsudUDoTJ",
      channel: id,
      thread_ts: ts,
      text: "<@U0408RXL459> Hello again :wave:",
      blocks: [
        {
          type: 'section',
          text: { type: 'mrkdwn', text: ':rotating_light: Pay attention, please! :rotating_light:' },
          fields: [
            { type: 'mrkdwn', text: '<@U0408RXL459>' },
          ]
        }
      ],
      //You could also use a blocks[] array to send richer content
    });

    // Print result
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
}

// Uses a known channel ID and message TS
replyMessage("C040FTBLNSX", "1662973113.816339");

//Channel you want to post the message to
const channelId = "C040FTBLNSX";

function secondsToDhms(seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor((seconds % (3600 * 24)) / 3600);
  var m = Math.floor((seconds % 3600) / 60);

  var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes") : "";
  return dDisplay + hDisplay + mDisplay;
}

function getMessageTime(num) {
  const x = parseInt(num.toString().split("").slice(0, 10).join(""));
  return x;
}

async function fetchHistory(channelId) {
  try {
    const timeNow = Date.now().toString().split("").slice(0, 10);
    const getTime = parseInt(timeNow.join(""));

    // Call the conversations.history method using the built-in WebClient
    const result = await app.client.conversations.history({
      // The token you used to initialize your app
      token: "xoxb-4008992160930-4022023858305-WQlICJrZWgLpDBGvsudUDoTJ",
      channel: channelId,
      limit: 1000,
      oldest: getTime - 1209600,
      latest: getTime,
    });

    conversationHistory = result.messages;

    let input1d = [];

    for (el of conversationHistory) {
      if (getTime - el.ts < 400800) {
        input1d.push(el);
      }
    }

 console.log(input1d)
 console.log(arrayWithMarks)

console.log(conversationHistory.length)

//  const arrayWithTicks = input1d.filter(
//   (e) =>
//     arrayWithMarks.includes((e.reactions.name)) &&
//     e.reactions.length === 1)

//     console.log(arrayWithTicks)

    let arrayWithReactions = conversationHistory.filter(
      (message) => message.reactions
    );

  const arrayWithTicks = arrayWithReactions.filter(
    (e) =>
    arrayWithMarks.includes(e.reactions[0].name))

    // return match;
    //   // Print results
  } catch (error) {
    console.error(error);
  }
}

fetchHistory('C040FTBLNSX')

async function addingIn() {
  let data = await fetchHistory('C040FTBLNSX')
  await knex (TABLE)
  .insert ({
    user: data[0],
    team: data[1],
    count: data[2]
  })

  console.log(data)
}

addingIn()

async function leaderBoard(channelId) {
  try {
    const timeNow = Date.now().toString().split("").slice(0, 10);
    const getTime = parseInt(timeNow.join(""));

    // Call the conversations.history method using the built-in WebClient
    const result = await app.client.conversations.history({
      // The token you used to initialize your app
      token: "xoxb-4008992160930-4022023858305-WQlICJrZWgLpDBGvsudUDoTJ",
      channel: channelId,
      limit: 1000,
      oldest: getTime - 604800,
      latest: getTime,
    });

    const getUsers = [];

    conversationHistory = result.messages;

    let arrayWithReactions = conversationHistory.filter(
      (message) => message.reactions
    );

    const arrayWithEyes = arrayWithReactions.filter(
      (e) => e.reactions[0].name === "eyes" && e.reactions.length === 1
    );

    // console.log(arrayWithEyes);

    for (el of arrayWithEyes) {
      getUsers.push(el.reactions[0].users);
    }

    const finalResult = [].concat(...getUsers);
    // console.log(finalResult)

    const count = {};

    for (let elem of finalResult) {
      if (count[elem] === undefined) {
        count[elem] = 1;
      } else {
        count[elem]++;
      }
    }
    const sortable = Object.fromEntries(
      Object.entries(count).sort(([,a],[,b]) => b-a)
  );

  console.log(sortable)

 let values22 =  Object.values(sortable)

 console.log(values22)

  const leaders = Object.keys(sortable)

  console.log(leaders);

    return sortable;
    //   // Print results
  } catch (error) {
    console.error(error);
  }
}

leaderBoard("C040FTBLNSX");

async function getInfo(userId) {
  try {
    // Call the users.info method using the WebClient
    const result = await app.client.users.info({
      user: userId
    });

    const userName = result.user.real_name;

    console.log(userName);

    return userName;
  }
  catch (error) {
    console.error(error);
  }};

  // getInfo('U040616HS5T')

  const today = '1662554880';

  async function winners() {
  try {
    console.log("Start");

    let xray = await leaderBoard("C040FTBLNSX");

    console.log(xray)

     let values22 =  Object.values(xray)

 console.log(values22)

  const leaders = Object.keys(xray)

  console.log(leaders);

    if(leaders.length === 1) {

      const firstPlace = await getInfo(leaders[0]);

      await app.client.chat.scheduleMessage({
        channel: channelId,
        text: `
        :first_place_medal: ${firstPlace} with ${values22[0]} reactions!
        `,
        // Time to post message, in Unix Epoch timestamp format
        post_at: today
      });

    } else if(leaders.length === 2) {

      const firstPlace = await getInfo(leaders[0]);
      const secondPlace = await getInfo(leaders[1]);

      await app.client.chat.scheduleMessage({
        channel: channelId,
        text: `
        :first_place_medal: ${firstPlace} with ${values22[0]} reactions!
        :second_place_medal: ${secondPlace} with ${values22[1]} reactions!
        `,
        // Time to post message, in Unix Epoch timestamp format
        post_at: today
      });

    } else {

      const firstPlace = await getInfo(leaders[0]);
      const secondPlace = await getInfo(leaders[1]);
      const thirdPlace = await getInfo(leaders[2]);

      await app.client.chat.scheduleMessage({
        channel: channelId,
        text: `
        :first_place_medal: ${firstPlace} with ${values22[0]} reactions!
        :second_place_medal: ${secondPlace} with ${values22[1]} reactions!
        :third_place_medal: ${thirdPlace} with ${values22[2]} reactions!
        `,
        // Time to post message, in Unix Epoch timestamp format
        post_at: today
      });

    }

    console.log("End");

  } catch (error) {
    console.error(error);
  }
}

winners();

async function message() {
  try {
    const res = await fetchHistory("C040FTBLNSX");

    const array = [];
    const f = [];
    const message_id = [];

    for (el of res) {
      array.push(el.ts.split(""));
    }

    for (el of array) {
      const index = 10;
      el.splice(index, 1); // 2nd parameter means remove one item only
      f.push(el);
    }

    for (el of f) {
      message_id.push(el.join(""));
    }

    console.log(message_id.length)

async function postMessage() {
  try {
    console.log("Start");

    const timeNow = Date.now().toString().split("").slice(0, 10);
    const getTime = parseInt(timeNow.join(""));

    for (let i = 0; i < message_id.length; i++) {
      await app.client.chat.scheduleMessage({
        channel: channelId,
        text: `
    :rotating_light: Hey! Pay attention on this incidents, please! :rotating_light:

    :clock3: ${secondsToDhms(
      getTime - getMessageTime(message_id[i])
    )} has passed! :clock3:

    https://channelpolice-y4f8930.slack.com/archives/C040FTBLNSX/p${
      message_id[i]
    }`,
        // Time to post message, in Unix Epoch timestamp format
        post_at: getTime + 120,
      });

      console.log("End");
    }
  } catch (error) {
    console.error(error);
  }
}

postMessage();
  } catch (error) {
    console.error(error);
  }
}

message();

const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);

fetchHistory("C040FTBLNSX")

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
  })();
