# SFU_CMPT276_2019
SFU team project node JS application
I Commander
Parent System:
Drupal or other content management system which tracks details regarding:
•	Regulatory requirements – SOP’s and regulatory checklists
•	Service tickets – Drone service maintenance tickets
•	Pilots – pilot training 
•	Hardware: 
o	Drones and their associated service records
o	Batteries
o	Etc.
I Commander
I Commander is a mobile friendly web application or a mobile application which meets the following key functions:
•	assists drone pilots in following standard operation procedures (SOPs) by leading the user through a series of pre and post flight checklists
•	tracks flight times – when the user completes the pre-flight checklist the app displays a “START Flying” button.  Once Checked the app is in “active flight mode” and time is recorded until the user selects the “STOP Flying” option.  The flight time is recorded in the parent system by user once the user is in wifi/data range. 
•	sends alerts/triggers actions – After the user has “stopped flying” they complete a series of Post Flight checklists. Items fall into several categories which trigger alerts and actions:
o	SOP compliance – no alert. Must be checked but that’s it
o	Standard maintenance - creates service tickets in the parent system service que based on post flight checklist items and details. For example, if the “underbody scratches and blemishes” item is checked a service ticket is created for that Drone.
o	LOCK OUT Maintenance – some checklist items triger a LOCK OUT event.  This means the drone being used (the one for which the post flight checklist is being completed for) enters a “LOCKED OUT” Status.  A service ticket is created and the drone is EXCLUDED from the Drone selection list meaning it can not be flown again until the service ticket is completed.
•	user management 
I Commander has two modes:
Administration and Configuration Mode:
Available at the desktop level OR inherited from the parent system:
•	User management interface (ideally from parent system)
•	Drone management interface (ideally from parent system)
•	Checklist management interface (Should be from I Commander)
•	Ability to “thread” checklists together by drone type. Checklists vary by drone type.  Some checklists need to be filled in for ALL missions while others are drone specific.  Admin user needs to be able to:
o	Create new checklists selecting from several preconfigured field “types” and setting properties related to “alerts”:
	No action
	Maintenance
	LOCK OUT Maintenance
o	Create sequences of checklists
o	Assign checklist sequences to Drone models
Mobile Mode
A mini version available in the field for managing missions:
•	User logs in
•	User creates a new Mission
•	User selects the Drone from a list of available drones (Drones show as In Service or Locked Out)
•	User completes pre-flight checklists
•	User starts flight
•	User stops flight
•	User completes Post Flight Checklist
•	New Mission
Additional Details:
•	MUST track pilot hours
•	Show a cool video game character when “ready to fly”
Extra but not critical Requirements
Gear Checklists: checklists which are completed prior to leaving base or the field as opposed to mission specific checklists. Design with this add on in mind.


