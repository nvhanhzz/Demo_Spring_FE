import React from 'react';
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { deleteCookie } from '../../utils/cookies';
import { useDispatch } from 'react-redux';
import { setCurrentAccount } from '../../redux/actions/account';

const LogoutButton: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        deleteCookie("token");
        dispatch(setCurrentAccount(null));
        navigate("/");
    };

    return (
        <Button
            type="primary"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
        >
            Logout
        </Button>
    );
};

export default LogoutButton;