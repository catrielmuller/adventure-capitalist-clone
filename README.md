# Adventure Capitalist Clone

## Demo

- [https://adventure-capitalist-clone-dem.herokuapp.com/](https://adventure-capitalist-clone-dem.herokuapp.com/)
- [Inspect Game Server](https://adventure-capitalist-clone-dem.herokuapp.com/colyseus/)

## Objective

Create a basic clone of the well-known AdVenture Capitalist, that it's basically a game where you buy business to 
make money producing manually and waiting a time, but when you have enough money you can hire a manager of a bussiness 
to make money automatically meanwhile you do another things, like the Real Life :D

You can find a web implementation of this game here [Web - AdVenture Capitalist](http://en.gameslol.net/adventure-capitalist-1086.html)

## Personal Goals

- Make this demo bulletproof to RAM manipulations or client side hacks.
- Create a Full-Stack demo.
- Use the same language for the Backend and the Frontend.
- Have the backend generic so be can support multiples similar games with different configurations on the same instance. 
- Have all settings configured on the backend to have the total control of the game content. Like Business, prices, times, etc.
- Have zero constants on the client to be reproducible on different games with another contents and assets.
- Use 100% Open Source Libraries.

## Architecture

### Both

Both projects are written on [TypeScript](https://www.typescriptlang.org/) because make a Type checking it's an 
excellent option to make your code maintainable and have a clean integration between different parts of your project.
Also, both use [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/) to prevent errors and make the code 
style consistent on the entire project.

### Backend

I decided use [Colyseus](https://colyseus.io/) that is a Game Server for [NodeJS](https://nodejs.org/en/) that use 
[Express](https://expressjs.com/) as a WebServer and [WS](https://github.com/websockets/ws) as a WebSocket server.
Why? Because, I wanted try something new and create my own implementation using the same techs not make any sense for 
a MVP like this project.
Basically resolve all I needed like rooms, state management and synchronization, message system, room persistence and 
clock ticks events.

#### Rooms and State

When the user connect at the first time will be created a new room only for him or her, So the server will be keep the 
state of the Player internally and make the all calculations (This is not necessarily the best option, see the caveats 
later on this document).

#### Configuration

- server/src/config/adventure-capitalist.ts

Here it's stored the all configuration of the game, so it's really easy to add more Businesses using that structure.

```typescript
export const MAX_TIME_TO_RECONNECT = 60 * 60 * 24; // One Day
export const DEFAULT_INCREASE_PRICE = 1.15;
export const INITIAL_MONEY = 50;

export const businessConfigList: Record<string, BusinessConfig> = {
  lemon: {
    name: 'Lemon',
    baseValue: 4,
    baseEarn: 1,
    delay: 1000,
    increaseRatio: DEFAULT_INCREASE_PRICE,
    managerCost: 1000,
  },
}
```

#### Static Server

To facilitate the deployment I use the same Game Server as a Static WebServer using the folder `server/public` to 
host a built version of the React App.

### Frontend

I decided go for [React](https://reactjs.org/), It's not the best alternative for video games or realtime rendering, 
but for a game like this it's enough.
The internal architecture is not very complex, use the LocalStorage to save the Session of the server to keep to what 
RoomId should be connected if the user close the App and try to open the game again for continue playing.

### Deployment 

I wanted try something new, so I spent two hours to configure correctly a Github Action to make the Lint and TSC 
validations, the Build of the React App and finally the deployment to Heroku, to make the test of this demo more 
easily to non-technical users.
You can see the configuration here: `.github/workflows/main-ci.yml`

## Caveats and Improvements
- Sorry, I'm not a graphic designer, so my design it's only functional, it is far from pretty.

- Have the State on the Server and make the all calculation there give you the total control of the user, so it's 
really hard cheat the game. But you will have two big disadvantages, the game will be online exclusively (You can make 
a hybrid approach, with a offline gaming when the user dont have conectivity, and when the user come back make some 
calculations on the Server to check if the interactions that he made are possible based on the rules of the game). 
The another big disadvantage it's that you will have a cost of the computing power of the servers (It's a trade-off 
because a uncheated game it's more easy to force the user to pay). 
Not it's the case of this demo, but have a Server, give you the ability to introduce a lot of social interactions 
that will make the game more viral, and the possibility that the user can play the same session from different devices.

- The backend will only maintain the state of the user for one day (This is a configurable parameter), However on the 
ideal scenario the backend should be save the state on a database when the user disconnected, and when he/she come back 
make the calculations of from the last saved version to the current timestamp. Doing something like this:

```typescript
const savedTimestamp: number = 0;
const currentTimestamp: number = new Date().getTime();
const diff = currentTimestamp - currentTimestamp;
// for each business
const ticks = Math.trunc(diff / business.delay);  
this.state.money += ticks * business.baseEarn * this.state.business[key].amount;
const rest = (diff % business.delay) * business.delay;
business.trigger = currentTimestamp - rest;
```

I don't implemented this because it's more difficult to deploy because you need an external service to persist the 
state. I recommend use [MongoDB](https://www.mongodb.com/) for this particular case.

- On this demo there is no way to retake the same session / room from another device or if you remove that information 
from your Local Storage.  As there is no security for that session. Both problems can easily resolved using an 
Authentication using a ThirdParty provider like Google Auth, Facebook Connect, or directly implement your own auth 
service.

- To scale the backend should implement [Redis](https://redis.io/) to synchronize the information between the 
instances. In this case in particular when you have one room per user, it's not essential, on that case you will 
have a load balancer that will redirect the user to the server that have that room active.

- Implement [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization)

- Write test for everything! (Unit, functional, load, integration and e2e)

- Move the functionality of the message receivers on the Room to a particular class to handle the operations.

- Move the functionality of the room loop to a method of the business class.

- Add a Global State Manager on the React client like [Recoil](https://recoiljs.org/) or another of the million 
alternatives that have available.

- Move the connection logic from the `App.tsx` to a external class.

- Implement [Storybook](https://storybook.js.org/) to test the Frontend Components individually.
