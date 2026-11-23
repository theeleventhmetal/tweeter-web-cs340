// AI-assisted: see AI-ATTRIBUTION.md
import { compare, hash } from "bcryptjs";
import { AuthToken, User } from "tweeter-shared";
import { DaoFactory } from "../dao/DaoFactory";
import { ImageDao } from "../dao/interface/ImageDao";
import { UserDao } from "../dao/interface/UserDao";
import { AuthorizationService } from "./AuthorizationService";

const SALT_ROUNDS = 10;

export class UserService {
  private userDao: UserDao;
  private imageDao: ImageDao;
  private authorizationService: AuthorizationService;

  public constructor(daoFactory: DaoFactory) {
    this.userDao = daoFactory.createUserDao();
    this.imageDao = daoFactory.createImageDao();
    this.authorizationService = new AuthorizationService(daoFactory);
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    const userEntity = await this.userDao.getUser(alias);

    if (
      userEntity == null ||
      !(await compare(password, userEntity.passwordHash))
    ) {
      throw new Error("[Unauthorized] Invalid alias or password");
    }

    const authToken = AuthToken.Generate();
    await this.authorizationService.createSession(alias, authToken.token);

    return [
      new User(
        userEntity.firstName,
        userEntity.lastName,
        userEntity.alias,
        userEntity.imageUrl
      ),
      authToken,
    ];
  }

  public async logout(authToken: AuthToken): Promise<void> {
    await this.authorizationService.endSession(authToken);
  }

  public async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
    await this.authorizationService.validate(authToken);

    const userEntity = await this.userDao.getUser(alias);

    if (userEntity == null) {
      return null;
    }

    return new User(
      userEntity.firstName,
      userEntity.lastName,
      userEntity.alias,
      userEntity.imageUrl
    );
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytesBase64: string,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    const existingUser = await this.userDao.getUser(alias);
    if (existingUser != null) {
      throw new Error("[BadRequest] An account with that alias already exists");
    }

    const imageUrl = await this.imageDao.uploadImage(
      `${alias}.${imageFileExtension}`,
      userImageBytesBase64
    );

    const passwordHash = await hash(password, SALT_ROUNDS);

    await this.userDao.createUser({
      alias,
      firstName,
      lastName,
      passwordHash,
      imageUrl,
    });

    const authToken = AuthToken.Generate();
    await this.authorizationService.createSession(alias, authToken.token);

    return [new User(firstName, lastName, alias, imageUrl), authToken];
  }
}
