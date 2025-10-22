import { createBrowserRouter } from "react-router-dom";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import FormContainer from "./Components/FormContainer";
import Navbar from "./Components/Navbar";
import Dashboard from "./Components/Dashboard";
import Homepage from "./Components/Homepage";

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/signup',
        element: <Signup />
    },
    {
        path:'/',
        element:<Navbar/>,
        children:[
            {
                index:true,
                element:<Homepage/>
            },
            {
                path:'addSubs',
                element:<FormContainer/>
            },
            {
                path:'view-subs',
                element:<Dashboard/>
            }
        ]
    }
]);

export default router;
