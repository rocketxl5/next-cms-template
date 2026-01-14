### 1️⃣ Old systems mixed passwords with transport formats

Historically, passwords were often:

* Sent in **query strings**
* Embedded in **URLs**
* Stored in **CSV / INI / ENV files**
* Passed through **shell commands**
* Parsed by **legacy frameworks**

In those contexts:

* `+` could become a space
* `^` had shell meaning
* `&` broke parameters
* `%` triggered URL decoding
* `"` and `'` broke strings

So developers **restricted characters** to avoid breaking systems.

👉 The restriction was about **system limitations**, not security.

---

### 2️⃣ Poor separation of concerns

Older stacks often did things like:

```txt
password=My+Secret^Pass
```

Then:

* URL decoding happened twice
* Encoding rules were inconsistent
* Input sanitization was ad-hoc

Result:

> “Just ban special characters.”

That was a **defensive hack**, not best practice.

---

## What changed (this is the key)

### 1️⃣ HTTPS + JSON everywhere

Modern apps:

* Send passwords in JSON bodies
* Over HTTPS
* Parsed by mature libraries

No URL encoding issues.
No shell parsing.
No magic transformations.

---

### 2️⃣ Strong hashing libraries

Libraries like:

* bcrypt
* argon2
* scrypt

Treat passwords as **opaque bytes**.

They don’t care if the password is:

* `p@$$+^✓漢字!`
* or `simple123`

---

### 3️⃣ Clear security guidance (NIST, OWASP)

Modern guidance says:

> **Allow all characters, including Unicode, for passwords.**

Example:

* NIST SP 800-63B (2017+)

They explicitly recommend:

* **No composition rules** that block characters
* Focus on length + hashing

---

## Why banning characters is now considered bad

Banning characters:

* ❌ Reduces entropy
* ❌ Breaks password managers
* ❌ Causes login failures users can’t explain
* ❌ Encourages password reuse

Allowing them:

* ✅ Improves security
* ✅ Improves UX
* ✅ Reduces support tickets

---

## So why do you still see restrictions sometimes?

Because of:

* Legacy systems
* Old tutorials
* Copy-pasted regexes
* Fear-driven security

A lot of codebases are **frozen in 2010 thinking**.

---

## Your current approach is modern and correct

Your schema:

* Allows all non-whitespace characters
* Enforces length and diversity
* Hashes later

This matches **current best practice**.

---

## One final mental model (remember this)

> **Passwords are secrets, not text fields.**
> Treat them like binary data that only hashing functions understand.
