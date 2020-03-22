This folder contains code related to client side javascript.

It focuses on rendering using webGL and communicating back to the server via Web Sockets

The design of the client is:
1) A person connects to the index.html page
2) Two buttons appear: New game, Join game
  ai) After clicking New game they are brought to a screen with one field: name
  aii) After entering a display name they are given a token and sent to a lobby
  aiii) This spins up/requests a node js server to play on
  bi) After clicking join game they are brought to a screen with two fields: name, token
  bii) After entering these values they are brought to the same lobby
  biii) This lobby is the same node js server
3) After every client in the lobby sends clicks the ready button the game begins
4) The game proceeds following game design principles 
