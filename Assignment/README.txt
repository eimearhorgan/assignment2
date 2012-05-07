===========================================================
STUDENT INFO
===========================================================

Name - Eimear Horgan 
Student No - 00037613
Module - Mobile Web Development Assignment 2 - Tag Tastic

===========================================================
SUMMARY
===========================================================

Tag Tastic allows a user to:
1. Login using facebook or twitter
2. Add a Team player to a team 
3. View player profile details
4. Delete a palyer  
5. View Fixtures & Results
6. View A table
7. View more info

===========================================================
GITHUB LOCATION
===========================================================

eimearhorgan / assignment2

===========================================================
INSTALLATION
===========================================================

Install nginx - http://nginx.org
Install node - http://nodejs.org

===========================================================
CONFIGURATION
===========================================================

nginx:
=====
Config file: Assignment2/conf/nginx.conf

Directory >> C:/nginx

Start: nginx
Stop: nginx -s stop

node:
=====

Directory >>  C:/Assignment2

Start: node node/lib/db-server.js
Stop: Ctrl C

Mongo:
=====

MongoHQ: mongohq.com
Mongo Console: mongo flame.mongohq.com:27102/admin -u admin -p 

Database: mwd_ass_2
Collections: todo

To launch the Tag Tastic App:
==========================

Locally: http://127.0.0.1/assignment2/site/public in Safari. 
Mobile: browse to your server IP address (ipconfig on desktop) example ... http://192.168.1.7/assignment2/site/public

====================================================================================================================
APP FEATURES
====================================================================================================================

1) Tag Tastic App: 
	Implemented using Backbone, jQuery, jQuery Mobile and Underscore.

2) Add Player:	
	The user can add an player by tapping the Add Button top right-hand corner, this will enable a text boxes in which
	data can be entered and two additional buttons, Save & Cancel.
	The user can enter text, and hit Save to save player details to the team list.
	If the user taps cancel, the item is not saved, and then text boxes slides-up out of view.

3)Delete Player
	If the user swipes right on any of the players then the Delete Button becomes active, which enables the user
	to Delete a player by tapping on the Delete Button. 
	If a user swipe left then the Delete buttin is hidden again. 			

4) More 
	A User can view frequently asked questions, contact us, view terms and conditions & Read about Tag Tastic.

4) Remote storage:
	Implemented using remote Mongo database on mongohq.com, configuration is set in node/lib/db-server.js

5) Event Binding: 
	Listens for changes to models and triggers events - See the re-render of th list on model change event.

6) Routing: 
	Routing has been implemented, allowing the user to switch between players list and player profiles and the 
	more usefull stuff page.

=====================================================================================================================
ISSUES 
===================================================================================================================

Attempted to publish on Heroku but was unsuccessful.
