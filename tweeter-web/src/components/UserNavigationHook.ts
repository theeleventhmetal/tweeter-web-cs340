import { useMessageActions } from "./toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "./userInfo/UserInfoHooks";
import { useNavigate } from "react-router-dom";
import {
  UserNavigationPresenter,
  UserNavigationView,
} from "../presenter/UserNavigationPresenter";
import { useRef } from "react";

export const useUserNavigation = (featureUrl: string) => {
  const { displayErrorMessage } = useMessageActions();
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();

  const navigate = useNavigate();

  const listener: UserNavigationView = {
    setDisplayedUser: setDisplayedUser,
    navigate: navigate,
    displayErrorMessage: displayErrorMessage,
  };

  const presenterRef = useRef<UserNavigationPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new UserNavigationPresenter(listener);
  }

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    await presenterRef.current!.navigateToUser(
      event.target.toString(),
      authToken!,
      displayedUser!,
      featureUrl,
    );
  };

  return { navigateToUser };
};
