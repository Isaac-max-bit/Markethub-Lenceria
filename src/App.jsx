import { BrowserRouter } from "react-router-dom";
import { CarritoProvider } from "./context/CarritoProvider";
import AppRouter from "./router/AppRouter";

export default function App() {
  return (
    <BrowserRouter>
      <CarritoProvider>
        <AppRouter />
      </CarritoProvider>
    </BrowserRouter>
  );
}
