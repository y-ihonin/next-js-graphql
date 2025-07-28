export interface IUserPermissions {
  documentId: string;
  email: string;
  id: string;
  role: {
    description: string;
    id: string;
    name: string;
    type: string;
  };
  username: string;
}
