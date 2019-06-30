## Restricting Access
It is clear that anybody can read our contract's state. In this application, we have tried as much as possible not to store any sensitive data in the contract's state. Notwithstanding, users of our application need access to the contract's state and they need to do it in the right way so as not to corrupt our business logic.

#### Situation 1:

To implement access restriction, we have made an extensive use of modifiers in `UserProfileManager.sol` and it's base contracts, so that

  - Only the root admin - the contract deployer & owner - can update it's own profile
  - Only the root admin can create and update new admin profiles
  - Only admins can create shop owner profiles
  - Only admins and shop owners can update product details