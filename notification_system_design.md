# Notification System Design

---

## Stage 1

### REST APIs

1. GET /notifications

* Fetch all notifications for a user

2. POST /notifications

* Create a new notification

3. PUT /notifications/{id}/read

* Mark notification as read

---

### Sample Request

{
"userId": 101,
"type": "Placement",
"message": "Company hiring"
}

---

### Sample Response

{
"id": "abc123",
"status": "sent"
}

---

### Headers

Authorization: Bearer token

---

### Real-time Notifications

For real-time updates, WebSockets can be used so users receive notifications instantly without refreshing.

---

## Stage 2

I would use PostgreSQL as the database because it is reliable and handles structured data well.

### Table: notifications

* id (primary key)
* userId
* type
* message
* isRead
* createdAt

### Issues with large data

* Queries become slow
* High load on database

### Solutions

* Add indexes on important columns
* Partition data by date
* Use caching (Redis)

---

## Stage 3

### Problem in given query

SELECT * is inefficient because it fetches unnecessary data.
Also there is no indexing on studentID and isRead.

### Improved Query

SELECT id, message, createdAt
FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt DESC;

### Index

CREATE INDEX idx_notifications
ON notifications(studentID, isRead, createdAt DESC);

### Index on every column?

No, it increases memory usage and slows down insert operations.

### Query for placement notifications in last 7 days

SELECT DISTINCT studentID
FROM notifications
WHERE type = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';

---

## Stage 4

Problem: Notifications are fetched on every page load, causing DB overload.

### Solutions

* Use caching (Redis)
* Implement pagination (limit & offset)
* Lazy loading
* Store recent notifications in cache

### Tradeoff

* Cache needs invalidation
* Extra memory is required

---

## Stage 5

### Problems in current approach

* Sequential processing is slow
* If email fails, whole flow is affected
* No retry mechanism

### Improved Design

Use message queue (Kafka or RabbitMQ)

### New Flow

1. Save notification in DB
2. Push event to queue
3. Worker processes queue and sends email

### Benefits

* Faster
* Fault tolerant
* Retry mechanism possible

---

## Stage 6

### Logic

Priority is based on:

* Placement > Result > Event
* Recent notifications first

### Approach

1. Fetch notifications using API
2. Assign weights:

   * Placement = 3
   * Result = 2
   * Event = 1
3. Sort by weight (descending)
4. If same weight → sort by latest timestamp
5. Return top 10

### Code (JavaScript)

function getPriorityNotifications(data) {
const weight = {
Placement: 3,
Result: 2,
Event: 1
};

```
return data.notifications
    .sort((a, b) => {
        if (weight[b.Type] !== weight[a.Type]) {
            return weight[b.Type] - weight[a.Type];
        }
        return new Date(b.Timestamp) - new Date(a.Timestamp);
    })
    .slice(0, 10);
```

}
