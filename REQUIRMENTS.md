# I Commander

## Parent System:

Drupal or other content management system which tracks details regarding:

- Regulatory requirements – SOP&#39;s and regulatory checklists
- Service tickets – Drone service maintenance tickets
- Pilots – pilot training
- Hardware:
  - Drones and their associated service records
  - Batteries
  - Etc.

## I Commander

I Commander is a mobile friendly web application or a mobile application which meets the following key functions:

- assists drone pilots in following standard operation procedures (SOPs) by leading the user through a series of pre and post flight checklists
- tracks flight times – when the user completes the pre-flight checklist the app displays a &quot;START Flying&quot; button.  Once Checked the app is in &quot;active flight mode&quot; and time is recorded until the user selects the &quot;STOP Flying&quot; option.  The flight time is recorded in the parent system by user once the user is in wifi/data range.
- sends alerts/triggers actions – After the user has &quot;stopped flying&quot; they complete a series of Post Flight checklists. Items fall into several categories which trigger alerts and actions:
  - **SOP compliance** – no alert. Must be checked but that&#39;s it
  - **Standard maintenance** - creates service tickets in the parent system service que based on post flight checklist items and details. For example, if the &quot;underbody scratches and blemishes&quot; item is checked a service ticket is created for that Drone.
  - **LOCK OUT Maintenance** – some checklist items triger a LOCK OUT event.  This means the drone being used (the one for which the post flight checklist is being completed for) enters a &quot;LOCKED OUT&quot; Status.  A service ticket is created and the drone is EXCLUDED from the Drone selection list meaning it can not be flown again until the service ticket is completed.
- user management

_I Commander_ has two modes:

**Administration and Configuration Mode:**

Available at the desktop level OR inherited from the parent system:

- User management interface (ideally from parent system)
- Drone management interface (ideally from parent system)
- Checklist management interface (Should be from I Commander)
- Ability to &quot;thread&quot; checklists together by drone type. Checklists vary by drone type.  Some checklists need to be filled in for ALL missions while others are drone specific.  Admin user needs to be able to:
  - Create new checklists selecting from several preconfigured field &quot;types&quot; and setting properties related to &quot;alerts&quot;:
    - No action
    - Maintenance
    - LOCK OUT Maintenance
  - Create sequences of checklists
  - Assign checklist sequences to Drone models

**Mobile Mode**

A mini version available in the field for managing missions:

- User logs in
- User creates a new Mission
- User selects the Drone from a list of available drones (Drones show as In Service or Locked Out)
- User completes pre-flight checklists
- User starts flight
- User stops flight
- User completes Post Flight Checklist
- New Mission

**Additional Details:**

- MUST track pilot hours
- Show a cool video game character when &quot;ready to fly&quot;
- Interface should be fun and engaging for the user. For example use animations. Use a swipe action instead of a check box to promote user encouragement instead of blindly checking all of the boxes without reading.

**Extra but not critical Requirements**

- Gear Checklists: checklists which are completed prior to leaving base or the field as opposed to mission specific checklists. Design with this add on in mind.
- Store regulatory documentation: allow the user to upload PDF documents related to insurance and licensing through the admin interface. Allow the user to name these documents. From the mobile app allow the user to access these documents in case they are required by officials such as police or wildlife officers.  So there would be a section in the app called "Licensing Docs" or something like that and when the user went to that area they would get a list of documents which they could display on screen.
