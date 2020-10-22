import { useState } from 'react'
import { Button, Layout, Checkbox, Input, Form, Alert, Spin } from "antd";
import config from '../global/configs'
import { useRouter } from 'next/router'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Header from '../components/headers'

export default function Home() {
    const [form] = Form.useForm();
    const router = useRouter()
    const [isLoading, setLoading] = useState(false)
    const [alert, setAlert] = useState({})

    const onFinishForm = async (values) => {
        setLoading(true)
        const { success, message } = await fetch(`${config.url}/users/login`,
            { method: "POST", body: JSON.stringify(values) })
            .then(res => res.json())
        setLoading(false)
        setAlert({ type: success ? "success" : "error", message })
        if (success) router.push('/dashboard/visitors')
    };

    return (
        <Layout>
            <Header user={false} />
            <Layout style={{ height: "92vh" }}>
                <div style={{ marginTop: '200px', alignSelf: 'center', textAlign: 'left', minWidth: 300, maxWidth: 300, backgroundColor: 'white' }}>
                    <div style={{ padding: 20, backgroundColor: 'black', fontWeight: 800, color: "white" }}>
                        Login
                    </div>
                    <Form
                        layout='vertical'
                        initialValues={{ remember: false }}
                        form={form}
                        style={{ padding: 20, margin: 0 }}
                        onFinish={onFinishForm}>
                        <Form.Item
                            name="username"
                            required
                            tooltip="your username"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            required
                            tooltip="your password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Password" />
                        </Form.Item>
                        <Form.Item name="remember" valuePropName="checked">
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" disabled={isLoading} style={{ width: "100%" }}> {isLoading ? <Spin /> : 'Login'} </Button>
                        </Form.Item>
                        {alert.message && <Alert message={alert.message} type={alert.type}></Alert>}
                    </Form>
                </div>
            </Layout>
        </Layout>
    )
}