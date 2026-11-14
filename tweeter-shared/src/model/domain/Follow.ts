// AI-assisted: see AI-ATTRIBUTION.md
import { User, UserDto } from "./User";

export interface FollowDto {
    follower: UserDto;
    followee: UserDto;
}

export class Follow {
    private _follower: User;
    private _followee: User;

    public constructor(follower: User, followee: User) {
        this._follower = follower;
        this._followee = followee;
    }

    public get follower(): User {
        return this._follower;
    }

    public set follower(value: User) {
        this._follower = value;
    }
    
    public get followee(): User {
        return this._followee;
    }

    public set followee(value: User) {
        this._followee = value;
    }

    public toDto(): FollowDto {
        return {
            follower: this._follower.toDto(),
            followee: this._followee.toDto(),
        };
    }

    public static fromDto(dto: FollowDto | null | undefined): Follow | null {
        if (!!dto) {
            return new Follow(
                User.fromDto(dto.follower) as User,
                User.fromDto(dto.followee) as User
            );
        } else {
            return null;
        }
    }
}
