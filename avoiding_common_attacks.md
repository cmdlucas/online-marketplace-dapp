## Integer Overflow and Underflow
Care has been taken to use `enums` rather than `uint` in order to achieve consistency for different user types. I'm only making use of `integers` when hard value is needed. In such cases I check to ensure that the values are within range.

## DoS Attack
It is clear that gas is gold in ethereum. You always have a limit; once this limit is exceeded, execution comes to a halt. This benefit can be exploited by hackers to prevent our executions from even running at all. This Denial of Service can occur through functions that loop forever. To prevent this, we set a range of 25 maximum items per set returned by each retrieve function.

#### Todo: 
Improve the contracts to minimize looping by emitting searchable indices after each transaction/message call so that we only loop on the front-end.

## Re-entrancy attack
I avoided this by ensuring that all balances are set to **zero** before `address.transfer()` is called within a function.
