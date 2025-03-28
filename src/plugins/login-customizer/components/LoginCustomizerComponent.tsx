import { useEffect } from "react";
import muniLogo from "../assets/muni-lg-rgb.png";

interface LoginCustomizerProps {
  setLogo: (logo: string) => void;
  setloginPageText: (text: string) => void;
}

/**
 * Component that customizes the login page appearance
 * This is designed to be used with the loginCustomization extension point
 */
const LoginCustomizerComponent = (props: LoginCustomizerProps) => {
  const { setLogo, setloginPageText } = props;

  const customText =
    "Masaryk University is the second largest university in the Czech Republic. Founded in 1919 in Brno, it now consists of ten faculties and around 35,000 students. It is named after Tomáš Garrigue Masaryk, the first president of an independent Czechoslovakia.";

  useEffect(() => {
    setLogo(muniLogo);
    setloginPageText(customText);

    // component unmounts
    return () => {
      setLogo("");
      setloginPageText("");
    };
  }, [setLogo, setloginPageText]);

  return null;
};

export default LoginCustomizerComponent;
