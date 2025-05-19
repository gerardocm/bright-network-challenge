
# Bright Network Hiring Challenge
Author: Gerardo Cisneros Mendoza

## Decription

At Bright Network, matching graduates with their ideal first jobs and employers with their ideal graduate intake is core to what we do. This technical challenge is designed to give you a flavour of what it might be like to work for us and for us to assess the kind of developer you are and the skills and approach to problem-solving you're bringing to the table.

In our suggested programming language, please implement a very simple recommendations algorithm to match members to their perfect job. The code needs to fetch the required data from the following APIs:
https://bn-hiring-challenge.fly.dev/members.json
https://bn-hiring-challenge.fly.dev/jobs.json

For each member, please print their name and their recommended job(s).

Please work in a git repository, and share the repository with us via either a link or zip file. Please include a README which contains detailed instructions for installing and running your submission, challenges posed by the problem and its domain and a discussion of the choices you've made and your reasons. Think of the README as a one-sided pre-interview conversation on the problem and your submission.

We’d like you to spend no more than 3 hours on the problem, so we don’t expect a perfect solution, and that’s absolutely fine. The aim is to get a sense of your coding approach and give us something to discuss during the technical interview. In your README, please include clear details on what you would do if you had more time.

As a rough guide on what we'd like to see, whilst a single script wouldn't give us an indication of how you typically organise your code, we are also not looking for 10 different modules for this task, for example. Our priority is to see good evidence of your coding ability and we want you to approach this in the same way you would if you were tasked on working on this solution at work. So please don’t feel the need to over-complicate it!


Please complete your task using TypeScript.


## Developer Notes

### Instructions to run

#### Pre-requisites

The algorithm was developed using node version 22.15.1 as stated in file `.nvm`. 
The typescript code uses typescript package to transform the code into javascript, which is installed as part of the developer packages. 
The code only includes a very basic set of packages required for this challenge to be completed. <br>

### Install packages
To install the required packages run:
```
npm install
```
### Build code
In order to run the typescript code it needs to be transformed to javascript.
```
npm run build
```
### Run code
Finally we can run the code with the following command.
```
npm run main
```
### Run tests
A set of basic test were added and can be run with the following command:
```
npm run test
```

## Algorithm

### Assumptions

- The job recommendation is based on the member's bio, which has no specific structure or words.
- The "best" job recommendation match can be open to interpretation.
- No external libraries can be used to find the recommended job or process data.
- The only dataset available is the one provided.
- The member's bio is a short length text.
- The result is a presented printed in the console.

### Initial Notes

Text processing can be a very challenging job. Part of the challenge is the unstructure and non order on the text, which makes it particurlaly challenging because many variables on the text.
When thinking on the possible options to create an algorithm the recommends the best job given the variables of this task, one of the approaches I thought was Natual Language Processing which focuses in the interpretation of text, however given the complexity of NLP models this could take a lot more than 3 hours and can be very a very complex solution to develop. 
For this solution I focused on keeping the algorithm simple and efficient, and going back to the basic, a search on the members bio based on the words of the job title and location that provides the best recommended job, although the free text on the bio increases the difficulty to find specific words and the context surrounding these words. 

### Approach

As mentioned previously, one of the challenges about this algorithm was processing the members bio to find keywords that helps us recommmend the best job based on a job title and location. In order to find this keywords I focus on finding words that are matching either the job title or the location. After every word has been compared against the available jobs a score is given to best compare each job, the higher the score is, the better match it is. <br>
I have decided for this approach for the following reasons:
<br>
- *Word matching is partial and not exact, which provides flexibility.*  The algorithm process the bio text, going through every word on the text and comparing it against every job, evaluating an total score for every job, that ultimately give us the recommended job as the highest scored job. Although this process requires a search on each job for each word, this also provides mores flexibility and fine tunning on how we compare each word, as oppose to having a set with the words included in the job title and location and making an exact comparison (if set has key). <br>
Having flexibility will help us to provide best recommendation in cases such as `bio: "I like design"` -> `job title: "Designer"`, that would not be possible to achieve working with exact match. Although the partial match adds flexibility, it does not handle reverse cases where the bio word length is larger than the job tile.
The flexibility provided by this part of the algorithm covers cases when the job title has more than one word. e.g. `bio: "I worked as Engineer"` -> `job title: "Mechanical Engineer"`
<br>
<br>
- *Handling location context.* Based on the data set provided, a member's bio can include context of location preferences about where the member is might be looking for a job. 
In order to give the best recommendation is important to account for this information, and I have included a check for context on words before a location found in member's bio. This check consists on looking _K_ neighbours before the location found, being K an adjustable number, set to 2 for this algorithm. Each k-neighbour will be compare against a set of predefined words that provide either a positive or negative context to a location, affecting the score of each pottential job.
<br>
Some examples of location context check cases are:
`bio: "ousite of London"` -> will score London jobs lower
`bio: "living London"` -> will score London jobs higher
`bio: "london"` -> will give a neutral score
<br>
The scores of each one of the cases have been included in the constants file and can be fine tuned analysing a larger data set. Currently the values are:
- Positive context location score = 1.5
- Neutral context location score = 1
- Negative context location score = -1.5
- No location found in bio = 0
Is worth to mention that locations are compare with exact match and only accept single word locations. 

The algorithm performance is improved significantly by normalizing the text. Assuming that the data from the jobs is structured, the only transformation required is to lower case. For member's bio the normalization has the following steps:
- Removes any punctuaction character or number from the text.
- Converts the text to lower case.
- Filters the words and removes commons words to reduce the text and focus on important words. For example, removes `"the", "a", "and", "you"...` 


### Additional notes and comments about the algorithm:
- The scores values more the job title than the location, this is included in the algorithm through a multiplier value named `JOB_SCORE_MULTIPLIER`. The purpose of this variable is to provide more value on finding a partial match on the job title than a location. e.g. `bio: "Software in London"` to recommend `Software developer` in other location rather than any job in `London`. 
- The constant values used to score the jobs are based on the analysis of data and can be adjusted accordingly.
- If there is no word matching in any of the jobs (score = 0), the recommended job is `null`
- If two jobs have the same score, it returns the first one found.
- Some data in the constanst are sets due to their uniqueness and effiency to check for if it exists in set.
- The fetching of data was implemented with the javascipt `fetch` function to keep the code simple without the need of any packages.

### Areas of improvement and considerations
- The algorithm doesn't account for mispelling words. The matching of words won't work when spelling mistakes are introduced.
- Currently a context of a word is only applied to locations, an potential improvement will be detecting context related to jobs in member's bio.
- The analysis of location can be improved with multi-word locations like "New York", feature not supported yet.
- The algorithm finds the best recommended job based on the variables available and set, the accuracy can be improved increasing with a larger data set, analyzing the feedback from the memebers or analyzing the members interaction with the recommended jobs.
- Larger data set can impact the perfomance due to the scoring of each job and the detailed search on every word, however different techniques can be applied to help the perfomance such as including keywords related to the job in the job object to search faster, instead of looking for partial matches.
- The set of words included for positive and negative context for locations can be adjusted to improved the accuracy.
- Improve set of stop words to normalize the text.
- Gender specific roles are not included in this algorithm but should be part of the considerations for future analysis, e.g. if the job title is "Waiter" it cannot recommend to a bio including the word "Waitress"
- Improve the handling of edge cases such as having hyphen in a job title, e.g. "Front-end developer"