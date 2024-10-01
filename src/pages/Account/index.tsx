import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { InputRef, TableColumnsType, TableColumnType } from 'antd';
import { Button, Input, Space, Table, message, Switch } from 'antd';
import type { FilterDropdownProps, TablePaginationConfig } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { getListAccount, updateAccountStatus } from '../../services/accountService';
import { getCookie } from '../../utils/cookies';
import { useNavigate } from 'react-router-dom';

interface Account {
    key: string;
    id: string;
    username: string;
    email: string;
    status: string;
    role: string;
}

type DataIndex = keyof Account;

const roleMap: Record<number, string> = {
    1: 'Admin',
    2: 'User',
    3: 'Editor',
    4: 'Manager',
};

const AccountTable: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [data, setData] = useState<Account[]>([]);
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const searchInput = useRef<InputRef>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const { current, pageSize } = pagination;

            try {
                const token = getCookie("token") as string;
                const response = await getListAccount(current ? current - 1 : 0, pageSize || 10, 'id', 'ASC', token);

                if (response.status === 403) {
                    // Nếu gặp lỗi 403 - không đủ quyền
                    message.error('Bạn không đủ quyền để xem danh sách tài khoản.');
                    return;
                }

                if (!response.ok) {
                    // Nếu phản hồi không thành công (không phải 200 - 299)
                    throw new Error('Failed to fetch data');
                }

                const result = await response.json();

                // Cập nhật dữ liệu từ response JSON
                setData(result.data.content.map((item: any, index: number) => ({
                    key: item.id.toString(),
                    id: item.id.toString(),
                    username: item.username,
                    email: item.email,
                    status: item.status,
                    role: roleMap[item.roleId] || 'Unknown',
                    number: (current as number - 1) * (pageSize || 10) + index + 1,
                })));

                // Cập nhật phân trang từ response JSON
                setPagination((prev) => ({
                    ...prev,
                    total: result.data.totalElements,
                }));
            } catch (error: any) {
                console.error('Failed to fetch data:', error);
                message.error(error.message || 'Failed to fetch data from server');
            }
        };

        fetchData();
    }, [pagination.current, pagination.pageSize]);

    const handleTableChange = (newPagination: TablePaginationConfig) => {
        setPagination(newPagination);
    };

    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps['confirm'],
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<Account> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const handleStatusToggle = async (account: Account) => {
        try {
            const newStatus = account.status === 'active' ? 'inactive' : 'active';
            const response = await updateAccountStatus(account.id, newStatus);

            if (response.status === 403) {
                message.error('Bạn không đủ quyền để thay đổi trạng thái tài khoản này.');
                return;
            }

            if (!response.ok) {
                throw new Error(`Failed to update status: ${response.status}`);
            }

            message.success('Status updated successfully');

            // Cập nhật lại trạng thái của người dùng trong bảng
            setData((prevData) =>
                prevData.map((item) =>
                    item.id === account.id ? { ...item, status: newStatus } : item
                )
            );
        } catch (error: any) {
            message.error(error.message || 'Failed to update status');
        }
    };

    const handleUpdate = (id: string) => {
        navigate(`/account/update/${id}`);
    };

    const handleCreateNewAccount = () => {
        navigate('/account/create');
    };

    const columns: TableColumnsType<Account> = [
        {
            title: 'No.',
            dataIndex: 'number',
            key: 'number',
            width: '5%',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            width: '20%',
            ...getColumnSearchProps('username'),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '25%',
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: '15%',
            render: (_, record) => (
                <Switch
                    checked={record.status === 'active'}
                    onChange={() => handleStatusToggle(record)}
                    style={{ width: 40, backgroundColor: record.status === 'active' ? 'blue' : undefined }}
                />
            ),
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            width: '15%',
            ...getColumnSearchProps('role'),
        },
        {
            title: 'Action',
            key: 'action',
            width: '20%',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleUpdate(record.id)}
                    >
                        Update
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ marginBottom: 16 }}
                onClick={handleCreateNewAccount}
            >
                Create New Account
            </Button>
            <Table<Account>
                columns={columns}
                dataSource={data}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20'],
                }}
                onChange={handleTableChange}
            />
        </>
    );
};

export default AccountTable;