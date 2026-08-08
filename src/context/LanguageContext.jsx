import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { translations } from "../i18n/translations";
// eslint-disable-next-line react-refresh/only-export-components
export const LanguageContext = createContext(null);

const STORAGE_KEY = "islamic-school-language";
const DEFAULT_LANGUAGE = "bn";

const getInitialLanguage = () => {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;

  const savedLanguage = localStorage.getItem(STORAGE_KEY);
  return savedLanguage === "en" || savedLanguage === "bn"
    ? savedLanguage
    : DEFAULT_LANGUAGE;
};

const getNestedValue = (object, path) =>
  path.split(".").reduce((current, key) => current?.[key], object);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = useCallback((nextLanguage) => {
    if (nextLanguage === "bn" || nextLanguage === "en") {
      setLanguage(nextLanguage);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage((current) => (current === "bn" ? "en" : "bn"));
  }, []);

  const t = useCallback(
    (key, variables = {}) => {
      const selectedValue = getNestedValue(translations[language], key);
      const fallbackValue = getNestedValue(translations[DEFAULT_LANGUAGE], key);

      const value = selectedValue ?? fallbackValue ?? key;

      if (typeof value !== "string") return key;

      return Object.entries(variables).reduce(
        (text, [name, replacement]) =>
          text.replaceAll(`{{${name}}}`, String(replacement)),
        value,
      );
    },
    [language],
  );

  const value = useMemo(
    () => ({
      language,
      isBangla: language === "bn",
      changeLanguage,
      toggleLanguage,
      t,
    }),
    [language, changeLanguage, toggleLanguage, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
