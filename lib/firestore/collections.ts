// Firestore collection path helpers

export const collections = {
  // Users collection
  users: (userId: string) => `users/${userId}`,
  
  // Gyms collection
  gyms: () => "gyms",
  gym: (gymId: string) => `gyms/${gymId}`,
  
  // Permission sets
  permissionSets: (gymId: string) => `gyms/${gymId}/permissionSets`,
  permissionSet: (gymId: string, setId: string = "main") => 
    `gyms/${gymId}/permissionSets/${setId}`,
  
  // Staff
  staff: (gymId: string) => `gyms/${gymId}/staff`,
  staffMember: (gymId: string, userId: string) => 
    `gyms/${gymId}/staff/${userId}`,
  
  // Plans
  plans: (gymId: string) => `gyms/${gymId}/plans`,
  plan: (gymId: string, planId: string) => 
    `gyms/${gymId}/plans/${planId}`,
  
  // Members
  members: (gymId: string) => `gyms/${gymId}/members`,
  member: (gymId: string, memberId: string) => 
    `gyms/${gymId}/members/${memberId}`,
  
  // Subscriptions
  subscriptions: (gymId: string) => `gyms/${gymId}/subscriptions`,
  subscription: (gymId: string, subscriptionId: string) => 
    `gyms/${gymId}/subscriptions/${subscriptionId}`,
  
  // Invites
  invites: (gymId: string) => `gyms/${gymId}/invites`,
  invite: (gymId: string, inviteId: string) => 
    `gyms/${gymId}/invites/${inviteId}`,
  
  // Transactions (for future use)
  transactions: (gymId: string) => `gyms/${gymId}/transactions`,
  
  // Notifications (for future use)
  notifications: (gymId: string) => `gyms/${gymId}/notifications`,
};


