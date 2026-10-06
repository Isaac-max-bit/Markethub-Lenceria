import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {App} from "../App";

const router = createBrowserRouter([{
    path: "/",
    element: <App />,
    children: [
        {index: true, element: <div>Home</div>},
    ]
}]);

export default function Enrutador() {
  return <RouterProvider router={router} />;
}