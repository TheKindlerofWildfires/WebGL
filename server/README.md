This folder contains code related to server side node.js

It focuses on running the game mechanics, such as generating and providing maps, as well as handling connections

The design of the server is:
1) The server receives a request to connect to an instance by token
2) If this token already exists it connects the player to the server
3) Otherwise it dedicates one of it's server instances to the token
4) When all connections to the server are in the state 'Ready' it starts the game
  a) It randomizes the teams
  b) It generates a map using random algorithms
  c) It sends either this map, or the seed for this map to the players
  d) It bidirectional updates player/objects on it's instance of the map
  e) It updates connections game states based on what it thinks the connections game state is
