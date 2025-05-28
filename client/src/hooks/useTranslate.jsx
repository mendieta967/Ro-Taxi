import { TranslateContext } from "../context/TranslateLanguage";
import { useContext } from "react";
import { diccionario } from "../translate/diccionario";

export const useTranslate = () => {
  const { language } = useContext(TranslateContext);

  return (key) => {
    const translate =
      diccionario[language]?.find((t) => t.key === key)?.value ||
      diccionario["en"]?.find((t) => t.key === key)?.value;
    return translate || key;
  };
};
