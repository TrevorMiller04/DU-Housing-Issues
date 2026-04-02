export const FLOORS = [
  { id: 'B', label: 'Basement', svgKey: 'Basement' },
  { id: '1', label: 'First Floor', svgKey: 'FirstFloor' },
  { id: '2', label: 'Second Floor', svgKey: 'SecondFloor' },
  { id: '3', label: 'Third Floor', svgKey: 'ThirdFloor' },
]

export const ROOMS = [
  // Basement
  {
    floorId: 'B',
    roomId: 'Room-basement',
    label: 'Main Basement',
    issueTypes: ['Flooring', 'Window issue', 'Damaged elevated', 'Other'],
  },
  {
    floorId: 'B',
    roomId: 'Room-kitchen',
    label: 'Kitchen',
    issueTypes: ['Door/lock issue', 'Other'],
  },
  {
    floorId: 'B',
    roomId: 'Room-boiler',
    label: 'Boiler Room',
    issueTypes: ['Other'],
  },
  {
    floorId: 'B',
    roomId: 'Room-snack',
    label: 'Snack Room',
    issueTypes: ['Other'],
  },
  {
    floorId: 'B',
    roomId: 'Room-gym',
    label: 'Gym',
    issueTypes: ['Other'],
  },
  // First Floor
  {
    floorId: '1',
    roomId: 'Room-Hallway-1',
    label: 'Hallway',
    issueTypes: ['Broken smoke detector', 'Blocked staircase', 'Other'],
  },
  {
    floorId: '1',
    roomId: 'Room-composite',
    label: 'Composite Room',
    issueTypes: ['Wall damage', 'Window issue', 'Pool table', 'Other'],
  },
  {
    floorId: '1',
    roomId: 'Room-laundry',
    label: 'Laundry Room',
    issueTypes: ['Washer issue', 'Dryer issue', 'Window issue', 'Other'],
  },
  {
    floorId: '1',
    roomId: 'Room-bathroom-1',
    label: 'Bathroom',
    issueTypes: ['Clogged toilet', 'Window issue', 'Other'],
  },
  {
    floorId: '1',
    roomId: 'Room-poker',
    label: 'Poker Room',
    issueTypes: ['Wall damage', 'Window issue', 'Other'],
  },
  {
    floorId: '1',
    roomId: 'Room-chapter',
    label: 'Chapter Room',
    issueTypes: ['Wall damage', 'Window issue', 'Other'],
  },
  // Second Floor
  {
    floorId: '2',
    roomId: 'Room-Hallway-2',
    label: 'Hallway',
    issueTypes: ['Broken smoke detector', 'Blocked staircase', 'Other'],
  },
  {
    floorId: '2',
    roomId: 'Room-Bathroom-2',
    label: 'Bathroom',
    issueTypes: ['Clogged toilet', 'Window issue', 'Other'],
  },
  {
    floorId: '2',
    roomId: 'Room-201',
    label: 'Room 201',
    issueTypes: ['Door/lock issue', 'Window issue', 'Wall damage', 'Other'],
  },
  {
    floorId: '2',
    roomId: 'Room-202',
    label: 'Room 202',
    issueTypes: ['Door/lock issue', 'Window issue', 'Wall damage', 'Other'],
  },
  {
    floorId: '2',
    roomId: 'Room-203',
    label: 'Room 203',
    issueTypes: ['Door/lock issue', 'Window issue', 'Wall damage', 'Other'],
  },
  {
    floorId: '2',
    roomId: 'Room-204',
    label: 'Room 204',
    issueTypes: ['Door/lock issue', 'Window issue', 'Wall damage', 'Other'],
  },
  {
    floorId: '2',
    roomId: 'Room-205',
    label: 'Room 205',
    issueTypes: ['Door/lock issue', 'Window issue', 'Wall damage', 'Other'],
  },
  {
    floorId: '2',
    roomId: 'Room-206',
    label: 'Room 206',
    issueTypes: ['Door/lock issue', 'Window issue', 'Wall damage', 'Other'],
  },
  {
    floorId: '2',
    roomId: 'Room-207',
    label: 'Room 207',
    issueTypes: ['Door/lock issue', 'Window issue', 'Wall damage', 'Other'],
  },
  {
    floorId: '2',
    roomId: 'Room-208',
    label: 'Room 208',
    issueTypes: ['Door/lock issue', 'Window issue', 'Wall damage', 'Other'],
  },
  {
    floorId: '2',
    roomId: 'Room-209',
    label: 'Room 209',
    issueTypes: ['Door/lock issue', 'Window issue', 'Wall damage', 'Other'],
  },
  {
    floorId: '2',
    roomId: 'Room-210',
    label: 'Room 210',
    issueTypes: ['Door/lock issue', 'Window issue', 'Wall damage', 'Other'],
  },
  {
    floorId: '2',
    roomId: 'Room-211',
    label: 'Room 211',
    issueTypes: ['Door/lock issue', 'Window issue', 'Wall damage', 'Other'],
  },
  {
    floorId: '2',
    roomId: 'Room-212',
    label: 'Room 212',
    issueTypes: ['Door/lock issue', 'Window issue', 'Wall damage', 'Other'],
  },
  // Third Floor
  {
    floorId: '3',
    roomId: 'Room-Hallway-3',
    label: 'Hallway',
    issueTypes: ['Broken smoke detector', 'Blocked staircase', 'Other'],
  },
  {
    floorId: '3',
    roomId: 'Room-Bathroom-3',
    label: 'Bathroom',
    issueTypes: ['Clogged toilet', 'Window issue', 'Other'],
  },
  {
    floorId: '3',
    roomId: 'Room-301',
    label: 'Room 301',
    issueTypes: ['Door/lock issue', 'Window issue', 'Wall damage', 'Other'],
  },
  {
    floorId: '3',
    roomId: 'Room-302',
    label: 'Room 302',
    issueTypes: ['Door/lock issue', 'Window issue', 'Wall damage', 'Other'],
  },
  {
    floorId: '3',
    roomId: 'Room-303',
    label: 'Room 303',
    issueTypes: ['Door/lock issue', 'Window issue', 'Wall damage', 'Other'],
  },
  {
    floorId: '3',
    roomId: 'Room-304',
    label: 'Room 304',
    issueTypes: ['Door/lock issue', 'Window issue', 'Wall damage', 'Other'],
  },
  {
    floorId: '3',
    roomId: 'Room-305',
    label: 'Room 305',
    issueTypes: ['Door/lock issue', 'Window issue', 'Wall damage', 'Other'],
  },
  {
    floorId: '3',
    roomId: 'Room-306',
    label: 'Room 306',
    issueTypes: ['Door/lock issue', 'Window issue', 'Wall damage', 'Other'],
  },
  {
    floorId: '3',
    roomId: 'Room-307',
    label: 'Room 307',
    issueTypes: ['Door/lock issue', 'Window issue', 'Wall damage', 'Other'],
  },
  {
    floorId: '3',
    roomId: 'Room-308',
    label: 'Room 308',
    issueTypes: ['Door/lock issue', 'Window issue', 'Wall damage', 'Other'],
  },
  {
    floorId: '3',
    roomId: 'Room-309',
    label: 'Room 309',
    issueTypes: ['Door/lock issue', 'Window issue', 'Wall damage', 'Other'],
  },
  {
    floorId: '3',
    roomId: 'Room-310',
    label: 'Room 310',
    issueTypes: ['Door/lock issue', 'Window issue', 'Wall damage', 'Other'],
  },
  {
    floorId: '3',
    roomId: 'Room-311',
    label: 'Room 311',
    issueTypes: ['Door/lock issue', 'Window issue', 'Wall damage', 'Other'],
  },
  {
    floorId: '3',
    roomId: 'Room-312',
    label: 'Room 312',
    issueTypes: ['Door/lock issue', 'Window issue', 'Wall damage', 'Other'],
  },
]

export function getRoomsByFloor(floorId) {
  return ROOMS.filter((r) => r.floorId === floorId)
}

export function getRoom(roomId) {
  return ROOMS.find((r) => r.roomId === roomId)
}

export function getFloor(floorId) {
  return FLOORS.find((f) => f.id === floorId)
}
