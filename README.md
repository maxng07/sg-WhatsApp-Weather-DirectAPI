This is a re-write of the SG WhatsApp Weather App taking a different approach. 

In <https://github.com/maxng07/sg-weather-forecast>, the App loads the key value JSON data set from Storage, and there is a need to update the JSON data storage regularly.

In this re-write, the server-less function does a direct API call to the remote API Server to obtain the latest JSON data. Every invokation of the function will trigger a API or HTTPS GET request. Though this is less efficient and ideal, but this automates the APP as Twilio Assets (data storage) today cannot be updated via API, hopefully possible in the near future.

Current solution makes use of Twilio Server-less Function (which is hosted on AWS Lambda) and Twilio API for WhatsApp. Application logic can be run off any server-less function with Nodejs runtime or any container or VM. As this is using serverless, there is no package.json. 

The dependencies/modules you need to add are:

* axios (0.19.0)
* date-and-time (0.10.0)

Several enhancements has also been added after receiving a lot of feedback from reviewers and this has been incorporated with this rewrite.

The enhancements includes:

1. Direct API calls to GovTech API using AXIOS modules with query parameter using date module - though inefficient and my app may be classified as DOS if too frequently invoked.
2. Improve overall logic on the app. thanks to Dave.
3. Aesthetic improvement, remove trailing comma, Capital on first character for Town name.
4. Include valid timestamp on each weather forecast response, to avoid user having to check regularly.
5. Null handling or invalid key word handling to guide user along.
6. Error handling if NEA API server is unavailable and informs user.

The latency for response is expected to go up and based on limited testing on a cold function, it takes approx 1200 to 1500ms for the function to fetch and execute the logic. On a warm function, it takes approx 400-600ms.

The valid keyword to use

* All - print out the complete JSON array for Area and Forecast. Currently Twilio Messaging Platform has a length limit of 1600 characters. The raw array would exceed this length. 
* Area - print out the complete Area name of the JSON array
* Area-name - print out the forecast value for the area key
* "Any other words" - print out a message to guide the user.
