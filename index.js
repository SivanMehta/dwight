const EventEmitter = require('events');
const listener = new EventEmitter();

let stonk = { price: 500 };
// be willing to spend up to 90% of your balance at once, ideally would be a 
// sigmoid of past performance, but set constant for now.
const aggression = .9;

// start with enough money to buy 1 option;
let balance = (stonk.price / aggression) + 1;

let currentContract = 0;
let cycles = 0;

const round = Math.round;
function status(price) {
  console.log(`${round(balance + currentContract)}, ${round(price)}`);
}

function act (price) {
  cycles += 1;
  let purchaseBudget = balance * aggression;
  // we're not holding an option right now, check if we should buy it.
  if (currentContract === 0) {
    if (price < purchaseBudget) {
      // make the sale;
      balance -= price;
      currentContract = price;
    }
  // check to see if we should sell it
  } else {
    // we stand to make at least a dollar
    if (price > currentContract + 1) {
      // sell the option
      balance += price;
      currentContract = 0;
      cycles = 0;
    } else if (cycles > 3) {
      // sell the option if we've been holding it for more than 5 cycles
      balance += price;
      currentContract = 0;
      cycles = 0;
    }
  }

  status(price);
}

/**
 * Until we setup streaming with an actual options API, just randomly emit noise
 * for the bot to act upon.
 */

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  // 10,000 cycles
  for(let i = 0; i < 10000; i ++) {
    // randomly the price random jump up to += $20 per second, but not
    // overall worth less than $0.
    const delta = Math.random() * 40 - 20;
    stonk.price += delta;
    stonk.price = Math.max(stonk.price, 0);
    act(stonk.price);
  }
}

console.log('balance, price');
run();
