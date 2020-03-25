const EventEmitter = require('events');
const listener = new EventEmitter();

let balance = 1000;
let currentContract = 0;
let cycles = 0;

const round = x => Math.round(x, 2);
function status(price) {
  console.log(`${round(balance + currentContract)}, ${round(price)}`);
}

listener.on('stonk', ({ price }) => {
  cycles += 1;
  let purchaseBudget = balance * .80;
  // we're not holding an option right now, check if we should buy it.
  if (currentContract === 0) {
    if (price < purchaseBudget) {
      // buy the option;
      balance -= price;
      currentContract = price;
    }
  // check to see if we should sell it
  } else {
    // we stand to make literally any money
    if (price > currentContract) {
      // sell the option
      balance += price;
      currentContract = 0;
      cycles = 0;
    } else if (cycles > 10) {
      // sell the option if we've been holding it for too long
      balance += price;
      currentContract = 0;
      cycles = 0;
    }
  }

  status(price);
});


/**
 * Until we setup streaming with an actual options API, just randomly emit noise
 * for the bot to act upon.
 */

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

let stonk = { price: 500 };

async function run() {
  while(true) {
    // randomly the price random jump up to += $20 per second.
    const delta = Math.random() * 40 - 20;
    stonk.price += delta;
    listener.emit('stonk', stonk);
    await sleep(100);
  }
}

console.log('balance, price');
run();
