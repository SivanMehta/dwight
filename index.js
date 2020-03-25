const EventEmitter = require('events');
const listener = new EventEmitter();

// This contract is worth $10
let option = 10;
// Be willing to spend up to 90% of your balance at once, ideally would be a 
// sigmoid of past performance, but set constant for now. Going greater than
// your current balance allows us to continue to act in bear markets.
const aggression = .9;

// start with enough money to buy 1 aggressive option, which is an option * 100;
// let balance = (option * 100 * aggression) + 1;

// start with enough money to qualify for pattern day trader status
let balance = 25000;

let currentContract = null;
let cycles = 0;

function round(x) {
  return Math.floor(x * 100) / 100;
}
function status(price) {
  const contractPrice = currentContract === null ? 0 :
    (currentContract.strike * currentContract.amount * 100);
  console.log(`${round(balance + (contractPrice))}, ${round(price * 100)}`);
}

// Determine the amount of contracts I can buy, given current price, balance,
// and rate of aggression. 
function sale(price) {
  return {
    strike: price,
    amount: Math.floor(balance * aggression / (price * 100))
  };
}

function act (price) {
  cycles += 1;
  let purchaseBudget = balance * aggression;
  // we're not holding an option right now, check if we should buy it.
  if (currentContract === null) {
    if (0 < price && (price * 100) < purchaseBudget) {
      // make the sale
      const contract = sale(price);
      balance -= (contract.strike * contract.amount * 100);
      currentContract = contract;
    }
  // check to see if we should sell it
  } else {
    // we stand to make at least a dollar
    if ((price * 100) > (currentContract.strike * 100) + 1) {
      // sell the option
      balance += (price * 100) * currentContract.amount;
      currentContract = null;
      cycles = 0;
    } else if (cycles > 3) {
      // sell the option if we've been holding for more than 3 cycles, sell
      // everything for cash
      balance += (price * 100) * currentContract.amount;
      currentContract = null;
      cycles = 0;
    }
  }

  status(price);
}

async function run() {
  // 2340 cycles, or the number of seconds in a NYSE trading day / 10
  for(let i = 0; i < 2340; i ++) {
    // randomly the price random jump up to += $.50 per cycle, but never less
    // less than $0.
    option += (Math.random() - .5);
    option = Math.max(option, 0);
    act(option);
  }
}

console.log('worth, price');
run();
