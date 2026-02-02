import { useContext } from "react";
import { SettingsProviderContext } from "./context";

export const useSettingsProvider = () => useContext(SettingsProviderContext);
