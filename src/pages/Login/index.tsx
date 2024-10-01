import React from 'react';
import { Form, Input, Button, Typography } from 'antd';
import './LoginPage.scss';
import { addAlert } from '../../redux/actions/alert';
import { postLogin } from '../../services/authService';
import { useDispatch } from 'react-redux';
import { setCookie } from '../../utils/cookies';
import { setCurrentAccountHelper } from '../../helpers/Account';
import { setCurrentAccount } from '../../redux/actions/account';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Login: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onFinish = async (values: { username: string; password: string }): Promise<void> => {
        const response = await postLogin(values);

        const result = await response.json();
        if (result.status !== 200) {
            dispatch(addAlert("Thất bại", "Đăng nhập thất bại", 5));
            return;
        }

        const data = result.data;
        setCookie('token', data.token, 60 * 60);
        try {
            const account = await setCurrentAccountHelper();
            dispatch(setCurrentAccount(account));
            navigate("/account");
        } catch (error) {
            console.error("Error checking logged in status:", error);
            dispatch(setCurrentAccount(null));
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <Title level={2} className="login-title">
                    Login
                </Title>
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    className="login-form"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input placeholder="Username" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;