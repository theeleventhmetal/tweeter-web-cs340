// AI-assisted: see AI-ATTRIBUTION.md

export interface FollowDao {
  follow(followerAlias: string, followeeAlias: string): Promise<void>;
  unfollow(followerAlias: string, followeeAlias: string): Promise<void>;
  isFollower(followerAlias: string, followeeAlias: string): Promise<boolean>;
  getFolloweeCount(alias: string): Promise<number>;
  getFollowerCount(alias: string): Promise<number>;

  getPageOfFolloweeAliases(
    followerAlias: string,
    pageSize: number,
    lastAlias: string | null
  ): Promise<[string[], boolean]>;

  getPageOfFollowerAliases(
    followeeAlias: string,
    pageSize: number,
    lastAlias: string | null
  ): Promise<[string[], boolean]>;

  getAllFollowerAliases(followeeAlias: string): Promise<string[]>;
}
