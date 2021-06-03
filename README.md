# FHIRCourseManagement
FHIR 課程管理系統

Step:
1. User Login (loginPerson.html)
   * Username: test1, Password: test1 (Person/2139338)
   * Username: test2, Password: test2 (Person/2139881)
2. Show course related information
   * Get & Show Member ID (Person.entry[0].resource.link[0].target.reference)
   * Get Organization ID (Person.managingOrganization.reference)
   * Get & Show Organization name (Organization.name)
   * Get all user’s Appointment
      * Get & Show Appointment ID (Appointment.entry[i].resource.id)
      * Get Slot ID (Appointment.entry[i].resource.slot[0].reference)
      * Get & Show Slot course name (Slot.specialty[0].coding[0].display)
      * Get & Show Slot course start date (Slot.start)
      * Get & Show Slot course end date (Slot.end)
      * Get Schedule ID (Slot.schedule.reference)
      * Get PractitionerRole ID (Schedule.actor[0].reference)
      * Get & Show PractitionerRole name (PractitionerRole.practitioner.display)

