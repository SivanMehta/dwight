const EventEmitter = require('events');
const listener = new EventEmitter();

let balance = 800;
let buyBudget = 600;

listener.on('stonk', stonk => {
  console.log(stonk);
});


/**
 * Until we setup streaming with an actual options API, just randomly emit noise
 * for the bot to act upon.
 */

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  while(true) {
    // randomly have a price between $550 and $650.
    const price = 600 + (Math.random() * 100 - 100);
    listener.emit('stonk', { price });
    await sleep(1000);
  }
}

run();
