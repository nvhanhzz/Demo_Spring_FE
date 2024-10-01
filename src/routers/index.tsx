import { useAuth } from "../hooks/useAuth";
import LoginPage from "../pages/Login";
import LayoutDefault from "../layouts/LayoutDefault";
import AuthLayout from "../layouts/AuthLayout";
import AccountPage from "../pages/Account";
import ProductPage from "../pages/Product";
import UpdateAccountPage from "../pages/UpdateAccount";
import CreateAccount from "../pages/CreateAccount";
import CreateProduct from "../pages/CreateProduct";
import UpdateProduct from "../pages/UpdateProduct";

interface RouteType {
    path: string;
    element: React.ReactElement;
    children?: RouteType[];
}

const AuthRoutes: RouteType[] = [
    {
        path: '',
        element: <LoginPage />,
    },
    {
        path: '*',
        element: <LoginPage />,
    },
];

const DefaultRoutes: RouteType[] = [
    {
        path: '/account/update/:id',
        element: <UpdateAccountPage />,
    },
    {
        path: '/account/create',
        element: <CreateAccount />,
    },
    {
        path: '/account',
        element: <AccountPage />,
    },
    {
        path: '/product/create', // Thêm tuyến đường cho trang tạo mới sản phẩm
        element: <CreateProduct />,
    },
    {
        path: '/product/update/:id', // Thêm tuyến đường cho trang cập nhật sản phẩm
        element: <UpdateProduct />,
    },
    {
        path: '/product',
        element: <ProductPage />,
    },
    {
        path: '*',
        element: <AccountPage />,
    },
];


function Routes() {
    const isLoggedIn = useAuth();

    return [
        {
            path: '',
            element: isLoggedIn ? <LayoutDefault /> : <AuthLayout />,
            children: isLoggedIn
                ? DefaultRoutes
                : AuthRoutes,
        }
    ];
}

export default Routes;