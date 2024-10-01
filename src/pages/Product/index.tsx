import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined, EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { InputRef, TableColumnsType, TableColumnType } from 'antd';
import { Button, Input, Space, Table, message, Popconfirm } from 'antd';
import type { FilterDropdownProps, TablePaginationConfig } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { getListProduct, deleteProduct } from '../../services/productService';
import { useNavigate } from 'react-router-dom';

interface Product {
    key: string;
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
}

type DataIndex = keyof Product;

const ProductTable: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [data, setData] = useState<Product[]>([]);
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
                const response = await getListProduct(current ? current - 1 : 0, pageSize || 10, 'id', 'ASC');
                const result = await response.json();

                if (result.status !== 200) {
                    throw new Error(result.message);
                }

                setData(result.data.content.map((item: any, index: number) => ({
                    key: item.id.toString(),
                    id: item.id.toString(),
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    quantity: item.quantity,
                    number: (current as number - 1) * (pageSize || 10) + index + 1,
                })));

                setPagination((prev) => ({
                    ...prev,
                    total: result.data.totalElements,
                }));
            } catch (error: any) {
                console.error('Failed to fetch data:', error);
                message.error(error.message);
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

    const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<Product> => ({
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

    const handleUpdate = (id: string) => {
        navigate(`/product/update/${id}`);
    };

    const handleCreateNewProduct = () => {
        navigate('/product/create');
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await deleteProduct(id);

            if (response.status === 403) {
                message.error('Bạn không đủ quyền để xóa sản phẩm này.');
                return;
            }

            if (response.ok) {
                message.success('Product deleted successfully');
                setData((prevData) => prevData.filter((item) => item.id !== id));
            } else {
                throw new Error('Failed to delete product');
            }
        } catch (error: any) {
            console.error('Failed to delete product:', error);
            message.error(error.message || 'Failed to delete product');
        }
    };

    const columns: TableColumnsType<Product> = [
        {
            title: 'No.',
            dataIndex: 'number',
            key: 'number',
            width: '5%',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: '30%',
            ...getColumnSearchProps('description'),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: '15%',
            sorter: (a, b) => a.price - b.price,
            render: (text) => `$${text}`,
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            width: '15%',
            sorter: (a, b) => a.quantity - b.quantity,
        },
        {
            title: 'Action',
            key: 'action',
            width: '15%',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleUpdate(record.id)}
                    >
                        Update
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this product?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} danger>
                            Delete
                        </Button>
                    </Popconfirm>
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
                onClick={handleCreateNewProduct}
            >
                Create New Product
            </Button>
            <Table<Product>
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

export default ProductTable;