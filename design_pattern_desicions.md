## Restricting Access
It is clear that anybody can read our contract's state. In this application, we have tried as much as possible not to store any sensitive data in the contract's state. Notwithstanding, users of our application need access to the contract's state and they need to do it in the right way so as not to corrupt our business logic.

#### Situation 1:

To implement access restriction, we have made use of modifiers in `UserProfileManager.sol`, so that

  - Only the root admin - the contract deployer & owner - can update it's own profile
  - Only the root admin can create and update new admin profiles
  - Only admins can create shop owner profiles
  - Only admins and shop owners can update product details

#### Situation 2:

To implement access restriction, we have made use of modifiers in `PurchaseManager.sol`, so that

  - Only the shop owners can withdraw funds

## Withdrawal Pattern
This is highly common when our contract tries to send funds to an address that requests a withdraw. The address could very well be another contract address which, when called, creates another withdraw order. This will invariably swipe all the funds out of the account in no time. 


## Circuit Breaker
It can happen that bugs are discovered after our contract has been deployed. To emit any continous risk, should a buggy contract be discovered, the root admin of this app has the power to stop functions in any sole-standing contract that was deployed. The admin can toggle `toggleContractActive()` which helps trigger modifiers that effectuate the contract's updated stance.