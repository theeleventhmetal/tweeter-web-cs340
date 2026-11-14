import { Status} from "tweeter-shared";
import { PagedItemPresenter } from "./PagedItemPresenter";
import { StatusService } from "../model.service/StatusService";

export interface StatusItemView {
  addItems: (newItems: Status[]) => void;
  displayErrorMessage: (message: string) => void;
}

export abstract class StatusItemPresenter extends PagedItemPresenter<
  Status,
  StatusService
> {
  protected serviceFactory(): StatusService {
    return new StatusService();
  }
}
