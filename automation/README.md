#Admin Portal Automation.

Admin Portal Automation covers CRUD(create, read, update and delete operation performed on UI. This is TestNg Selenium UI automation setup done on Chrome driver.

## Build : 

1. First Build Jar `mvn clean install`

2. Place VM args- java  -Dpath=https://env.mosip.net/ -Duserid=user -Dpassword=pwd -jar nameofAdminJar.jar

3. Place jar in one folder along with src/main/resources files and folder and then run jar

## Configurations :

1. Config.properties

     * langcode:eng -- This is Admin login page language selection description placed in TestData.json

     * bulkwait:10000 -- This is Bulk upload wait

2. TestData.json

     * Keep setExcludedGroups="" -- To run all the scenario mentioned below

     * Keep setExcludedGroups="BL,CT" -- To Exclude testcases execution based on below tags. 
3. Chrome driver place under working directory inside folder name chromedriver.


## Below scenarios and their tags :

`		`"blocklistedwordsCRUD": "BL",

`		`"bulkUploadCRUD": "BU",

`		`"centerCRUD": "CTR",

`		`"centerTypeCRUD": "CT",

`		`"deviceSpecCRUD": "DS",

`		`"deviceCRUD": "D",

`		`"deviceTypesCRUD": "DT",

`		`"documentCategoriesCRUD": "DOC",

`		`"documentTypesCRUD": "DOCT",

`		`"dynamicFieldCRUD": "DF",

`		`"holidaysCRUD": "H",

`		`"machineSpecCRUD": "MS",

`		`"machineCRUD": "M",

`		`"machineTypesCRUD": "MT",

`		`"templateCRUD": "T"
## Execution result and Logs
1. Verify the Failure in the Logs file `\logs\AutomationLogs.log`
1. Execution results present under test-output folder file `emailable-report.html`


## License
This project is licensed under the terms of [Mozilla Public License 2.0]

