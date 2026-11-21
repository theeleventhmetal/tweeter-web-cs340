// AI-assisted: see AI-ATTRIBUTION.md

export interface UserEntity {
  alias: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  imageUrl: string;
}

export interface UserDao {
  getUser(alias: string): Promise<UserEntity | null>;
  createUser(user: UserEntity): Promise<void>;
}
