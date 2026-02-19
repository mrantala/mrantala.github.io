I am looking at building a weight tracking web app. I am first going to proivde an overall look at the requirements and then follow up with some questions.

1) Portable Web App
2) Uses local storage to save settings and data
3) A mobile-first design
4) Ability to import/export data as .csv
5) has the ability to graph data
6) Should strive for a high level of accessability

The interface should be simple but attractive. I envision 4 buttons and a main area. The buttons will be along the shorter edge of the dispaly. If protrait, they will be across the top of the display, if the dispaly is in landscape, they will be along the left edge.

The four buttons will relate to 4 views.

1) Data Entry/Data Look-up/Data editting. After settings have been created, this will be the default screen at launch. If settings have not been compelted. The settings will be the default screen.
	The data structure will be 4 fields:
	ID: A unique id field. (longint) This will be automatically created and user will not see it.
	Data: The date of the the weighing. Required
	Weight: The weight. Required
	Comments: A mult-line text field. Optional.

2) Charting. This view will present graphs. Some default graphs will be:
	Cahrt of daily weight for the last 7/12/30/90/x days. A trendline can be include.
	Cahrt of weekly/monthly/yearly averages.

3) Settings. This will be used to set the defaults. This includes:
	The units to use, pounds or kilograms (required)
	The goal weight (optional)
	Tools for exporting/importing data

4) Info page. Information about the app and the developer and the optoin to donate money


My three initial questions:
1) What libraries and tools do you recommend we use.
2) I intend to do this step by step, what order should I implement the various functionality.
3) What additonal information do you need to provide more information.