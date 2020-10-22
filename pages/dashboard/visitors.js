import dynamic from 'next/dynamic';
import { useState } from 'react'
import { Button, Layout, Menu, Table, Input, Row, Col, Form, DatePicker, Popconfirm, Modal } from "antd";
import { UserOutlined } from '@ant-design/icons'
import config from '../../global/configs'
import { withIronSession } from 'next-iron-session'
import Headers from '../../components/headers'
const QrReader = dynamic(() => import('react-qr-reader'), {
    ssr: false
});
const { Header, Footer, Sider, Content } = Layout
const { RangePicker } = DatePicker

function Dashboard({ user }) {
    const [form] = Form.useForm();
    const [visitor, setVisitor] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [visible, setVisible] = useState(false)
    const [QrCode, setQrCode] = useState('')

    const rangeConfig = {
        rules: [{ type: 'array', required: true, message: 'Please select visit time!' }],
    };

    const onFinishForm = async values => {
        const params = {
            from: values.visit_date[0].format('YYYY-MM-DD'),
            until: values.visit_date[1].format('YYYY-MM-DD')
        }
        setLoading(true)
        const { success, resdata } = await fetch(`${config.url}/visitors/list_visitors`,
            { method: "POST", body: JSON.stringify(params) })
            .then(res => res.json())
        setVisitor(resdata)
        setLoading(false)
    }

    const attendVisitor = async (id) => {
        const params = { id }
        setLoading(true)
        const { success, message } = await fetch(`${config.url}/visitors/attend_visitor`, {
            method: "POST", body: JSON.stringify(params)
        }).then(res => res.json())
        alert(message)
        if (success) {
            const data = visitor.map(item => {
                if (item.id != id) return item
                return { ...item, attend: 1 }
            })
            setVisitor(data)
        }
        setLoading(false)
    }

    const handleScan = data => {
        if (data) {
            setQrCode(data)
            attendVisitor(data)
            setVisible(false)
        }
    }

    const handleError = err => {
        console.error(err)
    }

    const columns = [
        {
            title: 'Register ID',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone'
        },
        {
            title: 'Visit Date',
            dataIndex: 'visit_date',
            key: 'visit_date'
        },
        {
            title: 'Registered Date',
            dataIndex: 'register_date',
            key: 'register_date'
        },
        {
            title: 'Attend',
            dataIndex: '',
            key: 'id',
            render: ({ id, attend }) => {
                return (
                    <Popconfirm
                        onConfirm={() => attendVisitor(id)}
                        title="are u sure ?"
                        okText="yes"
                        placement="topRight"
                        cancelText="no">
                        <Button type={attend ? "ghost" : "primary"} disabled={attend} size="small" >Attend</Button>
                    </Popconfirm>
                )
            }
        }
    ]

    return (
        <Layout>
            <Modal
                title="Basic Modal"
                visible={visible}
                onOk={() => setVisible(false)}
                onCancel={() => setVisible(false)}
            >
                <p>Scan your QR Code</p>
                {visible &&
                    <QrReader
                        delay={300}
                        onError={handleError}
                        onScan={handleScan}
                        style={{ width: '100%' }}
                    >
                        <p>{QrCode}</p>
                    </QrReader>
                }
            </Modal>
            <Headers user={user} />
            <Layout>
                <Sider width={200} style={{ backgroundColor: 'white' }} breakpoint="lg" collapsedWidth="0">
                    <Menu mode="inline" style={{ height: '100%', borderRight: 0 }} defaultSelectedKeys={"visitor"}>
                        <Menu.Item icon={<UserOutlined />} key="visitor">Visitors</Menu.Item>
                    </Menu>
                </Sider>
                <Content style={{ padding: 20, margin: 40, backgroundColor: 'white', height: '80vh' }}>
                    <Row>
                        <Col flex={1}>
                            <Form layout="inline" style={{ marginBottom: 20 }} form={form} onFinish={onFinishForm}>
                                <Form.Item label="Visit Date" {...rangeConfig} name="visit_date">
                                    <RangePicker format="DD-MM-YYYY" />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit"> Search </Button>
                                </Form.Item>
                            </Form>
                        </Col>
                        <Col>
                            <Button onClick={() => setVisible(true)}>Attend</Button>
                        </Col>
                    </Row>
                    <Table columns={columns} loading={isLoading} dataSource={visitor} size="small" scroll={{ x: '70vw' }} />
                </Content>
            </Layout>
        </Layout>
    )
}

export const getServerSideProps = withIronSession(
    async ({ req, res }) => {
        const user = req.session.get("user");

        if (!user) {
            res.statusCode = 302
            res.setHeader('Location', `/`)
            res.end();
            return
        }

        return {
            props: { user }
        };
    },
    {
        password: process.env.cookiePassword,
        cookieOptions: { secure: false },
        cookieName: process.env.cookieName
    }
);

export default Dashboard