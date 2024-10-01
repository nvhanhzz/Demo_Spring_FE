import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, Switch, Card, Select } from 'antd';
import { getAccountDetails, updateAccountDetails } from '../../services/accountService';
import './UpdateAccount.scss';

interface Account {
    id: string;
    username: string;
    email: string;
    password?: string; // Mật khẩu là trường tùy chọn
    status: string;
    roleId: number;
}

const { Option } = Select;

const UpdateAccountPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const [account, setAccount] = useState<Account | null>(null);

    useEffect(() => {
        const fetchAccountDetails = async () => {
            try {
                setLoading(true);
                const response = await getAccountDetails(id as string);

                if (response.status === 403) {
                    // Không đủ quyền truy cập
                    message.error('Bạn không đủ quyền để xem chi tiết tài khoản này.');
                    navigate('/account'); // Điều hướng về trang tài khoản
                    return;
                }

                if (!response.ok) {
                    throw new Error('Failed to fetch account details');
                }

                const result = await response.json();
                setAccount(result.data);
                form.setFieldsValue({
                    username: result.data.username,
                    email: result.data.email,
                    status: result.data.status === 'active',
                    roleId: result.data.roleId,
                });
            } catch (error: any) {
                message.error('Failed to load account details');
            } finally {
                setLoading(false);
            }
        };

        fetchAccountDetails();
    }, [id, form, navigate]);

    const onFinish = async (values: Partial<Account>) => {
        try {
            setLoading(true);
            const updatedData = {
                ...values,
                status: values.status ? 'active' : 'inactive',
            };
            const response = await updateAccountDetails(id as string, updatedData);

            if (response.status === 403) {
                // Không đủ quyền cập nhật tài khoản
                message.error('Bạn không đủ quyền để cập nhật tài khoản này.');
                return;
            }

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || 'Có lỗi xảy ra khi cập nhật tài khoản');
            }

            // Cập nhật thành công
            message.success('Cập nhật tài khoản thành công!');
            navigate('/account');
        } catch (error: any) {
            if (error instanceof Error) {
                message.error(error.message);
            } else {
                message.error('Có lỗi xảy ra, vui lòng thử lại.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!account) {
        return <div>Loading...</div>;
    }

    return (
        <div className="update-account-container">
            <Card title="Update Account" bordered={false} className="update-account-card">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        username: account.username,
                        email: account.email,
                        status: account.status === 'active',
                        roleId: account.roleId,
                    }}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input the username!' }]}
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ min: 6, message: 'Password must be at least 6 characters long!' }]}
                    >
                        <Input.Password placeholder="Enter new password if you want to change it" />
                    </Form.Item>

                    <Form.Item
                        label="Status"
                        name="status"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                    </Form.Item>

                    <Form.Item
                        label="Role"
                        name="roleId"
                        rules={[{ required: true, message: 'Please select a role!' }]}
                    >
                        <Select placeholder="Select a role">
                            <Option value={1}>Admin</Option>
                            <Option value={2}>User</Option>
                            <Option value={3}>Editor</Option>
                            <Option value={4}>Manager</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Save
                        </Button>
                        <Button
                            style={{ marginLeft: 10 }}
                            onClick={() => navigate('/account')}
                        >
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default UpdateAccountPage;