import { Outlet, useNavigate } from "react-router-dom";
import { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    ShopOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import "./LayoutDefault.scss";
import LogoutButton from "../../components/LogoutButton";

const { Header, Sider, Content } = Layout;

function LayoutDefault() {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // Xử lý sự kiện onClick cho Menu
    const handleMenuClick = (menuItem: { key: any; }) => {
        switch (menuItem.key) {
            case '1':
                navigate("/account"); // Điều hướng đến trang "Account"
                break;
            case '2':
                navigate("/product"); // Điều hướng đến trang "Product"
                break;
            default:
                break;
        }
    };

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" onClick={() => navigate("/account")}>LOGO</div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    onClick={handleMenuClick} // Gán sự kiện onClick cho Menu
                    items={[
                        {
                            key: '1',
                            icon: <UserOutlined />,
                            label: 'Account',
                        },
                        {
                            key: '2',
                            icon: <ShopOutlined />,
                            label: 'Product',
                        }
                    ]}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                    </div>
                    <div style={{ marginRight: '16px' }}>
                        <LogoutButton />
                    </div>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}

export default LayoutDefault;
