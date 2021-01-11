import "../styles/globals.css";
import { toProperCase } from "../lib/utility";

function App({ Component, pageProps }) {
  String.prototype.toProperCase = toProperCase;
  return <Component {...pageProps} />;
}

export default App;
