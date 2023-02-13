# Design Goals
1) Users can generate shortened URL using their original URL
2) The shortened URL will redirect users to the original URL

# Security Goals
1) URL should not be predictable or can be reverse engineered
2) URL should not reveal details about its user or creator
3) Creator should be able to specify an expiration time for the URL
4) If URL expires, deactivate it, do not DELETE
5) Do not allow other URLs to replace expired URLs for security purpose (prevented by point 4 and UNIQUE requirement in Database schema design)
6) Sanitize original URL to prevent XSS injection

# Design/Scalability
1) Suppose we use characters a-z, A-Z, 0-9 for our shortened URL key, and make it n characters long, the possible number of URLs would be (permutation with repetition):
62^n
2) Suppose we choose n = 7, then the number of possible URLs we can have is 62^7 = 3521614606208
3) If needed, it can be expanded to n = 8, n = 9, etc

# Algorithm
1) Generate 7 characters for the shortened URL from string "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
2) Create a random unique number by combining Date.now() and Math.random()
3) Randomly get a character from a-z, A-Z, 0-9 by performing modulo operation on the unique number to generate an index, then grab the character at that index from the string 7 times.
4) After each round, divide the unique number by 62.
