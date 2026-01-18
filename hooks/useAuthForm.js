import { useState, useCallback } from "react";
import { useFirebaseAuth } from "../context/FirebaseAuthContext";

export const useAuthForm = () => {
  const { login, register, resetPassword, sendVerification, loading, error } =
    useFirebaseAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [showReset, setShowReset] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const handleLogin = useCallback(
    async (email, password) => {
      setLocalError(null);
      if (!email || !password) {
        setLocalError("Please enter email and password.");
        return;
      }
      await login(email, password);
    },
    [login]
  );

  const handleRegister = useCallback(
    async (email, password, displayName) => {
      setLocalError(null);
      setRegisterSuccess(false);
      if (!email || !password || !displayName) {
        setLocalError("Please fill all fields.");
        return;
      }
      await register(email, password, displayName);
      setRegisterSuccess(true);
    },
    [register]
  );

  const handleResetPassword = useCallback(
    async (resetEmail) => {
      setResetMessage("");
      if (!resetEmail) {
        setResetMessage("Please enter your email.");
        return;
      }
      await resetPassword(resetEmail);
      setResetMessage(
        "If this email is registered, a reset link has been sent."
      );
    },
    [resetPassword]
  );

  const toggleMode = useCallback(() => {
    setIsRegister(!isRegister);
    setLocalError(null);
    setRegisterSuccess(false);
  }, [isRegister]);

  const toggleReset = useCallback(() => {
    setShowReset(!showReset);
    setResetMessage("");
  }, [showReset]);

  return {
    isRegister,
    localError,
    showReset,
    resetMessage,
    registerSuccess,
    loading,
    error: localError || error,
    handleLogin,
    handleRegister,
    handleResetPassword,
    toggleMode,
    toggleReset,
    sendVerification,
  };
};
