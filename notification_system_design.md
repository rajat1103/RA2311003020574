# Notification System Design

## Introduction

This system is used to send notifications to users like emails, SMS, or app notifications. It helps users stay updated about important events such as login alerts, transactions, or reminders.

---

## Types of Notifications

* Email
* SMS
* Push Notifications

---

## Basic Flow

1. User performs an action
2. Backend receives request
3. Notification request is added to a queue
4. Notification service processes it
5. Message is sent using external APIs

---

## Why Queue is Used

Queue is used to handle large number of requests efficiently.
It makes the system faster and prevents failure during heavy load.

---

## Database (Basic Idea)

We can store:

* Notification ID
* User ID
* Type
* Message
* Status (sent/failed)

---

## Retry Mechanism

If notification fails, system retries 2–3 times.
If still fails, it is marked as failed.

---

## Advantages

* Scalable
* Reliable
* Faster processing
* Easy to maintain

---

## Conclusion

This is a simple notification system design using queue-based approach.
It can handle large number of users and can be extended further if needed.
