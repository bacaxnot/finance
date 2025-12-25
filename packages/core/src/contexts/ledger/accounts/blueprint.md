* Name: Naive Bank Account
* Description: An aggregate modeling in a very naive way a personal bank account. The account once it's opened will aggregate all transactions until it's closed (possibly years later).
* Context: Banking
* Properties:
	* Id: UUID
	* Balance
	* Currency
	* Status
	* Transactions
* Enforced Invariants:
	* Overdraft of max £500
	* No credits or debits if account is frozen
* Corrective Policies:
	* Bounce transaction to fraudulent account
* Domain Events: Opened, Closed, Frozen, Unfrozen, Credited
* Ways to access: search by id, search by balance