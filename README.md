This project is a Next.js application with Redux for state management and TypeScript for type safety. It includes a mock API and WebSocket integration for real-time updates.

Features:
- Next.js: A React framework for server-side rendering and static site generation.
- Redux: State management library to manage application state.
- TypeScript: Provides type safety and better development experience.

**Some developer decisions**
In order to mock the api in this project I used dummyjson.com - they have a large repo of already set-up endpoints. The one I found most suited this technical challenge was their recipes endpoint, as it had a name, image and description. It also allowed me to use variables in my fetch call like limit and skip. Which made this dummying stage a lot easier. Another pointer where I slightly veered from the brief was to load my posts 10 at a time, rather than 20. The reason for this being that there was a maximum of 50 returned from my dummy api, so i felt it gave more value to you the reviewer to see the scroll and infinite load happen more than once when actioned. Thanks for taking the time to review my mini project

**Prerequisites**
Before you begin, ensure you have the following installed on your machine:

Node.js (version 14.x or later)
npm (version 6.x or later)

**Getting Started**
Clone the Repository:  `git clone https://github.com/Mackenzie549/technical-front-end.git`
`cd technical-test`

Install dependencies:
`npm install`

**Running the Application**
Open a terminal and navigate to the project directory.
Run the following command to start the development server:

`npm run dev`

The project is set up that this step will both start your development server and begin running the WebSocket Server

The application will be available at http://localhost:3000


**Sending Messages to the WebSocket**
To send messages to the WebSocket server using sendPost.ts, follow these steps:

Open a terminal and navigate to the project directory.
Run the following command to execute sendPost.ts:

`ts-node sendPost.ts`

**Running Tests**
To run the tests, follow these steps:

Open a terminal and navigate to the project directory.
Run the following command to execute the test suite:

`npm test`
To run tests in watch mode, use the following command:
`npm run test:watch`


There are some console errors in the jest test suite, that i ran out of time to complete, these would be were I would immediately address if i were to come back to this project