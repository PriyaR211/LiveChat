import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import RegisterPage from "../pages/RegisterPage";
import CheckEmailPage from "../pages/CheckEmailPage";
import CheckPasswordPage from "../pages/CheckPasswordPage";
import Home from "../pages/Home";
import MessagePage from "../components/MessagePage";
import AuthLayouts from "../layout";
import Forgotpassword from "../pages/Forgotpassword";

const router = createBrowserRouter([
    {
        path:"/",
        element:<App></App>,
        children:[
            {
                path:"register",
                element:  <AuthLayouts> <RegisterPage></RegisterPage> </AuthLayouts> 
            },
            {
                path:"email",
                element:<AuthLayouts> <CheckEmailPage></CheckEmailPage> </AuthLayouts>
            },
            {
                path:"password",
                element:<AuthLayouts> <CheckPasswordPage></CheckPasswordPage> </AuthLayouts>
            },
            {
                path:"forgot-password",
                element:<AuthLayouts> <Forgotpassword></Forgotpassword> </AuthLayouts>
            },
            {
                path:"",
                element:<Home></Home>,
                children:[
                    {
                        path:":userId",
                        element:<MessagePage></MessagePage>
                    }
                ]
            }
        ]

    }
])


export default router;
