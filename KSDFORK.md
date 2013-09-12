ksdtech gClassFolders Fork 
==========================

Wanted to customize things so we can use shared iPads.  Instead of 
periods in class, the structure is changed a little bit.  Within each 
class assignments folder, we put a "shared account" folder (assigned to
each iPad).  Inside the shared account are the student dropboxes.

The permissions are:

Shared Account folder - Edit for teacher. Edit for shared account. 
View for contained student accounts.

Student dropbox folders (within shared account) - Edit for teacher.
Edit for shared account.  Edit for student account.

Under each shared account folder is also a Guest folder, with these rights:
Edit for teacher. Edit for shared account. View for all in domain.

To get this organization, we hijack the "Period" column and use it for
the shared account display name, and we add the shared account email to the 
"teacher emails".  Use just "-" for the Period label in initial settings.

We also add a student row with the first name "Guest", last name blank,
and the email of the shared account in each "Period".  This row does 
NOT have the shared account email in the teacher emails column.

Other fine points:

If you use the magic string "Omit" as the Assignment Folder label in 
initial settings, the " - Assignment" will be omitted from the student
dropbox folders.


New Script Properties
---------------------

Added one new property to change the way student names are displayed.
For privacy reasons, we list students as "Jessica C". "C, Jessica" doesn't
look so good.

studentNameDisplay (used in createDropbox)
  'lastfirst' (or null, the default) Last name, first name
  'firstli'             First name and last initial

// NEXT VERSION
addEmptyDocument
  null (default)
  non-empty string      Contents of a placeholder document to be 
                        created in every dropbox, class edit and class view
                        folder.