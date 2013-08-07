function bulkOperationsUi() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var activeSheet = ss.getActiveSheet();
  var mode = ScriptProperties.getProperty('mode');
  var activeSheetId = activeSheet.getSheetId();
  var rosterSheet = getRosterSheet();
  var rosterSheetId = rosterSheet.getSheetId();
  if (activeSheetId==rosterSheetId) {
    var app = UiApp.createApplication().setTitle(t("Perform bulk student operations")).setHeight(450);
    var waitingPanel = app.createVerticalPanel().setId('waitingImage');
    var waitingImageUrl = "https://c04a7a5e-a-3ab37ab8-s-sites.googlegroups.com/a/newvisions.org/data-dashboard/searchable-docs-collection/goldballs.gif?attachauth=ANoY7coUFQKLFJRBrV-yRwgZ3p6jVsn_UbJIlzFstZAAyF1r6Xj8wCNG6yjkbeOxVf80Oo_55TUl-VvXL0OtztWjaN9_wF7pclOhemgkGWvYYSJSWLhJzp1tqMdJDoDYVaK4cpOHO1jCJDTRUmt3jNpZMo0xboBIi9W_yTbZW-8kY8nDJ3nWDrkHbmZfSPy1fh7qitwMR3kANmtQRq2EfYTJbzx56bMcFCEc4Eq3zvrirBGHllBdPTeFspBZfj5ew3e2Ffmx0phu&attredirects=0";
    var waitingImage = app.createImage(waitingImageUrl);
    waitingPanel.setStyleAttribute('position', 'absolute')
    .setWidth('200px')
    .setStyleAttribute('backgroundColor', 'white')
    .setStyleAttribute('top', '75px')
    .setStyleAttribute('left', '150px');
    waitingPanel.add(app.createLabel(t('Please do not edit the roster sheet until script is finished operating on student rows.')));
    waitingPanel.add(waitingImage).setVisible(false);
    var panel = app.createVerticalPanel();
    var dataRange = rosterSheet.getDataRange();
    var indices = returnIndices(dataRange);
    var activeRange = activeSheet.getActiveRange();
    var topRow = activeRange.getRow();
    var numRows = activeRange.getNumRows();
    var values = [];
    if (topRow!=1) {
      var values = rosterSheet.getRange(topRow, 1, numRows, rosterSheet.getLastColumn()).getValues();
    } else {
      var noneSelected = app.createLabel(t("You have not highlighted any rows in the spreadsheet. Please return to the roster sheet and highlight students, and then try the bulk operations menu item again."));
    }
    if (activeSheet.getSheetId()!=ScriptProperties.getProperty('sheetId')) {
      var noneSelected = app.createLabel(t("You were not in the roster sheet when you selected the bulk operations menu item.  Please return to the roster sheet and highlight students, and then try the bulk operations menu item again."));
    }
    var topGrid = app.createGrid(1, 4);
    topGrid.setWidget(0, 0, app.createLabel(t('First Name'))).setStyleAttribute(0, 0, 'width','150px').setStyleAttribute('backgroundColor', '#e5e5e5')
    .setWidget(0, 1, app.createLabel(t('Last Name'))).setStyleAttribute(0, 1, 'width','150px')
    .setWidget(0, 2, app.createLabel(this.labels().class)).setStyleAttribute(0, 2, 'width','150px')
    .setWidget(0, 3, app.createLabel(this.labels().period)).setStyleAttribute(0, 3, 'width','150px');
    var grid = app.createGrid(values.length, 5);
    var scrollPanel = app.createScrollPanel().setHeight("200px").setStyleAttribute('border', '1px solid grey');
    var studentObjects = [];
    for (var i=0; i<values.length; i++ ) {
      studentObjects[i] = new Object();
      studentObjects[i]['sFName'] = values[i][indices.sFnameIndex];
      studentObjects[i]['sLName'] = values[i][indices.sLnameIndex];
      studentObjects[i]['sEmail'] = values[i][indices.sEmailIndex];
      studentObjects[i]['dbfId'] = values[i][indices.dbfIdIndex]; 
      studentObjects[i]['cvfId'] = values[i][indices.cvfIdIndex]; 
      studentObjects[i]['cefId'] = values[i][indices.cefIdIndex];
      studentObjects[i]['rsfId'] = values[i][indices.rsfIdIndex];
      studentObjects[i]['crfId'] = values[i][indices.crfIdIndex];
      studentObjects[i]['tfId'] = values[i][indices.tfIdIndex];
      if (indices.scfIdIndex!=-1) {
        studentObjects[i]['scfId'] = values[i][indices.scfIdIndex];
      }
      studentObjects[i]['clsName'] = values[i][indices.clsNameIndex];
      studentObjects[i]['clsPer'] = values[i][indices.clsPerIndex];
      studentObjects[i]['tEmail'] = values[i][indices.tEmailIndex];
      studentObjects[i]['row'] = topRow + i;
      var studentObjectString = Utilities.jsonStringify(studentObjects[i]);
      var bgColor = 'whiteSmoke';
      if (i % 2 === 0) {
        bgColor = 'white';
      }
      grid.setWidget(i, 0, app.createLabel(values[i][indices.sFnameIndex])).setStyleAttribute(i, 0, 'width','150px').setStyleAttribute(i, 0, 'backgroundColor',bgColor).setStyleAttribute(i, 0, 'borderTop', '1px solid #e5e5e5')
      .setWidget(i, 1, app.createLabel(values[i][indices.sLnameIndex])).setStyleAttribute(i, 1, 'width','150px').setStyleAttribute(i, 1, 'backgroundColor',bgColor).setStyleAttribute(i, 1, 'borderTop', '1px solid #e5e5e5')
      .setWidget(i, 2, app.createLabel(values[i][indices.clsNameIndex])).setStyleAttribute(i, 2, 'width','150px').setStyleAttribute(i, 2, 'backgroundColor',bgColor).setStyleAttribute(i, 2, 'borderTop', '1px solid #e5e5e5');
      if (values[i][indices.clsPerIndex]!='') {
        grid.setWidget(i, 3, app.createLabel(values[i][indices.clsPerIndex])).setStyleAttribute(i, 3, 'width','150px').setStyleAttribute(i, 3, 'backgroundColor',bgColor).setStyleAttribute(i, 3, 'borderTop', '1px solid #e5e5e5');
      } else {
        grid.setWidget(i, 3, app.createLabel("")).setStyleAttribute(i, 3, 'width','150px').setStyleAttribute(i, 3, 'backgroundColor',bgColor).setStyleAttribute(i, 3, 'borderTop', '1px solid #e5e5e5');
      }
      grid.setWidget(i, 4, app.createHidden('student-'+i).setValue(studentObjectString));
    }
    panel.add(app.createHidden('numStudents').setValue(numRows))
    panel.add(topGrid);
    scrollPanel.add(grid);
    if (values.length==0) {
      grid.resize(1, 1);
      grid.setWidget(0, 0, noneSelected);
    }
    panel.add(scrollPanel);
    
    var operationSelectGrid = app.createGrid(2, 1).setId('operationSelectGrid');
    var operationSelectList = app.createListBox().setName('operation');
    var changeHandler = app.createServerHandler('refreshDescriptor').addCallbackElement(operationSelectList);
    operationSelectList.addItem(t('Remove from ') + this.labels().class, 'remove||' + mode)
    .addItem(t('Add teacher to ') + this.labels().class, 'add teacher||' + mode)
    .addItem(t('Add student aide'),'add aide||' + mode)
    .addItem(t('Move ') + this.labels().dropBox, 'move||' + mode);
    if (mode=='school') {
      operationSelectList.addItem(t('Archive ') + this.labels().class + t(' and all ') + this.labels().dropBoxes, 'archive||' + mode);
    }
    operationSelectList.addChangeHandler(changeHandler);
    var operationDescriptor = app.createLabel(t("Removing students will archive their " + this.labels().class + " " + this.labels().dropBox + t(" and remove them from teacher ") + this.labels().dropBox + ", " + this.labels().class + t(" view, and ") + this.labels().class + t(" edit folders."))).setId('operationDescriptor');
    var operationSettingsPanel = app.createVerticalPanel().setId('operationSettingsPanel');
    operationSettingsPanel.add(operationDescriptor)
    var operationScroll = app.createScrollPanel(operationSettingsPanel).setHeight("140px").setWidth("100%").setStyleAttribute('backgroundColor', 'whiteSmoke').setStyleAttribute('margin', '8px');
    operationSelectGrid.setWidget(0, 0, operationSelectList)
    .setWidget(1, 0, operationScroll);
    panel.add(operationSelectGrid);
    
    var button = app.createButton(t('Run operation'));
    var buttonServerHandler = app.createServerHandler('bulkOperateOnStudents').addCallbackElement(panel);
    var buttonClientHandler = app.createClientHandler().forTargets(waitingPanel).setVisible(true).forTargets(panel).setStyleAttribute('opacity', '0.2').forTargets(button).setEnabled(false);
    button.addClickHandler(buttonServerHandler).addClickHandler(buttonClientHandler);
    panel.add(button);
    app.add(panel);
    app.add(waitingPanel);
    ss.show(app);
    return app;
  } else {
    Browser.msgBox(t("You are not currently in the roster sheet. Please return to the roster sheet and try again."));
  }
}

function refreshDescriptor(e) {
  var app = UiApp.getActiveApplication();
  var operationSettingsPanel = app.getElementById('operationSettingsPanel');
  var descriptorLabel = app.getElementById('operationDescriptor');
  var operation = e.parameter.operation;
  switch(operation)
  {
    case t('remove||school'):
      operationSettingsPanel.clear();
      descriptorLabel.setText(t("Removing students will archive their") + " " + this.labels().dropBox + " " + t("and remove them from teacher") + " " + this.labels().dropBox + " " + t("folder,") + " " + this.labels().class + " " + t("view, and") + " " + this.labels().class + " " + t("edit folders.")).setStyleAttribute("margin","5px");
      operationSettingsPanel.add(descriptorLabel);
      break;
    case t('remove||teacher'):
      operationSettingsPanel.clear();
      descriptorLabel.setText(t("Removing students will archive their") + " " + this.labels().dropBox + " " + t("and remove them from teacher") + " " + this.labels().dropBox + " " + t("folder,") + " " + this.labels().class + " " + t("view, and") + " " + this.labels().class + " " + t("edit folders.")).setStyleAttribute("margin","5px");
      operationSettingsPanel.add(descriptorLabel);
      break;
    case t('add teacher||school'):
      operationSettingsPanel.clear();
      descriptorLabel.setText(t("Teacher will be added to all relevant") + " " + this.labels().class + " " + "folders and to all" + " " + this.labels().dropBoxes + " " + t("in any of the") + " " + this.labels().classes + " " + t("selected.")).setStyleAttribute("margin","5px");
      operationSettingsPanel.add(descriptorLabel);
      operationSettingsPanel.add(app.createLabel(t("Teacher email address")).setStyleAttribute("margin","5px"));
      operationSettingsPanel.add(app.createTextBox().setName('tEmail').setStyleAttribute("margin","5px"));
      break;
    case t('add teacher||teacher'):
      operationSettingsPanel.clear();
      descriptorLabel.setText(t("Teacher will be added to all relevant") + " " + this.labels().class + " " + t("folders and to all") + " " + this.labels().dropBoxes + " " + t("in any of the") + " " + this.labels().classes + " " + t("selected.")).setStyleAttribute("margin","5px");
      operationSettingsPanel.add(descriptorLabel);
      operationSettingsPanel.add(app.createLabel(t("Teacher email address")).setStyleAttribute("margin","5px"));
      operationSettingsPanel.add(app.createTextBox().setName('tEmail').setStyleAttribute("margin","5px"));
      break;
    case t('add aide||school'):
      operationSettingsPanel.clear();
      descriptorLabel.setText(t("School aide will be added only to the relevant") + " " + this.labels().dropBox + t(" as editor and to class edit and class view folders with the same privileges as student.")).setStyleAttribute("margin","5px");
      operationSettingsPanel.add(descriptorLabel).setStyleAttribute("marginTop","5px");
      operationSettingsPanel.add(app.createLabel(t("Student aide email address")).setStyleAttribute("margin","5px"));
      operationSettingsPanel.add(app.createTextBox().setName('tEmail').setStyleAttribute("margin","5px"));
      break;
    case t('add aide||teacher'):
      operationSettingsPanel.clear();
      descriptorLabel.setText(t("School aide will be added only to the relevant") + " " + this.labels().dropBox + t(" as editor and to class edit and class view folders with the same privileges as student.")).setStyleAttribute("margin","5px");
      operationSettingsPanel.add(descriptorLabel).setStyleAttribute("marginTop","5px");
      operationSettingsPanel.add(app.createLabel(t("Student aide email address")).setStyleAttribute("margin","5px"));
      operationSettingsPanel.add(app.createTextBox().setName('tEmail').setStyleAttribute("margin","5px"));
      break;
    case t('move||school'):
      operationSettingsPanel.clear();
      var sheet = getRosterSheet();
      var dataRange = sheet.getDataRange().getValues();
      var indices = returnIndices(dataRange);
      var uniqueClasses = getUniqueClassPeriodObjects(dataRange, indices.clsNameIndex, indices.clsPerIndex, indices.rsfIdIndex);
      descriptorLabel.setText(t("Moving") + " " + this.labels().dropBoxes + " " + t("will preserve all work and place them in a new") + " " + this.labels().class + " " + t("and") + " " + this.labels().period + " " + this.labels().dropBox + " " + t("root, changing teacher and student access rights as necessary.")).setStyleAttribute("margin","5px");
      operationSettingsPanel.add(descriptorLabel);
      operationSettingsPanel.add(app.createLabel(t('Destination') + " " + this.labels().class + " / " + this.labels().period).setStyleAttribute("margin","5px"));
      var sectionSelector = app.createListBox().setName('destinationRsfId').setStyleAttribute("margin","5px");
      for (var i=0; i<uniqueClasses.length; i++) {
        sectionSelector.addItem(uniqueClasses[i].classPer, uniqueClasses[i].classPer+"||"+uniqueClasses[i].rsfId);
      }
      operationSettingsPanel.add(sectionSelector);
      break;
    case t('move||teacher'):
      operationSettingsPanel.clear();
      var sheet = getRosterSheet();
      var dataRange = sheet.getDataRange().getValues();
      var indices = returnIndices(dataRange);
      var uniqueClasses = getUniqueClassPeriodObjects(dataRange, indices.clsNameIndex, indices.clsPerIndex, indices.rsfIdIndex);
      descriptorLabel.setText(t("Moving") + " " + this.labels().dropBoxes + " " + t("will preserve all work and place them in a new") + " " + this.labels().class + " " + t("and") + " " + this.labels().period + " " + this.labels().dropBox + " " + t("root, changing teacher and student access rights as necessary.")).setStyleAttribute("margin","5px");
      operationSettingsPanel.add(descriptorLabel);
      operationSettingsPanel.add(app.createLabel(t('Destination') + " " + this.labels().class + " / " + this.labels().period).setStyleAttribute("margin","5px"));
      var sectionSelector = app.createListBox().setName('destinationRsfId').setStyleAttribute("margin","5px");
      for (var i=0; i<uniqueClasses.length; i++) {
        sectionSelector.addItem(uniqueClasses[i].classPer, uniqueClasses[i].classPer+"||"+uniqueClasses[i].rsfId);
      }
      operationSettingsPanel.add(sectionSelector);
      break;
    case t('archive||school'):
      
      break;
  }
  return app;
}


function bulkOperateOnStudents(e) {
  var timeZone = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone();
  var properties = ScriptProperties.getProperties();
  var app = UiApp.getActiveApplication();
  var operation = e.parameter.operation;
  var sheet = getRosterSheet();
  var dataRange = sheet.getDataRange();
  var indices = returnIndices(dataRange);
  var numStudents = parseInt(e.parameter.numStudents);
  // var allPeriods = e.parameter.allPeriods;
  var studentObjects = [];
  for (var i=0; i<numStudents; i++) {
    studentObjects[i] = Utilities.jsonParse(e.parameter['student-'+i]);
  }
  
  //get the top folder for active course folders
  if (properties.mode == 'school') {
    var topActiveClassFolder = DocsList.getFolderById(properties.topActiveClassFolderId);
    var topActiveDBFolder = DocsList.getFolderById(properties.topActiveDBFolderId);
    var topClassArchiveFolder = DocsList.getFolderById(properties.topClassArchiveFolderId);
    var topDBArchiveFolderId = DocsList.getFolderById(properties.topDBArchiveFolderId);
  }
  
  //load the existing root folder ID info for students and teachers
  var studentRoots = getFolderRoots('sRoots');
  var teacherRoots = getFolderRoots('tRoots');
  
  
  //begin switch case
  switch(operation)
  {
    case 'remove||school': //note: still need to delete student class root folder, remove dropbox from student active folder, and 
      var date = Utilities.formatDate(new Date(), timeZone, "M/d/yy");
      for (var i=0; i<studentObjects.length; i++) {
        var status = '';
        var sFName = studentObjects[i]['sFName'];
        var sLName = studentObjects[i]['sLName'];
        var sEmail = studentObjects[i]['sEmail'];
        var dbfId = studentObjects[i]['dbfId'];
        var cvfId = studentObjects[i]['cvfId'];
        var cefId = studentObjects[i]['cefId']; 
        var rsfId = studentObjects[i]['rsfId'];
        var tfId = studentObjects[i]['tfId'];
        var scfId = studentObjects[i]['scfId'];
        var row =  studentObjects[i]['row']; 
        var status = t('You may delete this row.') + " ";
        //remove rights from class edit, class view
        var studentCourseFolder = DocsList.getFolderById(scfId);
        try {
          DocsList.getFolderById(cvfId).removeViewer(sEmail).removeFromFolder(studentCourseFolder);
          DocsList.getFolderById(cefId).removeEditor(sEmail).removeFromFolder(studentCourseFolder);
          status += sEmail + " " + t("removed from class view and edit folders.") + " ";
        } catch(err) {
          status += t("Error removing") + " " + sEmail + " " + t("from class view and class edit folders.") + " ";
        }
        try {
          var dropboxFolder = DocsList.getFolderById(dbfId);
          var currentDbName = dropboxFolder.getName();
          var dropboxRoot = DocsList.getFolderById(rsfId);
          dropboxFolder.removeFromFolder(studentCourseFolder);
          studentCourseFolder.setTrashed(true);
          dropboxFolder.removeFromFolder(dropboxRoot);
          dropboxFolder.rename(currentDbName + " - " + t("Removed from class by") + " " + this.userEmail + ", " + date);
          status += sEmail + " " + t("dropbox folder moved to student archive folder.") + " ";
        } catch(err) {
          status += t("Error moving") + " " + sEmail + " " + t("dropbox folder to") + "\"gClassFolders - " + t("Removed Students") + "\"" + t(" folder.") + " ";
        }
        try {
          moveToStudentRoot(studentRoots, sEmail, sFName, sLName, dbfId, topActiveDBFolder, topDBArchiveFolder, 'archive');
          status += sEmail + t(" dropbox successfully archived. ");
        } catch(err) {
          status += t("Error removing") + " " + sEmail + " " + t("as editor on dropbox folder.");
        }
        sheet.getRange(row, indices.sDropStatusIndex+1).setValue(status).setFontColor("red");
        SpreadsheetApp.flush();
      }
      app.close();
      return app;
      break;
    case 'remove||teacher':
      if (!properties.topDBArchiveFolderId) { //creates an archive folder if it doesn't yet exist.
        properties.topDBArchiveFolderId = DocsList.createFolder(t('gClassFolders Archived Student') + " " + this.labels().dropBoxes).getId();
        ScriptProperties.setProperties(properties);
      }
      if (DocsList.getFolderById(properties.topDBArchiveFolderId).isTrashed()==true) { //Creates a new folder if old folder is trashed.
        properties.topDBArchiveFolderId = DocsList.createFolder(t('gClassFolders Archived Student') + " " + this.labels().dropBoxes).getId();
        ScriptProperties.setProperties(properties);
      }
      topDBArchiveFolderId = properties.topDBArchiveFolderId;
      var date = Utilities.formatDate(new Date(), timeZone, "M/d/yy");
      for (var i=0; i<studentObjects.length; i++) {
        var status = t('You may delete this row.') + " ";
        var sFName = studentObjects[i]['sFName'];
        var sLName = studentObjects[i]['sLName'];
        var sEmail = studentObjects[i]['sEmail'];
        var dbfId = studentObjects[i]['dbfId'];
        var cvfId = studentObjects[i]['cvfId'];
        var cefId = studentObjects[i]['cefId']; 
        var rsfId = studentObjects[i]['rsfId'];
        var tfId = studentObjects[i]['tfId'];
        var row =  studentObjects[i]['row']; 
        //remove rights from class edit, class view
        try {
          DocsList.getFolderById(cvfId).removeViewer(sEmail);
          DocsList.getFolderById(cefId).removeEditor(sEmail);
          status += sEmail + " " + t("removed from class view and edit folders. ");
        } catch(err) {
          status += t("Error removing") + " " + sEmail + " " + t("from class view and class edit folders. ");
        }
        try {
          var topDBArchiveFolder = DocsList.getFolderById(topDBArchiveFolderId);
          var dropboxFolder = DocsList.getFolderById(dbfId);
          dropboxFolder.addToFolder(topDBArchiveFolder);
          var currentDbName = dropboxFolder.getName();
          var dropboxRoot = DocsList.getFolderById(rsfId);
          dropboxFolder.removeFromFolder(dropboxRoot);
          dropboxFolder.rename(currentDbName + " - " + t("Removed from class by") + " " + this.userEmail + ", " + date);
          status += sEmail + " " + t("dropbox folder moved to student archive folder. ");
        } catch(err) {
          status += t("Error moving") + " " + sEmail + " " + t("dropbox folder to") + "\"gClassFolders - " + t("Removed Students") + "\"" + " " + t("folder.") + " ";
        }
        sheet.getRange(row, indices.sDropStatusIndex+1).setValue(status).setFontColor("red");
        SpreadsheetApp.flush();
      }
      app.close();
      return app;
      break;
    case 'add teacher||school':
      var sheet = getRosterSheet();
      var dataRange = sheet.getDataRange().getValues();
      var indices = returnIndices(dataRange);
      var tEmail = e.parameter.tEmail;
      tEmail = tEmail.replace(/\s/g, "");
      for (var i=0; i<studentObjects.length; i++) {
        var idsProcessed = [];
        var rsfsProcessed = [];
        var sEmail = studentObjects[i]['sEmail'];
        var dbfId = studentObjects[i]['dbfId'];
        var cvfId = studentObjects[i]['cvfId'];
        var cefId = studentObjects[i]['cefId']; 
        var rsfId = studentObjects[i]['rsfId'];
        var crfId = studentObjects[i]['crfId'];
        var clsName = studentObjects[i]['clsName'];
        var clsPer = studentObjects[i]['clsPer'];
        var sEmail = studentObjects[i]['sEmail'];
        var row =  studentObjects[i]['row']; 
        var status = tEmail + "\\n";
        var newTEmails = studentObjects[i]['tEmail'].replace(/\s/g, "").split(",");
        if (idsProcessed.indexOf(crfId)==-1) {
          try {
            teacherRoots = moveToTeacherRoot(teacherRoots, tEmail, crfId, topActiveClassFolder, topClassArchiveFolder, 'active');
            status += " " + t("now has") + clsName + clsPer + t("in active classes");
            DocsList.getFolderById(crfId).addEditor(tEmail);
            idsProcessed.push(crfId);
            status += t("added to") + " " + clsName + " " + t("root folder,") + "\\n";
          } catch(err) {
            status += t("error adding as editor on") + " " + clsName + " " + t("root folder,") + "\\n";
          }
          if (idsProcessed.indexOf(cefId)==-1) {
            try {
              DocsList.getFolderById(cefId).addEditor(tEmail);
              idsProcessed.push(cefId);
              status += t("added to") + " " + clsName + " " + t("edit folder,") + "\\n";
            } catch(err) {
              status += t("error adding as editor on") + " " + clsName + " " + t("edit folder,") + "\\n";
            }
          }
          newTEmails.push(tEmail);
          newTEmails = newTEmails.join(",");
          var comment = tEmail + " " + t("added as teacher to") + " " + clsName;
          if (clsPer!='') {
            comment += this.labels().period + " " + clsPer;
          } 
          comment += " " + t("by") + " " + this.userEmail + " " + t("on") + " " + Utilities.formatDate(new Date(), timeZone, 'M/d/yy');
          var classRowNums = getClassRowNumsFromCRF(dataRange, indices, crfId);
          for (var k=0; k<classRowNums.length; k++) {
            sheet.getRange(classRowNums[k], indices.tEmailIndex+1).setValue(newTEmails).setFontColor("blue").setComment(comment);
          }
          SpreadsheetApp.flush();
        }
        if (idsProcessed.indexOf(cvfId)==-1) {
          try {
            DocsList.getFolderById(cvfId).addEditor(tEmail);
            idsProcessed.push(cvfId);
            status += t("added to") + " " + clsName + " " + t("view folder,") + "\\n";
          } catch(err) {
            status += t("error adding as editor on") + " " + clsName + " " + t("view folder,") + "\\n";
          }
        }
        if (idsProcessed.indexOf(rsfId)==-1) {
          try{
            DocsList.getFolderById(rsfId).addEditor(tEmail);
            idsProcessed.push(rsfId);
            rsfsProcessed.push(rsfId);
            status += t("added to") + " " + clsName + " ";
            if (clsPer!='') {
              status += this.labels().period + clsPer; 
            }
            status += this.labels().dropBox + ", \\n";
          } catch(err) {
            status += t("error adding to") + " " + clsName + " ";
            if (clsPer!='') {
              status += this.labels().period + " " + clsPer; 
            }
            status += this.labels().dropBox + " " + t("folder,") + "\\n";
          }
        }
        if (idsProcessed.indexOf(tfId)==-1) {
          try{
            DocsList.getFolderById(tfId).addEditor(tEmail);
            idsProcessed.push(tfId);
            status += t("added to") + " " + clsName + " " + t("teacher folder,") + "\\n";
          } catch(err) {
            status += t("error adding as editor on") + " " + clsName + " " + t("teacher folder,") + "\\n";
          }
        }
      }
      app.close();
      Browser.msgBox(status);
      return app;
      break;
    case 'add teacher||teacher':
      var sheet = getRosterSheet();
      var dataRange = sheet.getDataRange().getValues();
      var indices = returnIndices(dataRange);
      var tEmail = e.parameter.tEmail;
      tEmail = tEmail.replace(/\s/g, "");
      for (var i=0; i<studentObjects.length; i++) {
        var idsProcessed = [];
        var rsfsProcessed = [];
        var sEmail = studentObjects[i]['sEmail'];
        var dbfId = studentObjects[i]['dbfId'];
        var cvfId = studentObjects[i]['cvfId'];
        var cefId = studentObjects[i]['cefId']; 
        var rsfId = studentObjects[i]['rsfId'];
        var crfId = studentObjects[i]['crfId'];
        var clsName = studentObjects[i]['clsName'];
        var clsPer = studentObjects[i]['clsPer'];
        var sEmail = studentObjects[i]['sEmail'];
        var row =  studentObjects[i]['row']; 
        var status = tEmail + "\\n";
        var newTEmails = studentObjects[i]['tEmail'].replace(/\s/g, "").split(",");
        if (idsProcessed.indexOf(crfId)==-1) {
          try {
            DocsList.getFolderById(crfId).addEditor(tEmail);
            idsProcessed.push(crfId);
            status += t("added to") + " " + clsName + t(" root folder,") + "\\n";
          } catch(err) {
            status += t("error adding as editor on") + " " + clsName + t(" root folder,") + "\\n";
          }
          if (idsProcessed.indexOf(cefId)==-1) {
            try {
              DocsList.getFolderById(cefId).addEditor(tEmail);
              idsProcessed.push(cefId);
              status += t("added to") + " " + clsName + " " + t("edit folder,") + "\\n";
            } catch(err) {
              status += t("error adding as editor on") + " " + clsName + " " + t("edit folder,") + "\\n";
            }
          }
          newTEmails.push(tEmail);
          newTEmails = newTEmails.join(",");
          var comment = tEmail + " " + t("added as teacher to ") + clsName;
          if (clsPer!='') {
            comment += this.labels().period + " " + clsPer;
          } 
          comment += " " + t("by") + " " + this.userEmail + " " + t("on") + " " + Utilities.formatDate(new Date(), timeZone, 'M/d/yy');
          var classRowNums = getClassRowNumsFromCRF(dataRange, indices, crfId);
          for (var k=0; k<classRowNums.length; k++) {
            sheet.getRange(classRowNums[k], indices.tEmailIndex+1).setValue(newTEmails).setFontColor("blue").setComment(comment);
          }
          SpreadsheetApp.flush();
        }
        if (idsProcessed.indexOf(cvfId)==-1) {
          try {
            DocsList.getFolderById(cvfId).addEditor(tEmail);
            idsProcessed.push(cvfId);
            status += t("added to") + " " + clsName + " " + t("view folder,") + "\\n";
          } catch(err) {
            status += t("error adding as editor on") + " " + clsName + " " + t("view folder,") + "\\n";
          }
        }
        if (idsProcessed.indexOf(rsfId)==-1) {
          try{
            DocsList.getFolderById(rsfId).addEditor(tEmail);
            idsProcessed.push(rsfId);
            rsfsProcessed.push(rsfId);
            status += t("added to") + " " + clsName + " ";
            if (clsPer!='') {
              status += this.labels().period + clsPer; 
            }
            status += this.labels().dropBox + ", \\n";
          } catch(err) {
            status += t("error adding to") + " " + clsName + " ";
            if (clsPer!='') {
              status += this.labels().period + " " + clsPer; 
            }
            status += this.labels().dropBox + " " + t("folder,") + "\\n";
          }
        }
        if (idsProcessed.indexOf(tfId)==-1) {
          try{
            DocsList.getFolderById(tfId).addEditor(tEmail);
            idsProcessed.push(tfId);
            status += t("added to") + " " + clsName + " " + t("teacher folder,") + "\\n";
          } catch(err) {
            status += t("error adding as editor on") + " " + clsName + " " + t("teacher folder,") + "\\n";
          }
        }
      }
      app.close();
      Browser.msgBox(status);
      return app;
      break;
    case 'add aide||school':
      var sheet = getRosterSheet();
      var dataRange = sheet.getDataRange().getValues();
      var indices = returnIndices(dataRange);
      var tEmail = e.parameter.tEmail;
      tEmail = tEmail.replace(/\s/g, "");
      for (var i=0; i<studentObjects.length; i++) {
        var idsProcessed = [];
        var sEmail = studentObjects[i]['sEmail'];
        var dbfId = studentObjects[i]['dbfId'];
        var cvfId = studentObjects[i]['cvfId'];
        var cefId = studentObjects[i]['cefId']; 
        var rsfId = studentObjects[i]['rsfId'];
        var crfId = studentObjects[i]['crfId'];
        var clsName = studentObjects[i]['clsName'];
        var clsPer = studentObjects[i]['clsPer'];
        var sEmail = studentObjects[i]['sEmail'];
        var row =  studentObjects[i]['row']; 
        var status = tEmail + "\\n";
        var newTEmails = studentObjects[i]['tEmail'].replace(/\s/g, "").split(",");
        if (idsProcessed.indexOf(cvfId)==-1) {
          try {
            DocsList.getFolderById(cvfId).addViewer(tEmail);
            idsProcessed.push(cvfId);
            status += t("added to") + " " + clsName + " " + t("root folder,") + "\\n";
          } catch(err) {
            status += t("error adding as editor on") + " " + clsName + " " + t("root folder") + ",\\n";
          }
        }
        if (idsProcessed.indexOf(cefId)==-1) {
          try {
            DocsList.getFolderById(cefId).addEditor(tEmail);
            idsProcessed.push(cefId);
            status += t("added to") + " " + clsName + " " + t("edit folder,") + "\\n";
          } catch(err) {
            status += t("error adding as editor on") + " " + clsName + " " + t("edit folder,") + "\\n";
          }
        }
        if (idsProcessed.indexOf(cvfId)==-1) {
          try {
            DocsList.getFolderById(cvfId).addEditor(tEmail);
            idsProcessed.push(cvfId);
            status += t("added to") + " " + clsName + " " + t("view folder,") + "\\n";
          } catch(err) {
            status += t("error adding as editor on") + " " + clsName + " " + t("view folder,") + "\\n";
          }
        }
        try {
          DocsList.getFolderById(dbfId).addEditor(tEmail);
          newTEmails.push(tEmail);
        } catch(err) {
          status += t("error adding as editor on") + " " + sEmail + " " + t("student dropbox folder,") + "\\n";
        }
        newTEmails = newTEmails.join(",");
        var comment = tEmail + " " + t("added as student aide by") + " " + this.userEmail + " " + t("on") + " " + Utilities.formatDate(new Date(), timeZone, 'M/d/yy');
        sheet.getRange(row, indices.tEmailIndex+1).setValue(newTEmails).setFontColor("green").setComment(comment);
        SpreadsheetApp.flush();
      }
      app.close();
      Browser.msgBox(status);
      return app;
      break;
    case 'add aide||teacher':
      var sheet = getRosterSheet();
      var dataRange = sheet.getDataRange().getValues();
      var indices = returnIndices(dataRange);
      var tEmail = e.parameter.tEmail;
      tEmail = tEmail.replace(/\s/g, "");
      for (var i=0; i<studentObjects.length; i++) {
        var idsProcessed = [];
        var sEmail = studentObjects[i]['sEmail'];
        var dbfId = studentObjects[i]['dbfId'];
        var cvfId = studentObjects[i]['cvfId'];
        var cefId = studentObjects[i]['cefId']; 
        var rsfId = studentObjects[i]['rsfId'];
        var crfId = studentObjects[i]['crfId'];
        var clsName = studentObjects[i]['clsName'];
        var clsPer = studentObjects[i]['clsPer'];
        var sEmail = studentObjects[i]['sEmail'];
        var row =  studentObjects[i]['row']; 
        var status = tEmail + "\\n";
        var newTEmails = studentObjects[i]['tEmail'].replace(/\s/g, "").split(",");
        if (idsProcessed.indexOf(cvfId)==-1) {
          try {
            DocsList.getFolderById(cvfId).addViewer(tEmail);
            idsProcessed.push(cvfId);
            status += t("added to") + " " + clsName + " " + t("root folder,") + "\\n";
          } catch(err) {
            status += t("error adding as editor on") + " " + clsName + " " + t("root folder") + ",\\n";
          }
        }
        if (idsProcessed.indexOf(cefId)==-1) {
          try {
            DocsList.getFolderById(cefId).addEditor(tEmail);
            idsProcessed.push(cefId);
            status += t("added to") + " " + clsName + " " + t("edit folder,") + "\\n";
          } catch(err) {
            status += t("error adding as editor on") + " " + clsName + " " + t("edit folder,") + "\\n";
          }
        }
        if (idsProcessed.indexOf(cvfId)==-1) {
          try {
            DocsList.getFolderById(cvfId).addEditor(tEmail);
            idsProcessed.push(cvfId);
            status += t("added to") + " " + clsName + " " + t("view folder,") + "\\n";
          } catch(err) {
            status += t("error adding as editor on") + " " + clsName + " " + t("view folder,") + "\\n";
          }
        }
        try {
          DocsList.getFolderById(dbfId).addEditor(tEmail);
          newTEmails.push(tEmail);
        } catch(err) {
          status += t("error adding as editor on") + " " + sEmail + " " + t("student dropbox folder,") + "\\n";
        }
        newTEmails = newTEmails.join(",");
        var comment = tEmail + " " + t("added as student aide by") + " " + this.userEmail + " " + t("on") + " " + Utilities.formatDate(new Date(), timeZone, 'M/d/yy');
        sheet.getRange(row, indices.tEmailIndex+1).setValue(newTEmails).setFontColor("green").setComment(comment);
        SpreadsheetApp.flush();
      }
      app.close();
      Browser.msgBox(status);
      return app;
      break;
    case 'move||school':
      var sheet = getRosterSheet();
      var dataRange = sheet.getDataRange().getValues();
      var indices = returnIndices(dataRange);
      //get the top folder for active course folders
      var topActiveClassFolder = DocsList.getFolderById(properties.topActiveClassFolderId);
      var topActiveDBFolder = DocsList.getFolderById(properties.topActiveDBFolderId);
      var topClassArchiveFolder = DocsList.getFolderById(properties.topClassArchiveFolderId);
      var topDBArchiveFolder = DocsList.getFolderById(properties.topDBArchiveFolderId);
      
      //load the existing root folder ID info for students and teachers
      var studentRoots = getFolderRoots('sRoots');
      var teacherRoots = getFolderRoots('tRoots');
      
      var destinationRsfId = e.parameter.destinationRsfId.split("||")[1];
      var destinationClass = e.parameter.destinationRsfId.split("||")[0].split(" " + this.labels().period + " ")[0];
      var destinationPer = e.parameter.destinationRsfId.split("||")[0].split(" " + this.labels().period + " ")[1];
      var destinationCrfObject = getRootClassFoldersByRSF(dataRange, destinationRsfId, indices.rsfIdIndex, indices.crfIdIndex, indices.cefIdIndex, indices.cvfIdIndex);
      var destinationCrfId = destinationCrfObject.crfId;
      for (var i=0; i<studentObjects.length; i++) {
        var idsProcessed = [];
        var sEmail = studentObjects[i]['sEmail'];
        var dbfId = studentObjects[i]['dbfId'];
        var cvfId = studentObjects[i]['cvfId'];
        var cefId = studentObjects[i]['cefId']; 
        var rsfId = studentObjects[i]['rsfId'];
        var crfId = studentObjects[i]['crfId'];
        var scfId = studentObjects[i]['scfId'];
        var clsName = studentObjects[i]['clsName'];
        var clsPer = studentObjects[i]['clsPer'];
        var sEmail = studentObjects[i]['sEmail'];
        var row =  studentObjects[i]['row']; 
        var status = "";
        //fix to include try catch, etc.
        var oldStudentCourseFolder = DocsList.getFolderById(scfId);
        var destScf = DocsList.createFolder(destinationClass);
        destScf.addViewer(sEmail);
        var destScfId = destScf.getId();
        studentRoots = moveToStudentRoot(studentRoots, sEmail, sFName, sLName, destScfId, topActiveDBFolder, topDBArchiveFolder, 'active');
        var rootStuFolder = DocsList.getFolderById(rsfId);
        var dropBoxFolder = DocsList.getFolderById(dbfId);
        var destRootStuFolder = DocsList.getFolderById(destinationRsfId);
        var destTeachers = getTeacherEmailsByRSF(dataRange, destinationRsfId, indices.rsfIdIndex, indices.tEmailIndex);
        var destTeachers = destTeachers.tEmails.replace(/\s/g, "").split(",");
        var destRsfUrl = destRootStuFolder.getUrl();
        dropBoxFolder.addToFolder(destRootStuFolder);
        dropBoxFolder.removeFromFolder(rootStuFolder);
        dropBoxFolder.addToFolder(destScf);
        dropBoxFolder.removeFromFolder(oldStudentCourseFolder);
        
        
        for (var k=0; k<destTeachers.length; k++) {
          dropBoxFolder.addEditor(destTeachers[k]);
        }
        var comment = t("Moved from") + " " + clsName ;
        if ((clsPer)&&(clsPer!='')) {
          comment += " " + this.labels().period + " " + clsPer;
        }
        comment += " " + t("to") + " " + destinationClass;
        if ((destinationPer)&&(destinationPer!='')) {
          comment += " " + this.labels().period + " " + destinationPer;
        }
        comment += " " + t("by") + " " + this.userEmail + " " + t("on") + " " + Utilities.formatDate(new Date(), timeZone, 'M/d/yy');          
        if ((destinationPer)&&(destinationPer!='')) {
          sheet.getRange(row,indices.clsPerIndex+1).setValue(destinationPer).setFontColor("blue").setComment(comment);
        }
        sheet.getRange(row,indices.tEmailIndex+1).setValue(destTeachers.join(",")).setFontColor("blue");
        sheet.getRange(row,indices.rsfIdIndex+1).setValue('=hyperlink("' + destRsfUrl + '";"' + destinationRsfId + '")');
        if (destinationCrfId!=crfId) { //Need to remove student rights on old cef and add to new cvf
          DocsList.getFolderById(cefId).removeEditor(sEmail).removeFromFolder(oldStudentCourseFolder);
          DocsList.getFolderById(cvfId).removeEditor(sEmail).removeFromFolder(oldStudentCourseFolder);
          var destCef = DocsList.getFolderById(destinationCrfObject.cefId);
          destCef.addEditor(sEmail).addToFolder(destScf);
          var destCvf = DocsList.getFolderById(destinationCrfObject.cvfId);
          destCvf.addViewer(sEmail).addToFolder(destScf);
          sheet.getRange(row,indices.clsNameIndex+1).setValue(destinationClass).setFontColor("blue").setComment(comment);
          sheet.getRange(row,indices.cefIdIndex+1).setValue('=hyperlink("' + destCef.getUrl() + '";"' + destinationCrfObject.cefId + '")');
          sheet.getRange(row,indices.cvfIdIndex+1).setValue('=hyperlink("' + destCvf.getUrl() + '";"' + destinationCrfObject.cvfId + '")');
          sheet.getRange(row,indices.scfIdIndex+1).setValue('=hyperlink("' + destScf.getUrl() + '";"' + destScfId + '")');
        } 
      }
      oldStudentCourseFolder.setTrashed(true);
      destScf.removeFromFolder(DocsList.getRootFolder());
      app.close();
      return app;
      break;
    default:
      Browser.msgBox(t("You have selected a feature that is not yet available"));
  }
}