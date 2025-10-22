import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import FormContainer from "./Components/FormContainer";
import Navbar from "./Components/Navbar";
import Dashboard from "./Components/Dashboard";
import Homepage from "./Components/Homepage";
import Settings from "./Components/Settings";
import ProtectedRoute from "./Components/ProtectedRoute";
import TermsAndConditions from "./Components/TermsAndConditions";

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
        path: '/terms',
        element: <TermsAndConditions />
    },
    {
        path:'/',
        element: <ProtectedRoute />,
        children:[
            {
                path: '',
                element: <Navbar />,
                children:[
                    {
                        index:true,
                        element: <Navigate to="/view-subs" replace />
                    },
                    {
                        path:'addSubs',
                        element:<FormContainer/>
                    },
                    {
                        path:'view-subs',
                        element:<Dashboard/>
                    },
                    {
                        path:'settings',
                        element:<Settings/>
                    }
                ]
            }
        ]
    }
]);

export default router;
