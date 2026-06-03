# Graph Report - medicalAi-fe  (2026-05-06)

## Corpus Check
- 274 files · ~195,399 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 534 nodes · 381 edges · 41 communities detected
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 37 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]

## God Nodes (most connected - your core abstractions)
1. `useScreenWidth()` - 26 edges
2. `TabelComponent()` - 10 edges
3. `ChatRoom()` - 6 edges
4. `extractDateTimeComponents()` - 6 edges
5. `ChatList()` - 5 edges
6. `PreExistingCondition()` - 4 edges
7. `Allergies()` - 4 edges
8. `SurgicalHistory()` - 4 edges
9. `FamilyHistory()` - 4 edges
10. `SocialHistory()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Appointments()` --calls--> `useScreenWidth()`  [INFERRED]
  src/app/(route)/doctor/appointments/page.jsx → src/hooks/useScreenWidth.js
- `ChatRoom()` --calls--> `useScreenWidth()`  [INFERRED]
  src/components/webComponent/videoCall/chatRoom.js → src/hooks/useScreenWidth.js
- `ChatRoom()` --calls--> `stringAvatar()`  [INFERRED]
  src/components/webComponent/videoCall/chatRoom.js → src/lib/utils.js
- `MessangerView()` --calls--> `useScreenWidth()`  [INFERRED]
  src/app/(route)/patient/messanger/parts/index.jsx → src/hooks/useScreenWidth.js
- `ChatList()` --calls--> `useScreenWidth()`  [INFERRED]
  src/app/(route)/patient/messanger/parts/chatList.jsx → src/hooks/useScreenWidth.js

## Communities

### Community 0 - "Community 0"
Cohesion: 0.04
Nodes (20): ChatBotRoom(), ChatHistory(), ChatItems(), ChatList(), GridViewFilterList(), ChatRoom(), FilteredHospital(), HorizontalCalendar() (+12 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (13): AppointmentDetails(), InvoiceDetails(), ChatRoom(), AppointmentCard(), ProfileDetails(), RenderDoctorProfile(), RequestQuestionsModal(), extractDateTimeComponents() (+5 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (8): Appointments(), Appointments(), BookAppointments(), columns(), Invoices(), SingleSlotButton(), TabelComponent(), UserManagment()

### Community 6 - "Community 6"
Cohesion: 0.38
Nodes (3): ChatList(), MessangerUserListItem(), truncate()

### Community 8 - "Community 8"
Cohesion: 0.5
Nodes (2): stringAvatar(), stringToColor()

### Community 9 - "Community 9"
Cohesion: 0.4
Nodes (1): PreExistingCondition()

### Community 10 - "Community 10"
Cohesion: 0.4
Nodes (1): Allergies()

### Community 11 - "Community 11"
Cohesion: 0.4
Nodes (1): SurgicalHistory()

### Community 12 - "Community 12"
Cohesion: 0.4
Nodes (1): FamilyHistory()

### Community 13 - "Community 13"
Cohesion: 0.4
Nodes (1): SocialHistory()

### Community 14 - "Community 14"
Cohesion: 0.4
Nodes (1): MedicalHistory()

### Community 15 - "Community 15"
Cohesion: 0.4
Nodes (1): AddHopiModal()

### Community 17 - "Community 17"
Cohesion: 0.4
Nodes (1): HOPI()

### Community 18 - "Community 18"
Cohesion: 0.4
Nodes (2): MessangerView(), useSocket()

### Community 19 - "Community 19"
Cohesion: 0.67
Nodes (2): CalendarView(), eventContent()

### Community 20 - "Community 20"
Cohesion: 0.5
Nodes (1): Medications()

### Community 21 - "Community 21"
Cohesion: 0.5
Nodes (1): Insurance()

### Community 22 - "Community 22"
Cohesion: 0.5
Nodes (1): PatientAssessment()

### Community 23 - "Community 23"
Cohesion: 0.5
Nodes (1): Consultation()

### Community 24 - "Community 24"
Cohesion: 0.5
Nodes (1): SOAPNotes()

### Community 25 - "Community 25"
Cohesion: 0.5
Nodes (1): AddSoapNotesModal()

### Community 26 - "Community 26"
Cohesion: 0.67
Nodes (2): Appointments(), TabelComponent()

### Community 27 - "Community 27"
Cohesion: 0.67
Nodes (2): TabelComponent(), UserList()

### Community 30 - "Community 30"
Cohesion: 0.5
Nodes (1): Prescription()

### Community 31 - "Community 31"
Cohesion: 0.67
Nodes (2): AddConsultationModal(), CustomeRadioButton()

### Community 32 - "Community 32"
Cohesion: 0.5
Nodes (2): DashboardLayout(), useWidthToggle()

### Community 34 - "Community 34"
Cohesion: 0.67
Nodes (1): Loading()

### Community 36 - "Community 36"
Cohesion: 0.67
Nodes (1): UserProfile()

### Community 37 - "Community 37"
Cohesion: 0.67
Nodes (1): ChatView()

### Community 39 - "Community 39"
Cohesion: 0.67
Nodes (1): Messanger()

### Community 40 - "Community 40"
Cohesion: 0.67
Nodes (1): VideoCalling()

### Community 42 - "Community 42"
Cohesion: 0.67
Nodes (1): AppointmenChart()

### Community 43 - "Community 43"
Cohesion: 0.67
Nodes (1): CalendarView()

### Community 44 - "Community 44"
Cohesion: 0.67
Nodes (1): WeeklyAppointments()

### Community 45 - "Community 45"
Cohesion: 0.67
Nodes (1): PatientChart()

### Community 48 - "Community 48"
Cohesion: 0.67
Nodes (1): FindDoctor()

### Community 52 - "Community 52"
Cohesion: 0.67
Nodes (1): SurgicalHistoryModal()

### Community 53 - "Community 53"
Cohesion: 0.67
Nodes (1): AddFamilyHistoryModal()

### Community 54 - "Community 54"
Cohesion: 0.67
Nodes (1): AddAllergyModal()

### Community 57 - "Community 57"
Cohesion: 0.67
Nodes (1): MedicationTable()

### Community 58 - "Community 58"
Cohesion: 0.67
Nodes (1): MedicationModal()

## Knowledge Gaps
- **Thin community `Community 8`** (5 nodes): `ChatHistoryDrawer()`, `getCurrentTime()`, `stringAvatar()`, `stringToColor()`, `chatHistoryDrawer.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (5 nodes): `PreExistingCondition()`, `preExistingCondition.jsx`, `preExistingCondition.jsx`, `preExistingCondition.jsx`, `preExistingCondition.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (5 nodes): `Allergies()`, `allergies.jsx`, `allergies.jsx`, `allergies.jsx`, `allergies.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (5 nodes): `surgicalHistory.jsx`, `surgicalHistory.jsx`, `surgicalHistory.jsx`, `surgicalHistory.jsx`, `SurgicalHistory()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (5 nodes): `FamilyHistory()`, `familyHistory.jsx`, `familyHistory.jsx`, `familyHistory.jsx`, `familyHistory.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (5 nodes): `SocialHistory()`, `socialHistory.jsx`, `socialHistory.jsx`, `socialHistory.jsx`, `socialHistory.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (5 nodes): `MedicalHistory()`, `index.jsx`, `index.jsx`, `index.jsx`, `index.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (5 nodes): `AddHopiModal()`, `CustomeRadioButton()`, `addHopiModal.jsx`, `addHopiModal.jsx`, `addHopiModal.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (5 nodes): `DetailModal()`, `HOPI()`, `index.jsx`, `index.jsx`, `index.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (5 nodes): `MessangerView()`, `index.jsx`, `index.jsx`, `useSocket.js`, `useSocket()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (4 nodes): `CalendarView()`, `eventContent()`, `page.jsx`, `page.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (4 nodes): `Medications()`, `TabelComponent()`, `medications.jsx`, `medications.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (4 nodes): `Insurance()`, `insurance.jsx`, `insurance.jsx`, `insurance.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (4 nodes): `PatientAssessment()`, `index.jsx`, `index.jsx`, `index.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (4 nodes): `Consultation()`, `index.jsx`, `index.jsx`, `index.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (4 nodes): `SOAPNotes()`, `index.jsx`, `index.jsx`, `index.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (4 nodes): `AddSoapNotesModal()`, `addSoapNotesModal.jsx`, `addSoapNotesModal.jsx`, `addSoapNotesModal.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (4 nodes): `Appointments()`, `TabelComponent()`, `appointment.jsx`, `appointment.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (4 nodes): `userList.jsx`, `userList.jsx`, `TabelComponent()`, `UserList()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (4 nodes): `DetailModal()`, `Prescription()`, `prescription.jsx.jsx`, `prescription.jsx.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (4 nodes): `AddConsultationModal()`, `CustomeRadioButton()`, `addConsultationModal.jsx`, `addConsultationModal.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (4 nodes): `DashboardLayout()`, `index.js`, `useWidthToggle.js`, `useWidthToggle()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (3 nodes): `Loading()`, `loading.js`, `loading.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (3 nodes): `UserProfile()`, `page.jsx`, `page.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (3 nodes): `ChatView()`, `index.jsx`, `index.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (3 nodes): `Messanger()`, `page.jsx`, `page.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (3 nodes): `VideoCalling()`, `index.jsx`, `index.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 42`** (3 nodes): `AppointmenChart()`, `appointmentChart.jsx`, `appointmentChart.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 43`** (3 nodes): `CalendarView()`, `calendar.jsx`, `calendar.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (3 nodes): `weeklyAppointments.jsx`, `weeklyAppointments.jsx`, `WeeklyAppointments()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 45`** (3 nodes): `PatientChart()`, `patientsChart.jsx`, `patientsChart.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 48`** (3 nodes): `FindDoctor()`, `index.jsx`, `index.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 52`** (3 nodes): `SurgicalHistoryModal()`, `addSurgicalHistoryModal.jsx`, `addSurgicalHistoryModal.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 53`** (3 nodes): `AddFamilyHistoryModal()`, `addFamilyHistoryModal.jsx`, `addFamilyHistoryModal.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 54`** (3 nodes): `AddAllergyModal()`, `addAllergyModal.jsx`, `addAllergyModal.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 57`** (3 nodes): `MedicationTable()`, `medicationTable.jsx`, `medicationTable.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 58`** (3 nodes): `MedicationModal()`, `addMadicationModal.jsx`, `addMadicationModal.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useScreenWidth()` connect `Community 0` to `Community 1`, `Community 2`, `Community 18`, `Community 6`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `ChatRoom()` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Are the 25 inferred relationships involving `useScreenWidth()` (e.g. with `Appointments()` and `ChatRoom()`) actually correct?**
  _`useScreenWidth()` has 25 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `ChatRoom()` (e.g. with `useScreenWidth()` and `stringAvatar()`) actually correct?**
  _`ChatRoom()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `extractDateTimeComponents()` (e.g. with `ProfileDetails()` and `InvoiceDetails()`) actually correct?**
  _`extractDateTimeComponents()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.04 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._