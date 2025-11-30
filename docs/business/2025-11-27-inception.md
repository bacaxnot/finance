# Motivation

I want to create this app because I'm tired of having to manually track my finance and have it scattered all over the place.
So we'll use me as the inception user to solve his needs.

## Use cases / needs

- I want to be able to see all my money movements accross all of my accounts in a single list.
- I want to see the complete financial picture of my assets (cash that i have, current debts, and money people owe me)
- I want to be able to track the payments of money people owe me, as well as set interest rates to those loans
- I should be able to see at any point in time the exact amount of money i have in any bank account i have
- I should be able to track my credit cards also, and see how much money i owe on the credit card and how much money I pay in interests
- I want to be able to upload a bank statement and the system should be able to extract the information using AI and create the transactions from the file

## Current setup

- Bancolombia bank account: That's were I receive my salary and most of my money is, and most day to day transactions happen
- Nubank: This bank accounts give me interes rate for holding the money, so each month I send some amount of money to save there. I also have a CDT there, because interest rate is higher.
- Nequi: I use it very ocassionally, when I need to
- RappiAccount: I hold there a fixed amount of money to have access to cashbback in RappiCard
- RappiCard: That's my main credit card, I use it as a daily debit card and it gives me cashback. I don't need to pay interst if purchases are paid within 1 month
- Loans: I've lend money to Adriana, Cristian, my mom, my aunt, my cousin and Maria Alejandra. Adriana has a dynamic interest rate yet to set, Cristian has a fixed interst rate, the other loans have no interest rate at all.

## Initial models for this

1. User -> Represents a person that uses the platform
2. AuthIdentity -> An identity a user can take to authenticate to the platform
3. BankAccount / LedgerAccount -> Represents a bank account, but
